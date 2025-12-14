import WinstonLogger from '@/utils/log-utils';
import {
  Database,
  DatabaseFunction,
  DatabaseUser,
  MetadataProvider,
  Procedure,
  Schema,
  Sequence,
  Table,
  TableColumn,
  TableIndex,
  TableIndexColumn,
  Trigger,
  View,
} from '../../types/metadata.types';
import { Pool } from 'pg';

export class PostgreSQLMetadataProvider implements MetadataProvider {
  private readonly _logger = WinstonLogger.getInstance().getLogger('PostgreSQLMetadataProvider');
  private readonly systemDatabases = ['postgres'];
  private readonly systemSchemas = [
    'pg_toast',
    'pg_temp_1',
    'pg_toast_temp_1',
    'pg_catalog',
    'information_schema',
  ];

  // SQL constants
  private readonly SELECT_KEY_INDEX =
    "SELECT ccu.table_schema AS Foreign_schema_name, ccu.table_name AS Foreign_table_name, ccu.column_name AS Foreign_column_name, constraint_type AS Constraint_type, tc.CONSTRAINT_NAME AS Key_name, tc.TABLE_NAME, kcu.Column_name, tc.is_deferrable, tc.initially_deferred FROM information_schema.table_constraints AS tc JOIN information_schema.key_column_usage AS kcu ON tc.CONSTRAINT_NAME = kcu.CONSTRAINT_NAME JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name WHERE tc.TABLE_SCHEMA = '%s'  AND tc.TABLE_NAME = '%s';";
  private readonly SELECT_TABLE_INDEX =
    "SELECT tmp.INDISPRIMARY AS Index_primary, tmp.TABLE_SCHEM, tmp.TABLE_NAME, tmp.NON_UNIQUE, tmp.INDEX_QUALIFIER, tmp.INDEX_NAME AS Key_name, tmp.indisclustered, tmp.ORDINAL_POSITION AS Seq_in_index, TRIM ( BOTH '\"' FROM pg_get_indexdef ( tmp.CI_OID, tmp.ORDINAL_POSITION, FALSE ) ) AS Column_name,CASE  tmp.AM_NAME   WHEN 'btree' THEN CASE   tmp.I_INDOPTION [ tmp.ORDINAL_POSITION - 1 ] & 1 :: SMALLINT   WHEN 1 THEN  'D' ELSE'A'  END ELSE NULL  END AS Collation, tmp.CARDINALITY, tmp.PAGES, tmp.FILTER_CONDITION , tmp.AM_NAME AS Index_method, tmp.DESCRIPTION AS Index_comment FROM ( SELECT  n.nspname AS TABLE_SCHEM,  ct.relname AS TABLE_NAME,  NOT i.indisunique AS NON_UNIQUE, NULL AS INDEX_QUALIFIER,  ci.relname AS INDEX_NAME,i.INDISPRIMARY , i.indisclustered ,  ( information_schema._pg_expandarray ( i.indkey ) ).n AS ORDINAL_POSITION,  ci.reltuples AS CARDINALITY,   ci.relpages AS PAGES,  pg_get_expr ( i.indpred, i.indrelid ) AS FILTER_CONDITION,  ci.OID AS CI_OID, i.indoption AS I_INDOPTION,  am.amname AS AM_NAME , d.description  FROM   pg_class ct   JOIN pg_namespace n ON ( ct.relnamespace = n.OID )   JOIN pg_index i ON ( ct.OID = i.indrelid )   JOIN pg_class ci ON ( ci.OID = i.indexrelid )  JOIN pg_am am ON ( ci.relam = am.OID )      left outer join pg_description d on i.indexrelid = d.objoid  WHERE  n.nspname = '%s'   AND ct.relname = '%s'   ) AS tmp ;";
  private readonly ROUTINES_SQL =
    "SELECT p.proname, p.prokind, pg_catalog.pg_get_functiondef(p.oid) as \"code\" FROM pg_catalog.pg_proc p where p.prokind = '%s' and p.proname='%s'";
  private readonly TRIGGER_SQL =
    'SELECT n.nspname AS "schema", c.relname AS "table_name", t.tgname AS "trigger_name", t.tgenabled AS "enabled", pg_get_triggerdef(t.oid) AS "trigger_body" FROM pg_trigger t JOIN pg_class c ON c.oid = t.tgrelid JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = \'%s\' AND t.tgname =\'%s\';';
  private readonly TRIGGER_SQL_LIST =
    'SELECT n.nspname AS "schema", c.relname AS "table_name", t.tgname AS "trigger_name", t.tgenabled AS "enabled", pg_get_triggerdef(t.oid) AS "trigger_body" FROM pg_trigger t JOIN pg_class c ON c.oid = t.tgrelid JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = \'%s\';';
  private readonly VIEW_SQL =
    "SELECT schemaname, viewname, definition FROM pg_views WHERE schemaname = '%s' AND viewname = '%s';";
  private readonly EXPORT_SEQUENCES_SQL =
    "SELECT c.relname, obj_description(c.oid) as comment FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE c.relkind = 'S' AND n.nspname = $1;";
  private readonly EXPORT_USERS_SQL = 'SELECT usename as username FROM pg_catalog.pg_user;';

