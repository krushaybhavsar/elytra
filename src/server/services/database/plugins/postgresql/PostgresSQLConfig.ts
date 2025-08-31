import { DatabasePluginConfig, SupportedDbIdentifier } from '../../types';

export const PostgresSQLConfig: DatabasePluginConfig = {
  id: SupportedDbIdentifier.POSTGRESQL,
  name: 'PostgreSQL',
};
