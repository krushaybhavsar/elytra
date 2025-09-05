import WinstonLogger from '@/utils/log-utils';
import { PluginRegistry } from './PluginRegistry';
import { Connection, ConnectionConfig, ConnectionResult } from './types';

export class DatabaseConnectionManager {
  private static instance: DatabaseConnectionManager;
  private readonly _pluginRegistry = PluginRegistry.getInstance();
  private readonly _logger = WinstonLogger.getInstance().getLogger('DatabaseConnectionManager');
  private connections = new Map<string, Connection>();

  private constructor() {}

  async createConnection(
    config: ConnectionConfig,
  ): Promise<{ connection?: Connection; result: ConnectionResult }> {
    try {
      const plugin = this._pluginRegistry.getPlugin(config.pluginId);
      const connection = await plugin.getConnectionManager().createConnection(config);
      this.connections.set(connection.connectionId, connection);
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
      const testConnection = await connectionManager.createConnection(config);
      const serverVersion = await connectionManager.getServerVersion(testConnection);
      await this.closeConnection(testConnection.connectionId);
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

  async closeConnection(connectionId: string): Promise<void> {
    const connection = this.connections.get(connectionId);
    if (connection) {
      const plugin = this._pluginRegistry.getPlugin(connection.connectionConfig.pluginId);
      await plugin.getConnectionManager().closeConnection(connection);
      this.connections.delete(connectionId);
    } else {
      this._logger.warn(`Connection ${connectionId} not found`);
    }
  }

  getAllConnectionIds(): string[] {
    return Array.from(this.connections.keys());
  }

  public static getInstance(): DatabaseConnectionManager {
    if (!DatabaseConnectionManager.instance) {
      DatabaseConnectionManager.instance = new DatabaseConnectionManager();
    }
    return DatabaseConnectionManager.instance;
  }
}
