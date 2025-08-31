import React, { ReactElement } from 'react';
import PostgreSQLIcon from '@/assets/postgresql.png';
import PostgreSQLConnectionModal from '@/components/sidebar/workspace/DbConnectionModalContent/PostgreSQLConnectionModal';

export const DatabaseIcons: {
  [key: string]: (props?: React.ImgHTMLAttributes<HTMLImageElement>) => ReactElement;
} = {
  postgresql: (props?) => <img src={PostgreSQLIcon} {...props} />,
};

export const DatabaseConnectionModals = {
  postgresql: <PostgreSQLConnectionModal />,
};
