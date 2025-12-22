import { TypographyHint, TypographyP } from '@/components/ui/typography';
import React from 'react';
import NotebookCellEditor from './NotebookCellEditor';
import QueryResultTable from '../QueryResultTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowDown, ArrowUp, GripVertical, Play, Sparkles, Trash } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import NotebookAiCell from './NotebookAiCell';

export interface CellData {
  id: string;
  data: string;
  aiMode: boolean;
  prompt: string;
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
  onChangePrompt: (prompt: string) => void;
  onChangeAiMode: (aiMode: boolean) => void;
  onRunCell: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const NotebookCell = (props: NotebookCellProps) => {
  const result = props.cellData?.result;
  const hasResult = !!result && !result.loading && result.result;
  const aiMode = props.cellData?.aiMode ?? false;

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: props.cellData?.id || props.id || `cell-${props.index}`,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='relative group flex flex-row w-full max-w-full gap-2'
    >
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
      <div className='relative flex-1 flex-col w-full min-w-0 h-fit gap-2 border-[1px] border-border rounded-sm bg-background'>
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

            <div className='h-4 w-px bg-border mx-1' />

            <Tabs
              value={aiMode ? 'ai' : 'sql'}
              onValueChange={(value) => props.onChangeAiMode(value === 'ai')}
            >
              <TabsList className='h-7 p-0.5'>
                <TabsTrigger value='ai' className='h-6 px-2 text-xs gap-1'>
                  <Sparkles className='size-3' />
                  AI
                </TabsTrigger>
                <TabsTrigger value='sql' className='h-6 px-2 text-xs gap-1'>
                  SQL
                </TabsTrigger>
              </TabsList>
            </Tabs>
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
        {aiMode ? (
          <NotebookAiCell
            cellData={props.cellData?.data ?? ''}
            prompt={props.cellData?.prompt ?? ''}
            onCellDataChange={props.onChangeContent}
            onPromptChange={props.onChangePrompt}
            height={150}
          />
        ) : (
          <NotebookCellEditor
            cellData={props.cellData?.data ?? ''}
            onCellDataChange={props.onChangeContent}
            height={150}
          />
        )}

        {/* Results */}
        {result && (
          <div
            className={`relative border-t border-border overflow-x-auto ${hasResult || result.loading ? '' : 'border-none'}`}
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