  /**
   * Get list of databases
   */
  async getDatabases(pool: Pool): Promise<Database[]> {
    try {
      const client = await pool.connect();
      const res = await client.query('SELECT datname FROM pg_database;');

      const databases: Database[] = [];
      for (const row of res.rows) {
        const dbName = row.datname;
        if (dbName === 'template0' || dbName === 'template1') {
          continue;
        }
        databases.push({ name: dbName });
      }

      // Sort databases (system databases at the end)
      return this.sortDatabase(databases);
    } catch (error) {
      this._logger.error(`Failed to get databases: ${error}`);
      throw new Error(`Failed to get databases: ${error}`);
    }
  }

  /**
   * Get list of schemas
   */
  async getSchemas(pool: Pool, databaseName: string): Promise<Schema[]> {
    try {
      const client = await pool.connect();
      const res = await client.query(
        'SELECT catalog_name, schema_name FROM information_schema.schemata;',
      );

      const schemas: Schema[] = [];
      for (const row of res.rows) {
        const name = row.schema_name;
        const catalogName = row.catalog_name;
        schemas.push({
          name,
          databaseName: catalogName,
        });
      }

      // Sort schemas (system schemas at the end)
      return this.sortSchemas(schemas);
    } catch (error) {
      this._logger.error(`Failed to get schemas: ${error}`);
      throw new Error(`Failed to get schemas: ${error}`);
    }
  }

  /**
   * Get list of tables
   */
  async getTables(
    pool: Pool,
    databaseName: string,
    schemaName: string,
  ): Promise<Table[]> {
    try {
      const client = await pool.connect();
      const res = await client.query(
        'SELECT table_name, table_type FROM information_schema.tables WHERE table_schema = $1 ORDER BY table_name',
        [schemaName],
      );

      const tables: Table[] = [];
      for (const row of res.rows) {
        tables.push({
          name: row.table_name,
          databaseName,
          schemaName,
          type: row.table_type === 'VIEW' ? 'VIEW' : 'TABLE',
        });
      }

      return tables;
    } catch (error) {
      this._logger.error(`Failed to get tables: ${error}`);
      throw new Error(`Failed to get tables: ${error}`);
    }
  }

  /**
   * Get table columns
   */
  async getColumns(
    pool: Pool,
    databaseName: string,
    schemaName: string,
    tableName: string,
  ): Promise<TableColumn[]> {
    try {
      const client = await pool.connect();
      const res = await client.query(
        `
        SELECT 
          column_name, 
          data_type, 
          is_nullable = 'YES' as is_nullable, 
          column_default,
          ordinal_position,
          character_maximum_length,
          numeric_precision,
          numeric_scale,
          pg_catalog.col_description(
            (SELECT oid FROM pg_catalog.pg_class WHERE relname = $1 AND relnamespace = (
              SELECT oid FROM pg_catalog.pg_namespace WHERE nspname = $2
            )), 
            ordinal_position
          ) as comment
        FROM 
          information_schema.columns
        WHERE 
          table_schema = $2 AND table_name = $1
        ORDER BY 
          ordinal_position
      `,
        [tableName, schemaName],
      );

      const columns: TableColumn[] = [];
      for (const row of res.rows) {
        let columnType = row.data_type.toUpperCase();
        if (columnType === 'BPCHAR') {
          columnType = 'CHAR';
        }

        columns.push({
          name: row.column_name,
          dataType: columnType,
          isNullable: row.is_nullable,
          columnDefault: row.column_default,
          comment: row.comment,
          ordinalPosition: row.ordinal_position,
          characterMaximumLength: row.character_maximum_length,
          numericPrecision: row.numeric_precision,
          numericScale: row.numeric_scale,
        });
      }

      return columns;
    } catch (error) {
      this._logger.error(`Failed to get columns: ${error}`);
      throw new Error(`Failed to get columns: ${error}`);
    }
  }

