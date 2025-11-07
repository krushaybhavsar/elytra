import {
  Connection,
  ConnectionConfig,
  ConnectionResult,
  DatabaseConfig,
  QueryResult,
} from '@/model/DatabaseModel';
import { SupportedDbIdentifier } from '@/types/database.types';

export default interface DataSource {
  getSupportedDbIds(): Promise<SupportedDbIdentifier[]>;
  getSupportedDbConfigs(): Promise<DatabaseConfig[]>;
  getSupportedDbConfig(id: SupportedDbIdentifier): Promise<DatabaseConfig | undefined>;
  createConnection(
    config: ConnectionConfig,
  ): Promise<{ connection?: Connection; result: ConnectionResult }>;
  testConnection(config: ConnectionConfig): Promise<ConnectionResult>;
  executeQuery(connectionId: string, query: string): Promise<QueryResult>;
  closeConnection(connectionId: string): Promise<void>;
  updateConnection(connection: Connection): Promise<void>;
  getAllConnections(): Promise<Connection[]>;
}
