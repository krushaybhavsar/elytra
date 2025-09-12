import { Connection } from '../database/types';

export const schemaDefaults = {
  connections: [] as Connection[],
};

export type StorageSchema = {
  connections: Connection[];
};

export const STORE_KEYS: { [key: string]: keyof StorageSchema } = {
  CONNECTIONS: 'connections',
};
