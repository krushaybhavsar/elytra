import { TypographyHint, TypographyP } from '@/components/ui/typography';
import React from 'react';
import NotebookCellEditor from './NotebookCellEditor';
import QueryResultTable from '../QueryResultTable';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, FastForward, GripVertical, Play, Trash } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface CellData {
  id: string;
  data: string;
  result: CellResult;
}

export interface CellResult {
  loading: boolean;
  result?: {
    success: boolean;
    message: string;
    result?: {
      rows: any[];
      rowCount: number | null;
      fields: any;
      executionTimeMs: number;
    };
  };
}

interface NotebookCellProps {
  id: string;
  index: number;
  cellData?: CellData;
  onChangeContent: (value: string) => void;
  onRunCell: () => void;
  onRunCellAndBelow: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const NotebookCell = (props: NotebookCellProps) => {
  const result = props.cellData?.result;
  const hasResult = !!result && !result.loading && result.result;

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: props.cellData?.id || props.id || `cell-${props.index}`,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className='relative group flex flex-row w-full gap-2'>
      <div className='flex flex-col w-fit h-full select-none items-start pt-1.5'>
        <div className='h-full w-full flex justify-center items-start'>
          <div
            {...attributes}
            {...listeners}
            className='inline-flex items-center justify-center cursor-grab active:cursor-grabbing transition-opacity opacity-0 group-hover:opacity-100 hover:bg-accent rounded-sm !size-6'
            aria-label='Drag to reorder'
          >
            <GripVertical className='size-4' />
          </div>
        </div>
      </div>
      <div className='relative flex-1 flex-col w-full h-fit gap-2 border-[1px] border-border rounded-sm bg-background'>
        <div className='border-b-[1px] border-border p-1 flex items-center justify-between gap-1'>
          <div className='flex flex-row gap-1 justify-start items-center'>
            <Button
              variant='ghost'
              size='icon'
              className='!rounded-sm !hover:bg-background !size-6'
              onClick={props.onRunCell}
            >
              <Play className='size-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='!rounded-sm !hover:bg-background !size-6'
              onClick={props.onRunCellAndBelow}
            >
              <FastForward className='size-4' />
            </Button>
            <div className='mx-2'>
              <TypographyHint className='!font-mono !text-[12px]'>
                {`Cell ${props.index + 1} `}
              </TypographyHint>
            </div>
          </div>

          <div className='flex flex-row gap-1'>
            <Button
              variant='ghost'
              size='icon'
              className='!rounded-sm !hover:bg-background !size-6'
              onClick={props.onMoveUp}
            >
              <ArrowUp className='size-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='!rounded-sm !hover:bg-background !size-6'
              onClick={props.onMoveDown}
            >
              <ArrowDown className='size-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='!rounded-sm !hover:bg-background !size-6'
              onClick={props.onDelete}
            >
              <Trash className='size-4' />
            </Button>
          </div>
        </div>

        {/* Editor */}
        <NotebookCellEditor
          cellData={props.cellData?.data ?? ''}
          onCellDataChange={props.onChangeContent}
          height={150}
        />

        {/* Results */}
        {result && result.result && (
          <div className='mt-2 border-t border-border pt-2'>
            {result.loading && (
              <div className='p-2'>
                <TypographyP className='!text-[14px] !font-mono text-muted-foreground'>
                  Running query...
                </TypographyP>
              </div>
            )}
            {!result.loading && !result.result.success && (
              <div className='p-2'>
                <TypographyP className='!text-[14px] !font-mono text-destructive'>
                  {result.result.message}
                </TypographyP>
              </div>
            )}
            {!result.loading &&
              result.result.success &&
              result.result.result &&
              result.result.result.rows &&
              result.result.result.rows.length > 0 && (
                <div className='p-2'>
                  <QueryResultTable data={result.result.result} />
                </div>
              )}
            {!result.loading &&
              result.result.success &&
              result.result.result &&
              (!result.result.result.rows || result.result.result.rows.length === 0) && (
                <div className='p-2'>
                  <TypographyP className='!text-[14px] !font-mono text-muted-foreground'>
                    {result.result.message || 'Query executed successfully with no rows returned.'}
                  </TypographyP>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotebookCell;
