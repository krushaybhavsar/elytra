import { Connection } from './plugin.types';

// Common database metadata types
export interface Database {
  name: string;
  comment?: string;
}

export interface Schema {
  name: string;
  databaseName: string;
  comment?: string;
}

export interface Table {
  name: string;
  databaseName: string;
  schemaName: string;
  type: 'TABLE' | 'VIEW' | 'MATERIALIZED VIEW' | 'SYSTEM TABLE' | 'SYSTEM VIEW';
  comment?: string;
  ddl?: string;
  rowCount?: number;
  size?: number;
}

export interface TableColumn {
  name: string;
  dataType: string;
  isNullable: boolean;
  columnDefault?: string;
  comment?: string;
  ordinalPosition: number;
  characterMaximumLength?: number;
  numericPrecision?: number;
  numericScale?: number;
  isPrimaryKey?: boolean;
  isAutoIncrement?: boolean;
}

export interface TableIndex {
  name: string;
  databaseName: string;
  schemaName: string;
  tableName: string;
  type: 'PRIMARY KEY' | 'UNIQUE' | 'INDEX' | 'FOREIGN KEY' | 'CHECK';
  unique: boolean;
  method?: string;
  comment?: string;
  columnList?: TableIndexColumn[];
  // Foreign key specific properties
  foreignSchemaName?: string;
  foreignTableName?: string;
  foreignColumnNamelist?: string[];
}

export interface TableIndexColumn {
  columnName: string;
  ordinalPosition: number;
  collation?: string;
  ascOrDesc?: 'A' | 'D' | 'ASC' | 'DESC';
  length?: number;
}

export interface View {
  name: string;
  databaseName: string;
  schemaName: string;
  definition: string;
  comment?: string;
  isUpdatable?: boolean;
}

export interface DatabaseFunction {
  databaseName: string;
  schemaName: string;
  functionName: string;
  returnType?: string;
  language?: string;
  functionBody?: string;
  comment?: string;
  parameters?: FunctionParameter[];
}

export interface FunctionParameter {
  name: string;
  dataType: string;
  mode: 'IN' | 'OUT' | 'INOUT' | 'VARIADIC';
  defaultValue?: string;
}

export interface Procedure {
  databaseName: string;
  schemaName: string;
  procedureName: string;
  language?: string;
  procedureBody?: string;
  comment?: string;
  parameters?: ProcedureParameter[];
}

export interface ProcedureParameter {
  name: string;
  dataType: string;
  mode: 'IN' | 'OUT' | 'INOUT';
  defaultValue?: string;
}

export interface Trigger {
  databaseName: string;
  schemaName: string;
  triggerName: string;
  tableName?: string;
  event?: string[];
  timing?: 'BEFORE' | 'AFTER' | 'INSTEAD OF';
  triggerBody?: string;
  comment?: string;
  isEnabled?: boolean;
}

export interface Sequence {
  name: string;
  databaseName: string;
  schemaName: string;
  dataType?: string;
  startValue?: string | number;
  incrementBy?: string | number;
  minValue?: string | number;
  maxValue?: string | number;
  cache?: string | number;
  cycle?: boolean;
  owner?: string;
  comment?: string;
}

export interface SimpleSequence {
  name: string;
  comment?: string;
}

export interface DatabaseUser {
  name: string;
  canLogin?: boolean;
  isSuperuser?: boolean;
  canCreateDb?: boolean;
  canCreateRole?: boolean;
  comment?: string;
}

export interface Permission {
  objectName: string;
  objectType: 'TABLE' | 'VIEW' | 'FUNCTION' | 'PROCEDURE' | 'SEQUENCE' | 'SCHEMA' | 'DATABASE';
  grantee: string;
  grantor?: string;
  privilege: string;
  grantable?: boolean;
}

export interface MetadataProvider {
  // Basic database structure
  getDatabases(connection: Connection): Promise<Database[]>;
  getSchemas(connection: Connection, databaseName: string): Promise<Schema[]>;
  getTables(connection: Connection, databaseName: string, schemaName: string): Promise<Table[]>;
  getColumns(
    connection: Connection,
    databaseName: string,
    schemaName: string,
    tableName: string,
  ): Promise<TableColumn[]>;

  // Table-related metadata
  getIndexes(
    connection: Connection,
    databaseName: string,
    schemaName: string,
    tableName: string,
  ): Promise<TableIndex[]>;
  getTableDDL?(
    connection: Connection,
    databaseName: string,
    schemaName: string,
    tableName: string,
  ): Promise<string>;

  // Database objects
  getViews?(connection: Connection, databaseName: string, schemaName: string): Promise<View[]>;
  getView?(
    connection: Connection,
    databaseName: string,
    schemaName: string,
    viewName: string,
  ): Promise<View>;

  // Database routines
  getFunctions?(
    connection: Connection,
    databaseName: string,
    schemaName: string,
  ): Promise<DatabaseFunction[]>;
  getFunction?(
    connection: Connection,
    databaseName: string,
    schemaName: string,
    functionName: string,
  ): Promise<DatabaseFunction>;
  getProcedures?(
    connection: Connection,
    databaseName: string,
    schemaName: string,
  ): Promise<Procedure[]>;
  getProcedure?(
    connection: Connection,
    databaseName: string,
    schemaName: string,
    procedureName: string,
  ): Promise<Procedure>;

  // Triggers
  getTriggers?(
    connection: Connection,
    databaseName: string,
    schemaName: string,
  ): Promise<Trigger[]>;
  getTrigger?(
    connection: Connection,
    databaseName: string,
    schemaName: string,
    triggerName: string,
  ): Promise<Trigger>;

  // Other database objects (optional based on DB support)
  getSequences?(
    connection: Connection,
    databaseName: string,
    schemaName: string,
  ): Promise<Sequence[]>;
  getSequence?(
    connection: Connection,
    databaseName: string,
    schemaName: string,
    sequenceName: string,
  ): Promise<Sequence>;

  // Security-related metadata
  getUsers?(connection: Connection): Promise<DatabaseUser[]>;
  getPermissions?(
    connection: Connection,
    databaseName: string,
    schemaName: string,
    objectName: string,
    objectType: string,
  ): Promise<Permission[]>;
}
