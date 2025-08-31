export enum SupportedDbIdentifier {
  POSTGRESQL = 'postgresql',
}

export interface DatabaseConfig {
  id: SupportedDbIdentifier;
  name: string;
}

export interface Connection {
  dbId: SupportedDbIdentifier;
  connectionConfig: ConnectionConfig;
  createdAt: Date;
  isActive: boolean;
}

export interface ConnectionConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database?: string;
  schema?: string;
}

export interface DatabasePlugin {
  getConfig(): DatabaseConfig;
  getMetadata(): MetadataProvider;
  getConnectionManager(): ConnectionManager;
}

export interface MetadataProvider {
  getSchemas(connection: Connection): Promise<string[]>;
  getTables(connection: Connection, schema: string): Promise<string[]>;
  getColumns(connection: Connection, schema: string, table: string): Promise<string[]>;
}

export interface ConnectionManager {
  createConnection(config: ConnectionConfig): Promise<Connection>;
  testConnection(config: ConnectionConfig): Promise<boolean>;
  closeConnection(connection: Connection): Promise<void>;
}
