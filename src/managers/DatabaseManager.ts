import DataSource from '@/services/DataSource';

export default class DatabaseManager {
  readonly dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async getSupportedDatabases(): Promise<string[]> {
    return this.dataSource.getSupportedDatabases();
  }
}
