import { MetadataProvider } from '../../types/metadata.types';
import {
  DatabasePlugin,
  DatabasePluginConfig,
  DatabasePluginConnectionManager,
} from '../../types/plugin.types';
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
