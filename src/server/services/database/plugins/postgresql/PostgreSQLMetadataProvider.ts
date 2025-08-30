import { Connection, MetadataProvider } from '../../types';

export class PostgreSQLMetadataProvider implements MetadataProvider {
  async getSchemas(connection: Connection): Promise<string[]> {
    return [];
  }

  async getTables(connection: Connection, schema: string): Promise<string[]> {
    return [];
  }

  async getColumns(connection: Connection, schema: string, table: string): Promise<string[]> {
    return [];
  }
}
