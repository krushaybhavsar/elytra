import React from 'react';
import PostgreSQLIcon from '@/assets/postgresql.png';
import MariaDBIcon from '@/assets/mariadb.png';
import MySQLIcon from '@/assets/mysql.png';
import OracleIcon from '@/assets/oracle.png';
import SQLServerIcon from '@/assets/sqlserver.png';
import PostgreSqlConnectionModal from '@/components/sidebar/workspace/DbConnectionModalContent/PostgreSqlConnectionModal';

export type DbConnectionModalContentProps = {
  dbProtocol: SupportedDbTypes;
};

export class DbType {
  displayName: string;
  icon: (
    props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
  ) => React.ReactNode;
  connectionModalContent: (props: DbConnectionModalContentProps) => React.JSX.Element;
  constructor({
    displayName,
    icon,
    connectionModalContent,
  }: {
    displayName: string;
    icon: (
      props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
    ) => React.ReactNode;
    connectionModalContent: (props: DbConnectionModalContentProps) => React.JSX.Element;
  }) {
    this.displayName = displayName;
    this.icon = icon;
    this.connectionModalContent = connectionModalContent;
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
    connectionModalContent: (props) => <PostgreSqlConnectionModal {...props} />,
  }),
  [SupportedDbTypes.MARIADB]: new DbType({
    displayName: 'MariaDB',
    icon: (props?) => <img src={MariaDBIcon} {...props} />,
    connectionModalContent: (props) => <PostgreSqlConnectionModal {...props} />,
  }),
  [SupportedDbTypes.MYSQL]: new DbType({
    displayName: 'MySQL',
    icon: (props?) => <img src={MySQLIcon} {...props} />,
    connectionModalContent: (props) => <PostgreSqlConnectionModal {...props} />,
  }),
  [SupportedDbTypes.ORACLE]: new DbType({
    displayName: 'Oracle',
    icon: (props?) => <img src={OracleIcon} {...props} />,
    connectionModalContent: (props) => <PostgreSqlConnectionModal {...props} />,
  }),
  [SupportedDbTypes.SQLSERVER]: new DbType({
    displayName: 'SQL Server',
    icon: (props?) => <img src={SQLServerIcon} {...props} />,
    connectionModalContent: (props) => <PostgreSqlConnectionModal {...props} />,
  }),
};
