import { ConnectionManager, DatabaseConfig, DatabasePlugin, MetadataProvider } from '../../types';
import { PostgreSQLConnectionManager } from './PostgreSQLConnectionManager';
import { PostgreSQLMetadataProvider } from './PostgreSQLMetadataProvider';
import { PostgresSQLConfig } from './PostgresSQLConfig';

export class PostgreSQLPlugin implements DatabasePlugin {
  getConfig(): DatabaseConfig {
    return PostgresSQLConfig;
  }

  getMetadata(): MetadataProvider {
    return new PostgreSQLMetadataProvider();
  }

  getConnectionManager(): ConnectionManager {
    return new PostgreSQLConnectionManager();
  }
}
