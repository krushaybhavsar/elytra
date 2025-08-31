import { Connection, ConnectionConfig, ConnectionManager } from '../../types';

export class PostgreSQLConnectionManager implements ConnectionManager {
  async createConnection(config: ConnectionConfig): Promise<Connection> {
    return {
      dbIdentifier: 'postgresql',
      connectionConfig: config,
      createdAt: new Date(),
      isActive: true,
    };
  }

  async testConnection(config: ConnectionConfig): Promise<boolean> {
    return true;
  }

  closeConnection(connection: Connection): Promise<void> {
    return Promise.resolve();
  }
}
