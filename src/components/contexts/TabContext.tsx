import React, { createContext, useContext } from 'react';

interface TabContextType {
  createNewTab: (connectionId: string) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export const TabProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: TabContextType;
}) => {
  return <TabContext.Provider value={value}>{children}</TabContext.Provider>;
};

export const useTabContext = () => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('useTabContext must be used within a TabProvider');
  }
  return context;
};
