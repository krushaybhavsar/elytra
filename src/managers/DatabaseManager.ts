import { DatabaseConfig } from '@/model/DatabaseModel';
import DataSource from '@/services/DataSource';

export default class DatabaseManager {
  readonly dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async getSupportedDbIds(): Promise<string[]> {
    return this.dataSource.getSupportedDbIds();
  }

  async getSupportedDbConfigs(): Promise<DatabaseConfig[]> {
    return this.dataSource.getSupportedDbConfigs();
  }

  async getSupportedDbConfig(id: string): Promise<DatabaseConfig | undefined> {
    return this.dataSource.getSupportedDbConfig(id);
  }
}
