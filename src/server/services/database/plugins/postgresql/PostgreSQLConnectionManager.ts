import { Connection, ConnectionConfig, DatabasePluginConnectionManager } from '../../types';

export class PostgreSQLConnectionManager implements DatabasePluginConnectionManager {
  createConnection(config: ConnectionConfig): Promise<Connection> {}

  getServerVersion(connection: Connection): Promise<string> {}

  closeConnection(connection: Connection): Promise<boolean> {}
}
