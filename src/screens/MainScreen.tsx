import NavigationBar from '@/components/NavigationBar';
import Sidebar from '@/components/sidebar/Sidebar';
import { AppScreens, NavigationBarTabs } from '@/types/navigation';
import { updateScreenTitleBar } from '@/utils/windowUtils';
import React, { useEffect, useState } from 'react';

const MainScreen = () => {
  const [activeTab, setActiveTab] = useState<NavigationBarTabs>(NavigationBarTabs.WORKSPACE);

  useEffect(() => {
    updateScreenTitleBar(AppScreens.MAIN);
  }, []);

  return (
    <div className='w-full h-full flex bg-darker-background'>
      <NavigationBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className='w-full h-full rounded-tl-xl border-border border-[1px] bg-background'>
        <Sidebar activeTab={activeTab} />
      </div>
    </div>
  );
};

export default MainScreen;
