import { Client } from 'pg';
import WinstonLogger from '@/utils/log-utils';
import {
  Connection,
  ConnectionConfig,
  DatabasePluginConnectionManager,
  QueryResult,
} from '../../types/plugin.types';

export class PostgreSQLConnectionManager implements DatabasePluginConnectionManager {
  private readonly _logger = WinstonLogger.getInstance().getLogger('PostgreSQLConnectionManager');

  async createConnection(
    config: ConnectionConfig,
  ): Promise<{ connection: Connection; client: any }> {
    const client = new Client({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
    });
    try {
      await client.connect();
      return {
        connection: {
          connectionId: `postgresql-${crypto.randomUUID()}`,
          connectionConfig: config,
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
        },
        client: client,
      };
    } catch (error) {
      await client.end();
      throw new Error(`Failed to connect to PostgreSQL: ${error}`);
    }
  }

  async getServerVersion(client: Client): Promise<string> {
    try {
      const res = await client.query('SELECT version()');
      const version = res.rows[0]?.version || 'Unknown';
      return version;
    } catch (error) {
      throw new Error(`Failed to get server version: ${error}`);
    }
  }

  async executeQuery(client: Client, query: string): Promise<QueryResult> {
    try {
      const res = await client.query(query);
      return {
        success: true,
        message: 'Query executed successfully',
        result: {
          rows: res.rows,
          rowCount: res.rowCount,
          fields: res.fields,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `${error}`,
      };
    }
  }

  async closeConnection(connection: Connection, client: Client): Promise<boolean> {
    this._logger.info(`Closing PostgreSQL connection for ${connection.connectionId}`);
    try {
      await client.end();
      connection.isActive = false;
      connection.updatedAt = new Date();
      return true;
    } catch (error) {
      throw new Error(`Failed to close PostgreSQL connection: ${error}`);
    }
  }
}
