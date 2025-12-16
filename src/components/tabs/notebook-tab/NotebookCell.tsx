import { TypographyHint, TypographyP } from '@/components/ui/typography';
import React from 'react';
import NotebookCellEditor from './NotebookCellEditor';
import QueryResultTable from '../QueryResultTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
      <div className='flex flex-col w-fit h-full select-none items-center pt-3.5 gap-2'>
        <TypographyHint className='!font-mono !text-[12px] flex-shrink-0'>
          {`[${props.index + 1}]`}
        </TypographyHint>
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
        <div className='border-b-[1px] border-border p-2 flex flex-row items-center justify-between gap-2 bg-muted/30'>
          <div className='flex flex-row items-center gap-2'>
            <Button
              variant='ghost'
              size='icon'
              className='!rounded-sm !hover:bg-background !size-6 flex-shrink-0'
              onClick={props.onRunCell}
            >
              <Play className='size-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='!rounded-sm !hover:bg-background !size-6 flex-shrink-0'
              onClick={props.onRunCellAndBelow}
            >
              <FastForward className='size-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='!rounded-sm !hover:bg-background !size-6 flex-shrink-0'
              onClick={props.onMoveUp}
            >
              <ArrowUp className='size-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='!rounded-sm !hover:bg-background !size-6 flex-shrink-0'
              onClick={props.onMoveDown}
            >
              <ArrowDown className='size-4' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='!rounded-sm !hover:bg-background !size-6 flex-shrink-0'
              onClick={props.onDelete}
            >
              <Trash className='size-4' />
            </Button>
          </div>

          <div className='flex flex-row items-center gap-2'>
            {result && (result.loading || result.result) && (
              <Badge
                variant='secondary'
                className={
                  '!font-mono flex-shrink-0 ' +
                  (result.loading
                    ? 'bg-warning/10 text-warning hover:bg-warning/10'
                    : result.result && result.result.success
                      ? 'bg-success/10 text-success hover:bg-success/10'
                      : 'bg-destructive/10 text-destructive hover:bg-destructive/10')
                }
              >
                {result.loading
                  ? 'Executing'
                  : result.result && (result.result.success ? 'Success' : 'Failed')}
              </Badge>
            )}

            {result && result.result && result.result.success && result.result.result && (
              <Badge variant='secondary' className='!font-mono flex-shrink-0'>
                {`${result.result.result.executionTimeMs.toFixed(2)} ms`}
              </Badge>
            )}

            {result && result.result && result.result.success && result.result.result && (
              <TypographyHint className='!font-mono !text-[12px] flex-shrink-0'>
                {`${result.result.result.rowCount ?? 0} row(s) ${
                  result.result.result.rows && result.result.result.rows.length === 0
                    ? 'affected'
                    : 'returned'
                }`}
              </TypographyHint>
            )}
          </div>
        </div>

        {/* Editor */}
        <NotebookCellEditor
          cellData={props.cellData?.data ?? ''}
          onCellDataChange={props.onChangeContent}
          height={150}
        />

        {/* Results */}
        {result && (
          <div
            className={`relative border-t border-border ${hasResult || result.loading ? '' : 'border-none'}`}
          >
            {result.loading && (
              <div className='p-4'>
                <TypographyP className='!text-[14px] !font-mono text-muted-foreground'>
                  Executing query...
                </TypographyP>
              </div>
            )}
            {!result.loading && result.result && !result.result.success && (
              <div className='p-4'>
                <TypographyP className='!text-[14px] !font-mono text-destructive'>
                  {result.result.message}
                </TypographyP>
              </div>
            )}
            {!result.loading &&
              result.result &&
              result.result.success &&
              result.result.result &&
              result.result.result.rows &&
              result.result.result.rows.length > 0 && (
                <div className='p-4'>
                  <QueryResultTable data={result.result.result} />
                </div>
              )}
            {!result.loading &&
              result.result &&
              result.result.success &&
              result.result.result &&
              (!result.result.result.rows || result.result.result.rows.length === 0) && (
                <div className='p-4'>
                  <TypographyP className='!text-[14px] !font-mono text-muted-foreground'>
                    {result.result.message}
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
