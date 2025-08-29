import { useDialog } from '@/components/contexts/DialogContext';
import NavigationBar from '@/components/NavigationBar';
import Sidebar from '@/components/sidebar/Sidebar';
import { Dialog } from '@/components/ui/dialog';
import { AppScreens, NavigationBarTabs } from '@/types/navigation';
import { updateScreenTitleBar } from '@/utils/windowUtils';
import React, { useEffect, useState } from 'react';

const MainScreen = () => {
  const [activeTab, setActiveTab] = useState<NavigationBarTabs>(NavigationBarTabs.WORKSPACE);
  const { isOpen, dialogContent, setDialogOpen } = useDialog();

  useEffect(() => {
    updateScreenTitleBar(AppScreens.MAIN);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setDialogOpen}>
      <div className='w-full h-full flex bg-darker-background'>
        <NavigationBar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className='flex flex-row w-full h-full rounded-tl-xl border-border border-[1px] bg-background overflow-clip'>
          <Sidebar activeTab={activeTab} />
        </div>
      </div>
      {dialogContent}
    </Dialog>
  );
};

export default MainScreen;
