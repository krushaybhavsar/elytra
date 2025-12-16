import React, { JSX, useState, forwardRef, useImperativeHandle } from 'react';
import Tab from './Tab';
import { AnimatePresence, Reorder } from 'motion/react';
import { closestElement, removeElement } from '@/utils/array-utils';
import { Separator } from '../ui/separator';
import { useDbConnectionManager } from '@/managers/DbConnectionManager';
import { toast } from 'sonner';
import NotebookTabView, { NotebookTabData } from './notebook-tab/NotebookTabView';

export const enum TabType {
  EDITOR = 'editor',
  NOTEBOOK = 'notebook',
}

export interface TabMetadata {
  title: string;
  connectionId: string;
  type: TabType;
  icon?: JSX.Element;
}

export interface TabData {
  id: string;
  metadata: TabMetadata;
  data?: NotebookTabData;
}

interface TabViewContainerProps {}

const TabViewContainer = forwardRef<
  { newTab: (connectionId?: string) => void },
  TabViewContainerProps
>((props, ref) => {
  const [activeTabId, setActiveTabId] = useState<string>();
  const [tabs, setTabs] = useState<string[]>([]);
  const [tabDataMap, setTabDataMap] = useState<Map<string, TabData>>(new Map());
  const getAllConnectionsQuery = useDbConnectionManager().getAllConnections();
  const MAX_TABS = 20;

  useImperativeHandle(ref, () => ({
    newTab,
  }));

  const getRecentConnection = () => {
    const sortedConnections = getAllConnectionsQuery.data?.sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return sortedConnections && sortedConnections.length > 0 ? sortedConnections[0] : undefined;
  };

  const newTab = (connectionId?: string) => {
    let connection = null;
    if (connectionId) {
      connection = getAllConnectionsQuery.data?.find((c) => c.connectionId === connectionId);
    } else {
      connection = getRecentConnection();
    }
    if (!connection) {
      toast.info('Connect to a database first to get started!');
      return;
    }
    const newTabData: TabData = {
      id: `${connection.connectionId}-${crypto.randomUUID()}`,
      metadata: {
        title: `(@${connection.connectionConfig.host})`,
        connectionId: connection.connectionId,
        type: TabType.NOTEBOOK,
      },
    };
    setTabData(newTabData);
    setTabs([...tabs, newTabData.id]);
    setActiveTabId(newTabData.id);
  };

  const closeTab = (closedTabId: string) => {
    if (activeTabId === closedTabId) {
      const newActiveTabId = closestElement(tabs, closedTabId);
      if (newActiveTabId) {
        setActiveTabId(newActiveTabId);
      } else {
        setActiveTabId(undefined);
      }
    }
    setTabs(removeElement(tabs, closedTabId));
    setTabDataMap((prev) => {
      const newMap = new Map(prev);
      newMap.delete(closedTabId);
      return newMap;
    });
  };

  const setTabData = (newTabData: TabData) => {
    setTabDataMap((prev) => {
      const newMap = new Map(prev);
      newMap.set(newTabData.id, newTabData);
      return newMap;
    });
  };

  const getActiveTabView = () => {
    if (activeTabId && tabDataMap.has(activeTabId)) {
      const tabData = tabDataMap.get(activeTabId)!;
      if (tabData.metadata.type === TabType.NOTEBOOK) {
        return (
          <NotebookTabView
            key={activeTabId}
            tabData={tabData}
            setTabData={setTabData}
            connectionId={tabData.metadata.connectionId}
          />
        );
      }
    }
  };

  return (
    <div className='relative w-full max-w-full flex flex-col h-full bg-background overflow-hidden'>
      <div className='w-full h-10 pb-0 bg-background flex'>
        <div className='grid grid-cols-[1fr] w-full overflow-hidden min-h-10'>
          <Reorder.Group
            axis='x'
            onReorder={setTabs}
            values={tabs}
            layoutScroll
            className='flex items-center overflow-hidden'
          >
            <AnimatePresence initial={false}>
              {tabs.map((tabId) => (
                <Tab
                  key={tabId}
                  tabData={tabDataMap.get(tabId)!}
                  isActive={activeTabId === tabId}
                  onClick={() => setActiveTabId(tabId)}
                  onClose={() => closeTab(tabId)}
                  isFirst={tabs[0] === tabId}
                />
              ))}
            </AnimatePresence>
            {/* <motion.button
              className='p-1 m-2 rounded-sm h-fit w-fit flex items-center justify-center hover:bg-accent transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none'
              onClick={newTab}
              disabled={tabs.length === MAX_TABS}
              whileTap={{ scale: 0.9 }}
            >
              <Plus className='min-h-4 min-w-4 w-4 h-4 text-foreground' />
            </motion.button> */}
          </Reorder.Group>
        </div>
      </div>
      <Separator orientation='horizontal' />
      <div className='flex h-full w-full relative'>{getActiveTabView()}</div>
    </div>
  );
});

TabViewContainer.displayName = 'TabViewContainer';

export default TabViewContainer;
