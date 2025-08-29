export const DATABASE_CHANNELS = {
  CONNECT: 'database:connect',
  DISCONNECT: 'database:disconnect',
  EXECUTE_QUERY: 'database:execute-query',
  GET_SCHEMA: 'database:get-schema',
  GET_TABLES: 'database:get-tables',
  GET_COLUMNS: 'database:get-columns',
  GET_INDEXES: 'database:get-indexes',
  GET_FOREIGN_KEYS: 'database:get-foreign-keys',
} as const;
