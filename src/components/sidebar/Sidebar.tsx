import { NavigationBarTabs } from '@/types/navigation';
import React from 'react';
import WorkspaceSidebar from './WorkspaceSidebar';
import DashboardSidebar from './DashboardSidebar';
import ChatSidebar from './ChatSidebar';

type SidebarProps = {
  activeTab: NavigationBarTabs;
};

const Sidebar = (props: SidebarProps) => {
  const getActiveSidebar = () => {
    switch (props.activeTab) {
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

  return <div className='flex flex-col min-w-100 bg-pink h-full'>{getActiveSidebar()}</div>;
};

export default Sidebar;
