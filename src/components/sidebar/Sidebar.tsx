import { NavigationBarTabs } from '@/types/navigation.types';
import React from 'react';
import WorkspaceSidebar from './workspace/WorkspaceSidebar';
import DashboardSidebar from './DashboardSidebar';
import ChatSidebar from './ChatSidebar';
import ResizablePanel from '../ui/resizable-panel';

type SidebarProps = {
  activeTabScreen: NavigationBarTabs;
};

const Sidebar = (props: SidebarProps) => {
  const getActiveSidebar = () => {
    switch (props.activeTabScreen) {
      case NavigationBarTabs.WORKSPACE:
        return <WorkspaceSidebar />;
      case NavigationBarTabs.DASHBOARD:
        return <DashboardSidebar />;
      case NavigationBarTabs.CHAT:
        return <ChatSidebar />;
      default:
        return <WorkspaceSidebar />;
    }
  };

  return (
    <ResizablePanel
      initialWidth={250}
      minWidth={200}
      maxWidth={400}
      className='h-full border-r-[1px] border-border'
    >
      {getActiveSidebar()}
    </ResizablePanel>
  );
};

export default Sidebar;
