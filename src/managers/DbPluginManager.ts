import { dataSource } from '@/services/service.config';
import { SupportedDbIdentifier } from '@/types/database.types';
import { useQuery } from '@tanstack/react-query';

export const useDbPluginManager = () => {
  const keys = {
    supportedDbIds: ['supported-db-ids'],
    supportedDbConfigs: ['supported-db-configs'],
    supportedDbConfig: (id: SupportedDbIdentifier) => ['supported-db-config', id],
  };

  const getSupportedDbIds = () => {
    return useQuery({
      queryKey: keys.supportedDbIds,
      queryFn: async () => dataSource.getSupportedDbIds(),
    });
  };

  const getSupportedDbConfigs = () => {
    return useQuery({
      queryKey: keys.supportedDbConfigs,
      queryFn: async () => dataSource.getSupportedDbConfigs(),
    });
  };

  const getSupportedDbConfig = (id: SupportedDbIdentifier) => {
    return useQuery({
      queryKey: keys.supportedDbConfig(id),
      queryFn: async () => dataSource.getSupportedDbConfig(id),
      enabled: !!id,
    });
  };

  return {
    getSupportedDbIds,
    getSupportedDbConfigs,
    getSupportedDbConfig,
  };
};
