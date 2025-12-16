import { TypographyHint, TypographyP } from '@/components/ui/typography';
import React from 'react';
import NotebookCellEditor from './NotebookCellEditor';
import QueryResultTable from '../QueryResultTable';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, FastForward, Play, Trash } from 'lucide-react';

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

  return (
    <div className='relative flex flex-row w-full p-2 gap-2'>
      <div className='flex w-fit h-full select-none items-start pt-1.5'>
        <TypographyHint className='!font-mono !text-[12px] !text-muted-foreground'>
          {`[${props.index + 1}]:`}
        </TypographyHint>
      </div>
      <div
        className='relative flex-1 flex-col w-full h-fit gap-2 border-[1px] border-border rounded-sm bg-background'
      >
        {/* Action Buttons */}
        <div className='border-b-[1px] border-border p-1 flex items-center justify-start gap-1'>
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
          <Button
            variant='ghost'
            size='icon'
            className='!rounded-sm !hover:bg-background !size-6'
            onClick={props.onDelete}
          >
            <Trash className='size-4' />
          </Button>
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
                    {result.result.message ||
                      'Query executed successfully with no rows returned.'}
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
