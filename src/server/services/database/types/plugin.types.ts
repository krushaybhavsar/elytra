import { MetadataProvider } from './metadata.types';

export enum SupportedDbIdentifier {
  POSTGRESQL = 'postgresql',
}

export interface DatabasePluginConfig {
  id: SupportedDbIdentifier;
  name: string;
}

export interface Connection {
  connectionId: string;
  connectionConfig: ConnectionConfig;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface ConnectionConfig {
  pluginId: SupportedDbIdentifier;
  name: string;
  host: string;
  port: number;
  database: string;
  user?: string;
  password?: string;
}

export interface ConnectionResult {
  success: boolean;
  message: string;
  connectionTime?: number;
}

export interface QueryResult {
  success: boolean;
  message: string;
  result?: {
    rows: any[];
    rowCount: number | null;
    fields: any;
    executionTimeMs: number;
  };
}

export interface DatabasePlugin {
  getConfig(): DatabasePluginConfig;
  getConnectionManager(): DatabasePluginConnectionManager;
  getMetadata(): MetadataProvider;
}

export interface DatabasePluginConnectionManager {
  createConnection(config: ConnectionConfig): Promise<{ pool: any; connection: Connection }>;
  getServerVersion(pool: any): Promise<string>;
  executeQuery(pool: any, query: string): Promise<QueryResult>;
  closeConnection(connection: Connection, pool: any): Promise<boolean>;
  isConnectionHealthy(pool: any): Promise<boolean>;
}
