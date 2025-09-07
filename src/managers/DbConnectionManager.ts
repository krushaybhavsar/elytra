import { ConnectionConfig } from '@/model/DatabaseModel';
import { dataSource } from '@/services/service.config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useDbConnectionManager = () => {
  const keys = {
    connection: (connectionId: string) => ['connection', connectionId],
    connections: ['connections'],
  };

  const createConnection = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (config: ConnectionConfig) => dataSource.createConnection(config),
      onSuccess: (data) => {
        if (data.result.success && data.connection) {
          queryClient.setQueryData(keys.connection(data.connection.connectionId), data.connection);
        }
      },
    });
  };

  const testConnection = () => {
    return useMutation({
      mutationFn: async (config: ConnectionConfig) => dataSource.testConnection(config),
    });
  };

  const closeConnection = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (connectionId: string) => dataSource.closeConnection(connectionId),
      onSuccess: (_, variables) => {
        queryClient.removeQueries({ queryKey: keys.connection(variables) });
      },
    });
  };

  const getAllConnections = () => {
    return useQuery({
      queryKey: keys.connections,
      queryFn: async () => dataSource.getAllConnections(),
    });
  };

  return {
    createConnection,
    testConnection,
    closeConnection,
    getAllConnections,
  };
};
