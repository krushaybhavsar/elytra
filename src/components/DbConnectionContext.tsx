import React, { createContext, JSX, ReactNode, useContext, useEffect, useState } from 'react';

export type DbConnection = {
  connectionUrl: string;
};

export type DbConnectionContextProps = {
  dbConnection: DbConnection | undefined;
  setDbConnection: (connection: DbConnection) => void;
};

const Context = createContext<DbConnectionContextProps>({
  dbConnection: undefined,
  setDbConnection: () => {},
});

export const DbConnectionContextProvider = ({
  children,
  initialDbConnectionInfo,
}: {
  children: ReactNode;
  initialDbConnectionInfo?: DbConnection;
}): JSX.Element => {
  const [dbConnection, setDbConnection] = useState<DbConnection | undefined>(
    initialDbConnectionInfo,
  );

  const handleSetDbConnection = (newConnection: DbConnection) => {
    setDbConnection(newConnection);
    window.dispatchEvent(new CustomEvent('dbConnectionChanged'));
  };

  useEffect(() => {
    if (initialDbConnectionInfo !== dbConnection) {
      setDbConnection(initialDbConnectionInfo);
    }
  }, [initialDbConnectionInfo]);

  return (
    <Context.Provider value={{ dbConnection, setDbConnection: handleSetDbConnection }}>
      {children}
    </Context.Provider>
  );
};

export const useDbConnectionContext = (): DbConnectionContextProps => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useDbConnectionContext must be used within a DbConnectionContextProvider');
  }
  return context;
};
