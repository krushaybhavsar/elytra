import WinstonLogger from '@/utils/log-utils';
import { PluginRegistry } from './PluginRegistry';
import { storageService } from '../service.config';
import { STORE_KEYS } from '../storage/schema';
import { Connection, ConnectionConfig, ConnectionResult, QueryResult } from './types/plugin.types';

export class DatabaseConnectionManager {
  private static instance: DatabaseConnectionManager;
  private readonly _pluginRegistry = PluginRegistry.getInstance();
  private readonly _logger = WinstonLogger.getInstance().getLogger('DatabaseConnectionManager');
  private connections = new Map<string, Connection>();
  private pools = new Map<string, any>();

  private constructor() {}

  async getPool(connectionId: string): Promise<any> {
    const connection = this.connections.get(connectionId);
    const pool = this.pools.get(connectionId);
    if (pool) {
      return pool;
    }
    if (connection) {
      const plugin = this._pluginRegistry.getPlugin(connection.connectionConfig.pluginId);
      const connectionManager = plugin.getConnectionManager();
      const { client } = await connectionManager.createConnection(connection.connectionConfig);
      this.pools.set(connectionId, client);
      this.updateConnection(connectionId, { ...connection, updatedAt: new Date() });
      return client;
    } else {
      throw new Error(`Connection ${connectionId} not found`);
    }
  }

  async createConnection(
    config: ConnectionConfig,
  ): Promise<{ connection?: Connection; result: ConnectionResult }> {
    try {
      const plugin = this._pluginRegistry.getPlugin(config.pluginId);
      const { connection, client } = await plugin.getConnectionManager().createConnection(config);
      this.connections.set(connection.connectionId, connection);
      this.pools.set(connection.connectionId, client);
      storageService.set(STORE_KEYS.CONNECTIONS, Array.from(this.connections.values()));
      return {
        connection,
        result: {
          success: true,
          message: 'Connection created successfully',
        },
      };
    } catch (error: any) {
      return {
        result: {
          success: false,
          message: error.message,
        },
      };
    }
  }

  async testConnection(config: ConnectionConfig): Promise<ConnectionResult> {
    try {
      const startTime = Date.now();
      const plugin = this._pluginRegistry.getPlugin(config.pluginId);
      const connectionManager = plugin.getConnectionManager();
      const { connection, client } = await connectionManager.createConnection(config);
      const serverVersion = await connectionManager.getServerVersion(client);
      await connectionManager.closeConnection(connection, client);
      const connectionTime = Date.now() - startTime;
      return {
        success: true,
        message: serverVersion,
        connectionTime,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  async executeQuery(connectionId: string, query: string): Promise<QueryResult> {
    const connection = this.connections.get(connectionId);
    const client = await this.getPool(connectionId);
    if (connection && client) {
      const plugin = this._pluginRegistry.getPlugin(connection.connectionConfig.pluginId);
      return await plugin.getConnectionManager().executeQuery(client, query);
    } else {
      this._logger.warn(`Connection ${connectionId} not found`);
      return {
        success: false,
        message: `Connection ${connectionId} not found`,
      };
    }
  }

  async closeConnection(connectionId: string): Promise<void> {
    const connection = this.connections.get(connectionId);
    const client = this.getPool(connectionId);
    if (connection && client) {
      const plugin = this._pluginRegistry.getPlugin(connection.connectionConfig.pluginId);
      await plugin.getConnectionManager().closeConnection(connection, client);
      this.connections.delete(connectionId);
      storageService.set(STORE_KEYS.CONNECTIONS, Array.from(this.connections.values()));
    } else {
      this._logger.warn(`Connection ${connectionId} not found`);
    }
  }

  async deleteAllConnections(): Promise<void> {
    for (const connectionId of this.connections.keys()) {
      await this.closeConnection(connectionId);
    }
    this.connections.clear();
    storageService.set(STORE_KEYS.CONNECTIONS, []);
  }

  async updateConnection(connectionId: string, connection: Connection): Promise<void> {
    if (connectionId !== connection.connectionId) {
      this._logger.warn('Connection ID in path and body do not match');
      return;
    }
    this.connections.set(connection.connectionId, connection);
    storageService.set(STORE_KEYS.CONNECTIONS, Array.from(this.connections.values()));
  }

  getAllConnections(): Connection[] {
    storageService.get(STORE_KEYS.CONNECTIONS).forEach((conn) => {
      if (!this.connections.has(conn.connectionId)) {
        this.connections.set(conn.connectionId, conn);
      }
    });
    return Array.from(this.connections.values());
  }

  public static getInstance(): DatabaseConnectionManager {
    if (!DatabaseConnectionManager.instance) {
      DatabaseConnectionManager.instance = new DatabaseConnectionManager();
    }
    return DatabaseConnectionManager.instance;
  }
}
