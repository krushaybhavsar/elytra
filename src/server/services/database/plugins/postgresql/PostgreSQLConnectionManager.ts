import {
  Connection,
  ConnectionConfig,
  ConnectionManager,
  SupportedDatabaseType,
} from '../../types';

export class PostgreSQLConnectionManager implements ConnectionManager {
  async createConnection(config: ConnectionConfig): Promise<Connection> {
    return {
      dbType: SupportedDatabaseType.POSTGRESQL,
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
