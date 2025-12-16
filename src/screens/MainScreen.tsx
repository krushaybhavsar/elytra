import { useDialog } from '@/components/contexts/DialogContext';
import NavigationBar from '@/components/NavigationBar';
import Sidebar from '@/components/sidebar/Sidebar';
import { Dialog } from '@/components/ui/dialog';
import { AppScreens, NavigationBarTabs } from '@/types/navigation.types';
import { updateScreenTitleBar } from '@/utils/window-utils';
import React, { useEffect, useState, useRef } from 'react';
import WorkspaceScreen from './WorkspaceScreen';
import DashboardScreen from './DashboardScreen';
import ChatScreen from './ChatScreen';
import { TabProvider } from '@/components/contexts/TabContext';

const MainScreen = () => {
  const [activeTabScreen, setActiveTabScreen] = useState<NavigationBarTabs>(
    NavigationBarTabs.WORKSPACE,
  );
  const { isOpen, dialogContent, setDialogOpen } = useDialog();
  const tabViewContainerRef = useRef<{
    newTab: (connectionId?: string) => void;
  }>(null);

  const handleCreateNewTab = (connectionId: string) => {
    tabViewContainerRef.current?.newTab(connectionId);
  };

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
      <TabProvider value={{ createNewTab: handleCreateNewTab }}>
        <div className='w-full h-full flex bg-sidebar'>
          <NavigationBar
            activeTabScreen={activeTabScreen}
            setActiveTabScreen={setActiveTabScreen}
          />
          <div className='flex flex-row w-full h-full rounded-tl-xl border-border border-[1px] bg-background overflow-clip'>
            <Sidebar activeTabScreen={activeTabScreen} />
            {activeTabScreen === NavigationBarTabs.WORKSPACE ? (
              <WorkspaceScreen ref={tabViewContainerRef} />
            ) : (
              getActiveTabScreen()
            )}
          </div>
        </div>
      </TabProvider>
      {dialogContent}
    </Dialog>
  );
};

export default MainScreen;
