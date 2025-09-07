import React, { useEffect, useState } from 'react';
import TreeView, { INode, ITreeViewOnLoadDataProps, NodeId } from 'react-accessible-treeview';
import DbTreeViewNode from './DbTreeViewNode';
import { useDbConnectionManager } from '@/managers/DbConnectionManager';
import { IFlatMetadata } from 'react-accessible-treeview/dist/TreeView/utils';

export enum NodeType {
  ROOT = 'root',
  CONNECTION = 'connection',
  DATABASE = 'database',
  SCHEMA = 'schema',
  FOLDER = 'folder',
  TABLE = 'table',
  COLUMN = 'column',
  KEY = 'key',
  INDEX = 'index',
  VIEW = 'view',
  FUNCTION = 'function',
  PROCEDURE = 'procedure',
  TRIGGER = 'trigger',
}

const initialRootNode: INode<IFlatMetadata> = {
  id: 0,
  name: 'Root',
  children: [],
  parent: null,
  isBranch: true,
  metadata: {
    type: NodeType.ROOT,
  },
};

interface DbTreeViewProps {}

const DbTreeView = (props: DbTreeViewProps) => {
  const dbConnectionManager = useDbConnectionManager();
  const [data, setData] = useState<INode<IFlatMetadata>[]>([initialRootNode]);
  const [loadingNodes, setLoadingNodes] = useState<Set<NodeId>>(new Set());
  const [nodesAlreadyLoaded, setNodesAlreadyLoaded] = useState<INode<IFlatMetadata>[]>([]);
  const { data: connections } = dbConnectionManager.getAllConnections();

  useEffect(() => {
    console.log('Connections updated:', connections);
    if (connections && data) {
      updateTreeData(
        connections.map((conn, index) => ({
          name: conn.connectionConfig.name,
          children: [],
          id: data.length + index,
          parent: 0,
          isBranch: true,
          metadata: {
            type: NodeType.CONNECTION,
            connectionId: conn.connectionId,
            pluginId: conn.connectionConfig.pluginId,
          },
        })),
      );
    }
  }, [connections]);

  const updateTreeData = (newNodes: INode<IFlatMetadata>[]) => {
    // add new nodes to the tree data and update all parent references
    setData((prevData) => {
      const updatedData = [...prevData];
      newNodes.forEach((newNode) => {
        const parentIndex = updatedData.findIndex((node) => node.id === newNode.parent);
        if (parentIndex !== -1) {
          updatedData[parentIndex] = {
            ...updatedData[parentIndex],
            children: [...updatedData[parentIndex].children, newNode.id],
          };
          updatedData.push(newNode);
        }
      });
      return updatedData;
    });
  };

  const onLoadData = async (props: ITreeViewOnLoadDataProps) => {
    const nodeHasNoChildData = props.element.children.length === 0;
    const nodeHasAlreadyBeenLoaded = nodesAlreadyLoaded.find((e) => e.id === props.element.id);

    // Load data here

    if (nodeHasNoChildData && !nodeHasAlreadyBeenLoaded) {
      setNodesAlreadyLoaded([
        ...nodesAlreadyLoaded,
        props.element as unknown as INode<IFlatMetadata>,
      ]);
    }
  };

  return (
    <div className='flex flex-col h-full w-full overflow-auto'>
      <div className='checkbox'>
        <TreeView
          data={data}
          onLoadData={onLoadData}
          nodeRenderer={({ element, isBranch, isExpanded, getNodeProps, level, handleExpand }) => (
            <DbTreeViewNode
              element={element}
              isBranch={isBranch}
              isExpanded={isExpanded}
              getNodeProps={getNodeProps}
              level={level}
              handleExpand={handleExpand}
              isLoading={loadingNodes.has(element.id)}
            />
          )}
        />
      </div>
    </div>
  );
};

export default DbTreeView;
