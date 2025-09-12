import { DatabasePlugin, DatabasePluginConfig, SupportedDbIdentifier } from './types/plugin.types';

export class PluginRegistry {
  private static instance: PluginRegistry;
  private plugins = new Map<SupportedDbIdentifier, DatabasePlugin>();

  private constructor() {}

  public register(plugin: DatabasePlugin) {
    const config = plugin.getConfig();
    this.plugins.set(config.id, plugin);
  }

  public getAllPlugins(): DatabasePlugin[] {
    return Array.from(this.plugins.values());
  }

  public getPlugin(id: SupportedDbIdentifier): DatabasePlugin {
    const plugin = this.plugins.get(id);
    if (!plugin) {
      throw new Error(`Plugin "${id}" not found`);
    }
    return plugin;
  }

  public getPluginConfig(id: SupportedDbIdentifier): DatabasePluginConfig {
    return this.getPlugin(id).getConfig();
  }

  public static getInstance(): PluginRegistry {
    if (!PluginRegistry.instance) {
      PluginRegistry.instance = new PluginRegistry();
    }
    return PluginRegistry.instance;
  }
}
