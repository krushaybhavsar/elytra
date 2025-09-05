import {
  Connection,
  ConnectionConfig,
  ConnectionTestResult,
  DatabaseConfig,
} from '@/model/DatabaseModel';
import { SupportedDbIdentifier } from '@/types/database';

export default interface DataSource {
  getSupportedDbIds(): Promise<SupportedDbIdentifier[]>;
  getSupportedDbConfigs(): Promise<DatabaseConfig[]>;
  getSupportedDbConfig(id: SupportedDbIdentifier): Promise<DatabaseConfig | undefined>;
  createConnection(config: ConnectionConfig): Promise<Connection>;
  testConnection(config: ConnectionConfig): Promise<ConnectionTestResult>;
  closeConnection(connectionId: string): Promise<void>;
}
