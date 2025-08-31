import { PluginRegistry } from './PluginRegistry';
import { Connection, ConnectionConfig, ConnectionTestResult } from './types';

export class DatabaseConnectionManager {
  private static instance: DatabaseConnectionManager;
  private readonly _pluginRegistry = PluginRegistry.getInstance();
  private connections = new Map<string, Connection>();

  private constructor() {}

  async createConnection(config: ConnectionConfig): Promise<Connection> {
    const plugin = this._pluginRegistry.getPlugin(config.pluginId);
    const connection = await plugin.getConnectionManager().createConnection(config);
    this.connections.set(connection.connectionId, connection);
    return connection;
  }

  async testConnection(config: ConnectionConfig): Promise<ConnectionTestResult> {
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
    }
  }

  public static getInstance(): DatabaseConnectionManager {
    if (!DatabaseConnectionManager.instance) {
      DatabaseConnectionManager.instance = new DatabaseConnectionManager();
    }
    return DatabaseConnectionManager.instance;
  }
}
