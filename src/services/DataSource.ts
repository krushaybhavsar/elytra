import { DatabaseConfig } from '@/model/DatabaseModel';

export default interface DataSource {
  getSupportedDbIds(): Promise<string[]>;
  getSupportedDbConfigs(): Promise<DatabaseConfig[]>;
  getSupportedDbConfig(id: string): Promise<DatabaseConfig | undefined>;
}
