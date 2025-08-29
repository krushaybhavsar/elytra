import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DialogContextType {
  isOpen: boolean;
  setDialogOpen: (isOpen: boolean) => void;
  dialogContent: ReactNode;
  setDialogContent: (content: ReactNode) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};

interface DialogProviderProps {
  children: ReactNode;
}

export const DialogProvider: React.FC<DialogProviderProps> = ({ children }) => {
  const [dialogContent, setDialogContent] = useState<ReactNode>();
  const [isOpen, setIsOpen] = useState(false);

  const setDialogOpen = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setDialogContent(undefined);
    }
  };

  return (
    <DialogContext.Provider value={{ isOpen, setDialogOpen, dialogContent, setDialogContent }}>
      {children}
    </DialogContext.Provider>
  );
};
