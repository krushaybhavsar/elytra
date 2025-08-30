import WinstonLogger from '@/utils/log-utils';
import { PluginRegistry } from './PluginRegistry';
import { PostgreSQLPlugin } from './plugins/postgresql/PostgreSQLPlugin';

export default class DatabaseService {
  private readonly _logger = WinstonLogger.getInstance().getLogger('DatabaseService');

  initialize() {
    this._logger.info('Initializing DatabaseService');
    this.registerPlugins();
  }

  registerPlugins() {
    PluginRegistry.register(new PostgreSQLPlugin());
  }
}
