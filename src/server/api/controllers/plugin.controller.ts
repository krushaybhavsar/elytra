import {
  DatabasePluginConfig,
  SupportedDbIdentifier,
} from '../../services/database/types/plugin.types';
import { PluginRegistry } from '../../services/database/PluginRegistry';
import { Controller, Get, Path, Route } from 'tsoa';

@Route('plugins')
export class PluginController extends Controller {
  private readonly _pluginRegistry = PluginRegistry.getInstance();

  @Get('ids')
  async getSupportedDbIds(): Promise<SupportedDbIdentifier[]> {
    return this._pluginRegistry.getAllPlugins().map((plugin) => plugin.getConfig().id);
  }

  @Get('configs')
  async getSupportedDbConfigs(): Promise<DatabasePluginConfig[]> {
    return this._pluginRegistry.getAllPlugins().map((plugin) => plugin.getConfig());
  }

  @Get('{id}/config')
  async getSupportedDbConfig(
    @Path() id: SupportedDbIdentifier,
  ): Promise<DatabasePluginConfig | undefined> {
    return this._pluginRegistry.getPluginConfig(id);
  }
}
