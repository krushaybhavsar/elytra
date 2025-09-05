import { Connection, ConnectionConfig, ConnectionTestResult } from '@/model/DatabaseModel';
import DataSource from '@/services/DataSource';

export default class DbConnectionManager {
  readonly dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async createConnection(config: ConnectionConfig): Promise<Connection> {
    return await this.dataSource.createConnection(config);
  }

  async testConnection(config: ConnectionConfig): Promise<ConnectionTestResult> {
    return await this.dataSource.testConnection(config);
  }

  async closeConnection(connectionId: string): Promise<void> {
    return await this.dataSource.closeConnection(connectionId);
  }
}
