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
  isActive: boolean;
}

export interface ConnectionConfig {
  pluginId: SupportedDbIdentifier;
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

export interface DatabasePlugin {
  getConfig(): DatabasePluginConfig;
  getConnectionManager(): DatabasePluginConnectionManager;
  getMetadata(): MetadataProvider;
}

export interface DatabasePluginConnectionManager {
  createConnection(config: ConnectionConfig): Promise<Connection>;
  getServerVersion(connection: Connection): Promise<string>;
  closeConnection(connection: Connection): Promise<boolean>;
}

export interface MetadataProvider {
  getSchemas(connection: Connection): Promise<string[]>;
  getTables(connection: Connection, schema: string): Promise<string[]>;
  getColumns(connection: Connection, schema: string, table: string): Promise<string[]>;
}
