import { PluginRegistry } from '../../services/database/PluginRegistry';
import { DatabaseConfig, SupportedDatabaseType } from '../../services/database/types';
import { Controller, Get, Route } from 'tsoa';

@Route('database')
export class DatabaseController extends Controller {
  @Get('supported-databases')
  async getSupportedDatabaseTypes(): Promise<SupportedDatabaseType[]> {
    return Object.values(SupportedDatabaseType);
  }

  @Get('plugin/{dbType}/config')
  async getPluginConfig(dbType: SupportedDatabaseType): Promise<DatabaseConfig | undefined> {
    return PluginRegistry.getPluginConfig(dbType);
  }
}
