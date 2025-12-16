import React, { ReactElement } from 'react';
import PostgreSQLIcon from '@/assets/postgresql.png';
import PostgreSQLConnectionModal from '@/components/sidebar/workspace/DbConnectionModalContent/PostgreSqlConnectionModal';
import { Connection } from '@/model/DatabaseModel';

export enum SupportedDbIdentifier {
  POSTGRESQL = 'postgresql',
}

export type DatabaseConnectionModalProps = {
  mode: 'create' | 'edit';
  connection?: Connection;
};

export const DatabaseIcons: Record<
  SupportedDbIdentifier,
  (props?: React.ImgHTMLAttributes<HTMLImageElement>) => ReactElement
> = {
  [SupportedDbIdentifier.POSTGRESQL]: (props?) => <img src={PostgreSQLIcon} {...props} />,
};

export const DatabaseConnectionModals: Record<
  SupportedDbIdentifier,
  React.ComponentType<DatabaseConnectionModalProps>
> = {
  [SupportedDbIdentifier.POSTGRESQL]: PostgreSQLConnectionModal,
};
