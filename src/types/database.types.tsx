import React, { ReactElement } from 'react';
import PostgreSQLIcon from '@/assets/postgresql.png';
import PostgreSQLConnectionModal from '@/components/sidebar/workspace/DbConnectionModalContent/PostgreSqlConnectionModal';

export enum SupportedDbIdentifier {
  POSTGRESQL = 'postgresql',
}

export const DatabaseIcons: Record<
  SupportedDbIdentifier,
  (props?: React.ImgHTMLAttributes<HTMLImageElement>) => ReactElement
> = {
  [SupportedDbIdentifier.POSTGRESQL]: (props?) => <img src={PostgreSQLIcon} {...props} />,
};

export const DatabaseConnectionModals = {
  [SupportedDbIdentifier.POSTGRESQL]: <PostgreSQLConnectionModal />,
};