  /**
   * Get table indexes
   */
  async getIndexes(
    pool: Pool,
    databaseName: string,
    schemaName: string,
    tableName: string,
  ): Promise<TableIndex[]> {
    try {
      const client = await pool.connect();
      // First query for constraints (keys)
      const constraintSql = this.format(this.SELECT_KEY_INDEX, schemaName, tableName);
      const constraintRes = await client.query(constraintSql);

      const constraintMap: Record<string, string> = {};
      const foreignMap: Record<string, TableIndex> = {};

      for (const row of constraintRes.rows) {
        const keyName = row.key_name;
        const constraintType = row.constraint_type;
        constraintMap[keyName] = constraintType;

        if (constraintType?.toLowerCase() === 'foreign key') {
          let tableIndex = foreignMap[keyName];
          const columnName = row.column_name;

          if (!tableIndex) {
            tableIndex = {
              databaseName,
              schemaName,
              tableName,
              name: keyName,
              foreignSchemaName: row.foreign_schema_name,
              foreignTableName: row.foreign_table_name,
              foreignColumnNamelist: [row.column_name],
              type: 'FOREIGN KEY',
              unique: false,
            };
            foreignMap[keyName] = tableIndex;
          } else {
            tableIndex.foreignColumnNamelist!.push(columnName);
          }
        }
      }

      // Second query for indexes
      const indexSql = this.format(this.SELECT_TABLE_INDEX, schemaName, tableName);
      const indexRes = await client.query(indexSql);

      const map: Record<string, TableIndex> = { ...foreignMap };

      for (const row of indexRes.rows) {
        const keyName = row.key_name;
        let tableIndex = map[keyName];

        if (tableIndex) {
          // Add column to existing index
          if (!tableIndex.columnList) {
            tableIndex.columnList = [];
          }

          tableIndex.columnList.push(this.getTableIndexColumn(row));
          // Sort columns by ordinal position
          tableIndex.columnList.sort((a, b) => a.ordinalPosition - b.ordinalPosition);
        } else {
          // Create new index
          tableIndex = {
            databaseName,
            schemaName,
            tableName,
            name: keyName,
            unique: row.non_unique !== 't',
            method: row.index_method,
            comment: row.index_comment,
            type: 'INDEX',
            columnList: [this.getTableIndexColumn(row)],
          };

          // Determine index type
          const constraintType = constraintMap[keyName];
          if (row.index_primary === 't') {
            tableIndex.type = 'PRIMARY KEY';
          } else if (constraintType?.toLowerCase() === 'unique') {
            tableIndex.type = 'UNIQUE';
          }

          map[keyName] = tableIndex;
        }
      }

      return Object.values(map);
    } catch (error) {
      this._logger.error(`Failed to get indexes: ${error}`);
      throw new Error(`Failed to get indexes: ${error}`);
    }
  }

  /**
   * Get table view definition
   */
  async getView(
    pool: Pool,
    databaseName: string,
    schemaName: string,
    viewName: string,
  ): Promise<View> {
    try {
      const client = await pool.connect();
      const sql = this.format(this.VIEW_SQL, schemaName, viewName);
      const res = await client.query(sql);

      const view: View = {
        name: viewName,
        databaseName,
        schemaName,
        definition: '',
      };

      if (res.rows.length > 0) {
        view.definition = res.rows[0].definition;
      }

      return view;
    } catch (error) {
      this._logger.error(`Failed to get view: ${error}`);
      throw new Error(`Failed to get view: ${error}`);
    }
  }

  /**
   * Get function definition
   */
  async getFunction(
    pool: Pool,
    databaseName: string,
    schemaName: string,
    functionName: string,
  ): Promise<DatabaseFunction> {
    try {
      const client = await pool.connect();
      const sql = this.format(this.ROUTINES_SQL, 'f', functionName);
      const res = await client.query(sql);

      const func: DatabaseFunction = {
        databaseName,
        schemaName,
        functionName,
      };

      if (res.rows.length > 0) {
        func.functionBody = res.rows[0].code;
      }

      return func;
    } catch (error) {
      this._logger.error(`Failed to get function: ${error}`);
      throw new Error(`Failed to get function: ${error}`);
    }
  }

