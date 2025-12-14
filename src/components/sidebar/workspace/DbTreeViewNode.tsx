import { ChevronDown, ChevronRight, LoaderCircle } from 'lucide-react';
import React from 'react';
import { EventCallback, IBranchProps, INode, LeafProps } from 'react-accessible-treeview';
import { IFlatMetadata } from 'react-accessible-treeview/dist/TreeView/utils';

interface DbTreeViewNodeProps {
  element: INode<IFlatMetadata>;
  isBranch: boolean;
  isExpanded: boolean;
  getNodeProps: (
    args?:
      | {
          onClick?: EventCallback | undefined;
        }
      | undefined,
  ) => IBranchProps | LeafProps;
  level: number;
  handleExpand: EventCallback;
  isLoading: boolean;
}

const DbTreeViewNode = (props: DbTreeViewNodeProps) => {
  const branchNode = (isExpanded: boolean): React.ReactNode => {
    return props.isLoading ? (
      <LoaderCircle className='animate-spin !duration-500 stroke-foreground w-4 h-4 min-w-4 min-h-4' />
    ) : isExpanded ? (
      <ChevronDown className='stroke-foreground w-4 h-4 min-w-4 min-h-4' />
    ) : (
      <ChevronRight className='stroke-foreground w-4 h-4 min-w-4 min-h-4' />
    );
  };
  return (
    <div
      {...props.getNodeProps({ onClick: props.handleExpand })}
      style={{ marginLeft: 20 * (props.level - 1) }}
      className='flex flex-row items-center gap-1 select-none px-3 py-0.5 hover:bg-accent cursor-pointer'
    >
      {props.isBranch && branchNode(props.isExpanded)}
      <span
        className={`text-foreground text-[14px] whitespace-nowrap ${!props.isBranch && 'ml-5'}`}
      >
        {props.element.name}
      </span>
    </div>
  );
};

export default DbTreeViewNode;
