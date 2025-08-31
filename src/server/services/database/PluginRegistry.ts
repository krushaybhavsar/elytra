import { DatabaseConfig, DatabasePlugin } from './types';

export class PluginRegistry {
  private static plugins = new Map<string, DatabasePlugin>();

  public static register(plugin: DatabasePlugin) {
    const config = plugin.getConfig();
    this.plugins.set(config.id, plugin);
  }

  public static getAllPlugins(): DatabasePlugin[] {
    return Array.from(this.plugins.values());
  }

  public static getPlugin(id: string): DatabasePlugin | undefined {
    return this.plugins.get(id);
  }

  public static getPluginConfig(id: string): DatabaseConfig | undefined {
    return this.getPlugin(id)?.getConfig();
  }
}