  /**
   * Get procedure definition
   */
  async getProcedure(
    pool: Pool,
    databaseName: string,
    schemaName: string,
    procedureName: string,
  ): Promise<Procedure> {
    try {
      const client = await pool.connect();
      const sql = this.format(this.ROUTINES_SQL, 'p', procedureName);
      const res = await client.query(sql);

      const procedure: Procedure = {
        databaseName,
        schemaName,
        procedureName,
      };

      if (res.rows.length > 0) {
        procedure.procedureBody = res.rows[0].code;
      }

      return procedure;
    } catch (error) {
      this._logger.error(`Failed to get procedure: ${error}`);
      throw new Error(`Failed to get procedure: ${error}`);
    }
  }

  /**
   * Get triggers
   */
  async getTriggers(
    pool: Pool,
    databaseName: string,
    schemaName: string,
  ): Promise<Trigger[]> {
    try {
      const client = await pool.connect();
      const sql = this.format(this.TRIGGER_SQL_LIST, schemaName);
      const res = await client.query(sql);

      const triggers: Trigger[] = [];
      for (const row of res.rows) {
        triggers.push({
          triggerName: row.trigger_name,
          schemaName,
          databaseName,
        });
      }

      return triggers;
    } catch (error) {
      this._logger.error(`Failed to get triggers: ${error}`);
      throw new Error(`Failed to get triggers: ${error}`);
    }
  }

  /**
   * Get trigger definition
   */
  async getTrigger(
    pool: Pool,
    databaseName: string,
    schemaName: string,
    triggerName: string,
  ): Promise<Trigger> {
    try {
      const client = await pool.connect();
      const sql = this.format(this.TRIGGER_SQL, schemaName, triggerName);
      const res = await client.query(sql);

      const trigger: Trigger = {
        databaseName,
        schemaName,
        triggerName,
      };

      if (res.rows.length > 0) {
        trigger.triggerBody = res.rows[0].trigger_body;
      }

      return trigger;
    } catch (error) {
      this._logger.error(`Failed to get trigger: ${error}`);
      throw new Error(`Failed to get trigger: ${error}`);
    }
  }

  /**
   * Get sequences
   */
  async getSequences(
    pool: Pool,
    databaseName: string,
    schemaName: string,
  ): Promise<Sequence[]> {
    try {
      const client = await pool.connect();
      const res = await client.query(this.EXPORT_SEQUENCES_SQL, [schemaName]);

      const sequences: Sequence[] = [];
      for (const row of res.rows) {
        sequences.push({
          name: row.relname,
          databaseName,
          schemaName,
          comment: row.comment,
        });
      }

      return sequences;
    } catch (error) {
      this._logger.error(`Failed to get sequences: ${error}`);
      throw new Error(`Failed to get sequences: ${error}`);
    }
  }

  /**
   * Get database users
   */
  async getUsers(pool: Pool): Promise<DatabaseUser[]> {
    try {
      const client = await pool.connect();
      const res = await client.query(this.EXPORT_USERS_SQL);

      const users: DatabaseUser[] = [];
      for (const row of res.rows) {
        users.push({
          name: row.username,
        });
      }

      return users;
    } catch (error) {
      this._logger.error(`Failed to get users: ${error}`);
      throw new Error(`Failed to get users: ${error}`);
    }
  }

  // Helper methods
  private format(sql: string, ...args: any[]): string {
    return sql.replace(/%s/g, (match) => {
      return args.shift();
    });
  }

  private getTableIndexColumn(row: any): TableIndexColumn {
    return {
      columnName: row.column_name,
      ordinalPosition: row.seq_in_index,
      collation: row.collation,
      ascOrDesc: row.collation,
    };
  }

  private sortDatabase(databases: Database[]): Database[] {
    // Sort databases with system databases at the end
    return databases.sort((a, b) => {
      const aIsSystem = this.systemDatabases.includes(a.name);
      const bIsSystem = this.systemDatabases.includes(b.name);

      if (aIsSystem && !bIsSystem) return 1;
      if (!aIsSystem && bIsSystem) return -1;
      return a.name.localeCompare(b.name);
    });
  }

  private sortSchemas(schemas: Schema[]): Schema[] {
    // Sort schemas with system schemas at the end
    return schemas.sort((a, b) => {
      const aIsSystem = this.systemSchemas.includes(a.name);
      const bIsSystem = this.systemSchemas.includes(b.name);

      if (aIsSystem && !bIsSystem) return 1;
      if (!aIsSystem && bIsSystem) return -1;
      return a.name.localeCompare(b.name);
    });
  }
}
