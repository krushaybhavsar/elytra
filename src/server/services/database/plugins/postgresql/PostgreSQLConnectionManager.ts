import { Client } from 'pg';
import { Connection, ConnectionConfig, DatabasePluginConnectionManager } from '../../types';

interface PostgreSQLConnection extends Connection {
  client: Client;
}

export class PostgreSQLConnectionManager implements DatabasePluginConnectionManager {
  async createConnection(config: ConnectionConfig): Promise<Connection> {
    const client = new Client({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database,
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
      throw new Error(
        `Failed to connect to PostgreSQL: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async getServerVersion(connection: Connection): Promise<string> {
    const pgConnection = connection as PostgreSQLConnection;
    try {
      const res = await pgConnection.client.query('SELECT version()');
      const version = res.rows[0]?.version || 'Unknown';
      return version;
    } catch (error) {
      throw new Error(
        `Failed to get server version: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async closeConnection(connection: Connection): Promise<boolean> {
    const pgConnection = connection as PostgreSQLConnection;
    try {
      await pgConnection.client.end();
      connection.isActive = false;
      return true;
    } catch (error) {
      throw new Error(
        `Failed to close PostgreSQL connection: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
