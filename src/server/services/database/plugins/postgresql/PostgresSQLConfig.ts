import { DatabasePluginConfig, SupportedDbIdentifier } from '../../types/plugin.types';

export const PostgresSQLConfig: DatabasePluginConfig = {
  id: SupportedDbIdentifier.POSTGRESQL,
  name: 'PostgreSQL',
};
