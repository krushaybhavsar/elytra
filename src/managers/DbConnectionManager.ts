import { Connection, ConnectionConfig } from '@/model/DatabaseModel';
import { dataSource } from '@/services/service.config';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useDbConnectionManager = () => {
  const keys = {
    recentConnection: ['recent-connection'],
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
          queryClient.invalidateQueries({ queryKey: keys.connections });
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
      onSuccess: (_, connectionId) => {
        queryClient.removeQueries({ queryKey: keys.connection(connectionId) });
        queryClient.setQueryData(keys.connections, (previous?: Connection[]) =>
          previous?.filter((connection) => connection.connectionId !== connectionId),
        );
        queryClient.invalidateQueries({ queryKey: keys.connections });
      },
    });
  };

  const updateConnection = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (connection: Connection) => dataSource.updateConnection(connection),
      onSuccess: (_, variables) => {
        queryClient.setQueryData(keys.connection(variables.connectionId), variables);
        queryClient.invalidateQueries({ queryKey: keys.connections });
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
    updateConnection,
    getAllConnections,
  };
};
