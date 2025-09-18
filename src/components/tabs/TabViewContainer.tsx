import React, { JSX, useState } from 'react';
import Tab from './Tab';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { closestElement, removeElement } from '@/utils/array-utils';
import { Plus } from 'lucide-react';
import { Separator } from '../ui/separator';

export interface TabMetadata {
  title: string;
  type: 'editor';
}

export interface TabData {
  id: string;
  metadata: TabMetadata;
  view: JSX.Element;
}

interface TabViewContainerProps {}

const TabViewContainer = (props: TabViewContainerProps) => {
  const [activeTabId, setActiveTabId] = useState<string>();
  const [tabs, setTabs] = useState<TabData[]>([]);
  const MAX_TABS = 20;

  const closeTab = (closedTab: TabData) => {
    if (activeTabId === closedTab.id) {
      const newActiveElement = closestElement(tabs, closedTab);
      if (newActiveElement) {
        setActiveTabId(newActiveElement.id);
      }
    }
    setTabs(removeElement(tabs, closedTab));
  };

  const newTab = () => {
    const randomNum = Math.floor(Math.random() * 10000);
    const newTab: TabData = {
      id: randomNum.toString(),
      metadata: { title: `Tab ${randomNum}`, type: 'editor' },
      view: <div>{`Tab ${randomNum} Content`}</div>,
    };

    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  return (
    <div className='w-full flex flex-col h-full bg-background overflow-hidden'>
      <div className='w-full h-10 pb-0 bg-background flex'>
        <div className='grid grid-cols-[1fr] w-full overflow-hidden'>
          <Reorder.Group
            axis='x'
            onReorder={setTabs}
            values={tabs}
            layoutScroll
            className='flex items-center overflow-hidden'
          >
            <AnimatePresence initial={false}>
              {tabs.map((tab) => (
                <Tab
                  key={tab.id}
                  tab={tab}
                  isActive={activeTabId === tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  onClose={() => closeTab(tab)}
                  isFirst={tabs[0] === tab}
                />
              ))}
            </AnimatePresence>
            <motion.button
              className='p-1 m-2 rounded-sm h-fit w-fit flex items-center justify-center hover:bg-gray-background transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none'
              onClick={newTab}
              disabled={tabs.length === MAX_TABS}
              whileTap={{ scale: 0.9 }}
            >
              <Plus className='min-h-4 min-w-4 w-4 h-4 text-primary' />
            </motion.button>
          </Reorder.Group>
        </div>
      </div>
      <Separator orientation='horizontal' />
      <div className='flex flex-grow items-center justify-center'>
        <AnimatePresence mode='wait'>
          <motion.div
            key={activeTabId}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.15 }}
            className='flex-grow flex items-center justify-center'
          >
            {tabs.find((tab) => tab.id === activeTabId)?.view}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TabViewContainer;
