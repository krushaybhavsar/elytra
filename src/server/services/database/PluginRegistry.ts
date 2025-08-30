import { DatabaseConfig, DatabasePlugin, SupportedDatabaseType } from './types';

export class PluginRegistry {
  private static plugins = new Map<SupportedDatabaseType, DatabasePlugin>();

  public static register(plugin: DatabasePlugin) {
    const config = plugin.getConfig();
    this.plugins.set(config.dbType, plugin);
  }

  public static getPlugin(dbType: SupportedDatabaseType): DatabasePlugin | undefined {
    return this.plugins.get(dbType);
  }

  public static getPluginConfig(dbType: SupportedDatabaseType): DatabaseConfig | undefined {
    return this.getPlugin(dbType)?.getConfig();
  }

  public static getPluginCount(): number {
    return this.plugins.size;
  }
}
