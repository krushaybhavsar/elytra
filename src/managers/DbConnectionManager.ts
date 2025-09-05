import { Connection, ConnectionConfig, ConnectionResult } from '@/model/DatabaseModel';
import DataSource from '@/services/DataSource';

export default class DbConnectionManager {
  readonly dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async createConnection(
    config: ConnectionConfig,
  ): Promise<{ connection?: Connection; result: ConnectionResult }> {
    return await this.dataSource.createConnection(config);
  }

  async testConnection(config: ConnectionConfig): Promise<ConnectionResult> {
    return await this.dataSource.testConnection(config);
  }

  async closeConnection(connectionId: string): Promise<void> {
    return await this.dataSource.closeConnection(connectionId);
  }
}
