import { Pool, PoolClient } from 'pg';
import WinstonLogger from '@/utils/log-utils';
import {
  Connection,
  ConnectionConfig,
  DatabasePluginConnectionManager,
  QueryResult,
} from '../../types/plugin.types';

export class PostgreSQLConnectionManager implements DatabasePluginConnectionManager {
  private readonly _logger = WinstonLogger.getInstance().getLogger('PostgreSQLConnectionManager');

  async createConnection(config: ConnectionConfig): Promise<{ connection: Connection; pool: any }> {
    const pool = new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password,
      min: 1,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      allowExitOnIdle: false,
    });

    pool.on('error', (err) => {
      this._logger.error('Unexpected error on idle PostgreSQL client', err);
    });

    try {
      const client = await pool.connect();
      client.release();
      return {
        connection: {
          connectionId: `postgresql-${crypto.randomUUID()}`,
          connectionConfig: config,
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true,
        },
        pool: pool,
      };
    } catch (error) {
      await pool.end();
      throw new Error(`Failed to connect to PostgreSQL: ${error}`);
    }
  }

  async getServerVersion(pool: Pool): Promise<string> {
    let client: PoolClient | null = null;
    try {
      client = await pool.connect();
      const res = await client.query('SELECT version()');
      const version = res.rows[0]?.version || 'Unknown';
      return version;
    } catch (error) {
      throw new Error(`Failed to get server version: ${error}`);
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async executeQuery(pool: Pool, query: string): Promise<QueryResult> {
    let client: PoolClient | null = null;
    try {
      client = await pool.connect();
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
    } finally {
      if (client) {
        client.release();
      }
    }
  }

  async closeConnection(connection: Connection, pool: Pool): Promise<boolean> {
    this._logger.info(`Closing PostgreSQL connection for ${connection.connectionId}`);
    try {
      await pool.end();
      connection.isActive = false;
      connection.updatedAt = new Date();
      return true;
    } catch (error) {
      throw new Error(`Failed to close PostgreSQL connection: ${error}`);
    }
  }

  async isConnectionHealthy(pool: Pool): Promise<boolean> {
    let client: PoolClient | null = null;
    try {
      client = await pool.connect();
      await client.query('SELECT 1');
      return true;
    } catch (error) {
      this._logger.warn('Connection health check failed', error);
      return false;
    } finally {
      if (client) {
        client.release();
      }
    }
  }
}
