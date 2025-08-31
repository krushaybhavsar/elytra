import {
  DatabasePluginConfig,
  DatabasePlugin,
  MetadataProvider,
  DatabasePluginConnectionManager,
} from '../../types';
import { PostgreSQLConnectionManager } from './PostgreSQLConnectionManager';
import { PostgreSQLMetadataProvider } from './PostgreSQLMetadataProvider';
import { PostgresSQLConfig } from './PostgresSQLConfig';

export class PostgreSQLPlugin implements DatabasePlugin {
  getConfig(): DatabasePluginConfig {
    return PostgresSQLConfig;
  }

  getMetadata(): MetadataProvider {
    return new PostgreSQLMetadataProvider();
  }

  getConnectionManager(): DatabasePluginConnectionManager {
    return new PostgreSQLConnectionManager();
  }
}
