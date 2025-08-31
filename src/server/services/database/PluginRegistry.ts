import { DatabaseConfig, DatabasePlugin, SupportedDbIdentifier } from './types';

export class PluginRegistry {
  private static plugins = new Map<SupportedDbIdentifier, DatabasePlugin>();

  public static register(plugin: DatabasePlugin) {
    const config = plugin.getConfig();
    this.plugins.set(config.id, plugin);
  }

  public static getAllPlugins(): DatabasePlugin[] {
    return Array.from(this.plugins.values());
  }

  public static getPlugin(id: SupportedDbIdentifier): DatabasePlugin | undefined {
    return this.plugins.get(id);
  }

  public static getPluginConfig(id: SupportedDbIdentifier): DatabaseConfig | undefined {
    return this.getPlugin(id)?.getConfig();
  }
}
