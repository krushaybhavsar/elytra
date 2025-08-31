import { PluginRegistry } from '../../services/database/PluginRegistry';
import { DatabaseConfig, SupportedDbIdentifier } from '../../services/database/types';
import { Controller, Get, Route } from 'tsoa';

@Route('database')
export class DatabaseController extends Controller {
  @Get('plugins/ids')
  async getSupportedDbIds(): Promise<SupportedDbIdentifier[]> {
    return PluginRegistry.getAllPlugins().map((plugin) => plugin.getConfig().id);
  }

  @Get('plugins/configs')
  async getSupportedDbConfigs(): Promise<DatabaseConfig[]> {
    return PluginRegistry.getAllPlugins().map((plugin) => plugin.getConfig());
  }

  @Get('plugin/{id}/config')
  async getSupportedDbConfig(id: SupportedDbIdentifier): Promise<DatabaseConfig | undefined> {
    return PluginRegistry.getPluginConfig(id);
  }
}
