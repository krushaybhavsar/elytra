import WinstonLogger from '@/utils/log-utils';
import { PluginRegistry } from './PluginRegistry';
import { PostgreSQLPlugin } from './plugins/postgresql/PostgreSQLPlugin';

export default class DatabaseService {
  private readonly _logger = WinstonLogger.getInstance().getLogger('DatabaseService');
  private readonly _pluginRegistry = PluginRegistry.getInstance();

  initialize() {
    this._logger.info('Initializing DatabaseService');
    this.registerPlugins();
  }

  registerPlugins() {
    this._pluginRegistry.register(new PostgreSQLPlugin());
  }
}
