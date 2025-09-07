import {
  Connection,
  ConnectionConfig,
  ConnectionResult,
  DatabaseConfig,
} from '@/model/DatabaseModel';
import { SupportedDbIdentifier } from '@/types/database';

export default interface DataSource {
  getSupportedDbIds(): Promise<SupportedDbIdentifier[]>;
  getSupportedDbConfigs(): Promise<DatabaseConfig[]>;
  getSupportedDbConfig(id: SupportedDbIdentifier): Promise<DatabaseConfig | undefined>;
  createConnection(
    config: ConnectionConfig,
  ): Promise<{ connection?: Connection; result: ConnectionResult }>;
  testConnection(config: ConnectionConfig): Promise<ConnectionResult>;
  closeConnection(connectionId: string): Promise<void>;
  getAllConnections(): Promise<Connection[]>;
}
