import React, { JSX, useState } from 'react';
import Tab from './Tab';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { closestElement, removeElement } from '@/utils/array-utils';
import { Plus } from 'lucide-react';
import { Separator } from '../ui/separator';
import EditorTabView, { cleanupEditorModel } from './EditorTabView';
import { useDbConnectionManager } from '@/managers/DbConnectionManager';
import { toast } from 'sonner';

export interface TabMetadata {
  title: string;
  connectionId: string;
  type: 'editor';
  icon?: JSX.Element;
}

export interface TabData {
  id: string;
  metadata: TabMetadata;
  data?: string;
}

interface TabViewContainerProps {}

const TabViewContainer = (props: TabViewContainerProps) => {
  const [activeTabId, setActiveTabId] = useState<string>();
  const [tabs, setTabs] = useState<TabData[]>([]);
  const getAllConnectionsQuery = useDbConnectionManager().getAllConnections();
  const MAX_TABS = 20;

  const closeTab = (closedTab: TabData) => {
    cleanupEditorModel(closedTab.id);

    if (activeTabId === closedTab.id) {
      const newActiveElement = closestElement(tabs, closedTab);
      if (newActiveElement) {
        setActiveTabId(newActiveElement.id);
      } else {
        setActiveTabId(undefined);
      }
    }
    setTabs(removeElement(tabs, closedTab));
  };

  const getRecentConnection = () => {
    const sortedConnections = getAllConnectionsQuery.data?.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return sortedConnections && sortedConnections.length > 0 ? sortedConnections[0] : undefined;
  };

  const newTab = () => {
    const connection = getRecentConnection();
    if (!connection) {
      toast.info('Connect to a database first to get started!');
      return;
    }
    const newTab: TabData = {
      id: `${connection.connectionId}-${crypto.randomUUID()}`,
      metadata: {
        title: `(@${connection.connectionConfig.host})`,
        connectionId: connection.connectionId,
        type: 'editor',
      },
      data: `-- Write your SQL queries here`,
    };

    setTabs([...tabs, newTab]);
    setActiveTabId(newTab.id);
  };

  const updateTabData = (tabId: string, newData: string) => {
    setTabs((prev) => prev.map((t) => (t.id === tabId ? { ...t, data: newData } : t)));
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
              className='p-1 m-2 rounded-sm h-fit w-fit flex items-center justify-center hover:bg-accent transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none'
              onClick={newTab}
              disabled={tabs.length === MAX_TABS}
              whileTap={{ scale: 0.9 }}
            >
              <Plus className='min-h-4 min-w-4 w-4 h-4 text-foreground' />
            </motion.button>
          </Reorder.Group>
        </div>
      </div>
      <Separator orientation='horizontal' />
      <div className='flex h-full w-full relative'>
        {activeTabId && tabs.find((t) => t.id === activeTabId) && (
          <EditorTabView
            key='single-editor'
            tabId={activeTabId}
            data={tabs.find((t) => t.id === activeTabId)?.data ?? ''}
            connectionId={tabs.find((t) => t.id === activeTabId)?.metadata.connectionId ?? ''}
            onTabDataChange={updateTabData}
          />
        )}
      </div>
    </div>
  );
};

export default TabViewContainer;
