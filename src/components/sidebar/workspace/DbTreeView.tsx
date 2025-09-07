import React, { useEffect, useState } from 'react';
import TreeView, { INode, ITreeViewOnLoadDataProps, NodeId } from 'react-accessible-treeview';
import DbTreeViewNode from './DbTreeViewNode';
import { useDbConnectionManager } from '@/managers/DbConnectionManager';
import { flattenTree } from 'react-accessible-treeview';

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

interface DbTreeViewProps {
  searchQuery: string;
}

interface TreeNode {
  id?: NodeId;
  name: string;
  isBranch?: boolean;
  children?: TreeNode[];
  metadata?: {
    type: NodeType;
    connectionId?: string;
    pluginId?: string;
  };
}

const rootNode: TreeNode = {
  id: 0,
  name: 'root',
  isBranch: true,
  metadata: { type: NodeType.ROOT },
};

const DbTreeView = (props: DbTreeViewProps) => {
  const dbConnectionManager = useDbConnectionManager();
  const { data: connections } = dbConnectionManager.getAllConnections();
  const [loadingNodes, setLoadingNodes] = useState<Set<NodeId>>(new Set());
  const [focusedId, setFocusedId] = useState<NodeId>();
  const [data, setData] = useState<INode[]>(flattenTree(rootNode));

  useEffect(() => {
    if (connections && data) {
      addNodesToParent(
        0,
        connections.map((conn) => ({
          name: conn.connectionConfig.name,
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

  const addNodesToParent = (parentNodeId: NodeId, newNodes: TreeNode[]) => {
    const findAndUpdateNode = (node: TreeNode): boolean => {
      if (!node) return false;
      if (node.id === parentNodeId) {
        if (!node.children) {
          node.children = [];
        }
        node.children = [...node.children, ...newNodes];
        return true;
      }
      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          if (findAndUpdateNode(child)) {
            return true;
          }
        }
      }
      return false;
    };
    if (findAndUpdateNode(rootNode)) {
      const flattenedTree = flattenTree(rootNode);
      setData(flattenedTree);
    }
  };

  const onLoadData = async (props: ITreeViewOnLoadDataProps) => {};

  return (
    <div className='flex flex-col h-full w-full overflow-auto'>
      <TreeView
        data={data}
        onLoadData={onLoadData}
        focusedId={focusedId}
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
  );
};

export default DbTreeView;
