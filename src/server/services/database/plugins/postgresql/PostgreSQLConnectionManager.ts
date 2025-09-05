import { Client } from 'pg';
import { Connection, ConnectionConfig, DatabasePluginConnectionManager } from '../../types';
import WinstonLogger from '@/utils/log-utils';

interface PostgreSQLConnection extends Connection {
  client: Client;
}

export class PostgreSQLConnectionManager implements DatabasePluginConnectionManager {
  private readonly _logger = WinstonLogger.getInstance().getLogger('PostgreSQLConnectionManager');

  async createConnection(config: ConnectionConfig): Promise<Connection> {
    const client = new Client({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
    });
    try {
      await client.connect();
      const connection: PostgreSQLConnection = {
        connectionId: `postgresql-${crypto.randomUUID()}`,
        connectionConfig: config,
        createdAt: new Date(),
        isActive: true,
        client,
      };
      return connection;
    } catch (error) {
      await client.end();
      throw new Error(`Failed to connect to PostgreSQL: ${error}`);
    }
  }

  async getServerVersion(connection: Connection): Promise<string> {
    const pgConnection = connection as PostgreSQLConnection;
    try {
      const res = await pgConnection.client.query('SELECT version()');
      const version = res.rows[0]?.version || 'Unknown';
      return version;
    } catch (error) {
      throw new Error(`Failed to get server version: ${error}`);
    }
  }

  async closeConnection(connection: Connection): Promise<boolean> {
    const pgConnection = connection as PostgreSQLConnection;
    this._logger.info(`Closing PostgreSQL connection for ${pgConnection.connectionId}`);
    try {
      await pgConnection.client.end();
      connection.isActive = false;
      return true;
    } catch (error) {
      throw new Error(`Failed to close PostgreSQL connection: ${error}`);
    }
  }
}
