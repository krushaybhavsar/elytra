import React from 'react';
import PostgreSQLIcon from '@/assets/postgresql.png';
import MariaDBIcon from '@/assets/mariadb.png';
import MySQLIcon from '@/assets/mysql.png';
import OracleIcon from '@/assets/oracle.png';
import SQLServerIcon from '@/assets/sqlserver.png';

export class DbType {
  displayName: string;
  icon: (
    props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
  ) => React.ReactNode;
  constructor({
    displayName,
    icon,
  }: {
    displayName: string;
    icon: (
      props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
    ) => React.ReactNode;
  }) {
    this.displayName = displayName;
    this.icon = icon;
  }
}

export enum SupportedDbTypes {
  POSTGRESQL = 'postgres',
  MYSQL = 'mysql',
  MARIADB = 'mariadb',
  ORACLE = 'oracle',
  SQLSERVER = 'sqlserver',
}

export const SupportedDbTypeMap: Record<SupportedDbTypes, DbType> = {
  [SupportedDbTypes.POSTGRESQL]: new DbType({
    displayName: 'PostgreSQL',
    icon: (props?) => <img src={PostgreSQLIcon} {...props} />,
  }),
  [SupportedDbTypes.MARIADB]: new DbType({
    displayName: 'MariaDB',
    icon: (props?) => <img src={MariaDBIcon} {...props} />,
  }),
  [SupportedDbTypes.MYSQL]: new DbType({
    displayName: 'MySQL',
    icon: (props?) => <img src={MySQLIcon} {...props} />,
  }),
  [SupportedDbTypes.ORACLE]: new DbType({
    displayName: 'Oracle',
    icon: (props?) => <img src={OracleIcon} {...props} />,
  }),
  [SupportedDbTypes.SQLSERVER]: new DbType({
    displayName: 'SQL Server',
    icon: (props?) => <img src={SQLServerIcon} {...props} />,
  }),
};
