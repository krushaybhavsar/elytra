import React from 'react';
import PostgreSQLIcon from '@/assets/postgresql.png';
import MariaDBIcon from '@/assets/mariadb.png';
import MySQLIcon from '@/assets/mysql.png';
import OracleIcon from '@/assets/oracle.png';
import SQLServerIcon from '@/assets/sqlserver.png';

export class DbType {
  id: string;
  displayName: string;
  icon: React.ReactNode;
  constructor({
    id,
    displayName,
    icon,
  }: {
    id: string;
    displayName: string;
    icon: React.ReactNode;
  }) {
    this.id = id;
    this.displayName = displayName;
    this.icon = icon;
  }
}

export const SUPPORTED_DB_TYPES: DbType[] = [
  new DbType({
    id: 'postgres',
    displayName: 'PostgreSQL',
    icon: <img className='!size-4' src={PostgreSQLIcon} />,
  }),
  new DbType({
    id: 'mariadb',
    displayName: 'MariaDB',
    icon: <img className='!size-4' src={MariaDBIcon} />,
  }),
  new DbType({
    id: 'mysql',
    displayName: 'MySQL',
    icon: <img className='!size-4' src={MySQLIcon} />,
  }),
  new DbType({
    id: 'oracle',
    displayName: 'Oracle',
    icon: <img className='!size-4' src={OracleIcon} />,
  }),
  new DbType({
    id: 'sqlserver',
    displayName: 'SQL Server',
    icon: <img className='!size-4' src={SQLServerIcon} />,
  }),
];
