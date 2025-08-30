import { DatabaseConfig, SupportedDatabaseType } from '../../types';

export const PostgresSQLConfig: DatabaseConfig = {
  dbType: SupportedDatabaseType.POSTGRESQL,
  name: 'PostgreSQL',
  icon: 'postgresql.png',
};
