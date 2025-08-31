import { DatabaseConfig } from '@/model/DatabaseModel';
import DataSource from '@/services/DataSource';
import { SupportedDbIdentifier } from '@/types/database';

export default class DatabaseManager {
  readonly dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async getSupportedDbIds(): Promise<SupportedDbIdentifier[]> {
    return this.dataSource.getSupportedDbIds();
  }

  async getSupportedDbConfigs(): Promise<DatabaseConfig[]> {
    return this.dataSource.getSupportedDbConfigs();
  }

  async getSupportedDbConfig(id: SupportedDbIdentifier): Promise<DatabaseConfig | undefined> {
    return this.dataSource.getSupportedDbConfig(id);
  }
}
