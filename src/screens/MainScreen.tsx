import { useDialog } from '@/components/contexts/DialogContext';
import NavigationBar from '@/components/NavigationBar';
import Sidebar from '@/components/sidebar/Sidebar';
import { Dialog } from '@/components/ui/dialog';
import { AppScreens, NavigationBarTabs } from '@/types/navigation.types';
import { updateScreenTitleBar } from '@/utils/window-utils';
import React, { useEffect, useState } from 'react';
import WorkspaceScreen from './WorkspaceScreen';
import DashboardScreen from './DashboardScreen';
import ChatScreen from './ChatScreen';

const MainScreen = () => {
  const [activeTabScreen, setActiveTabScreen] = useState<NavigationBarTabs>(
    NavigationBarTabs.WORKSPACE,
  );
  const { isOpen, dialogContent, setDialogOpen } = useDialog();

  useEffect(() => {
    updateScreenTitleBar(AppScreens.MAIN);
  }, []);

  const getActiveTabScreen = () => {
    switch (activeTabScreen) {
      case NavigationBarTabs.WORKSPACE:
        return <WorkspaceScreen />;
      case NavigationBarTabs.DASHBOARD:
        return <DashboardScreen />;
      case NavigationBarTabs.CHAT:
        return <ChatScreen />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setDialogOpen}>
      <div className='w-full h-full flex bg-sidebar'>
        <NavigationBar activeTabScreen={activeTabScreen} setActiveTabScreen={setActiveTabScreen} />
        <div className='flex flex-row w-full h-full rounded-tl-xl border-border border-[1px] bg-background overflow-clip'>
          <Sidebar activeTabScreen={activeTabScreen} />
          {getActiveTabScreen()}
        </div>
      </div>
      {dialogContent}
    </Dialog>
  );
};

export default MainScreen;
