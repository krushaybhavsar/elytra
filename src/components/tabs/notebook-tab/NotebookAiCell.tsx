import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, LoaderCircle, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import NotebookCellEditor from './NotebookCellEditor';
import { Separator } from '@/components/ui/separator';

interface NotebookAiCellProps {
  cellData: string;
  prompt: string;
  onCellDataChange?: (value: string) => void;
  onPromptChange?: (value: string) => void;
  height?: number;
}

const NotebookAiCell = (props: NotebookAiCellProps) => {
  const [loading, setLoading] = useState(false);

  const generateAiResponse = async () => {};

  return (
    <div className='flex flex-col w-full relative'>
      <div className='relative w-full flex flex-row items-center'>
        {loading ? (
          <LoaderCircle
            className='!size-4 animate-spin !duration-500 stroke-muted-foreground ml-2'
            strokeWidth={2}
          />
        ) : (
          <Sparkles className='!size-4 text-muted-foreground ml-2' />
        )}
        <Input
          className='border-0 px-2'
          placeholder='Ask AI to generate, explain, or optimize a query...'
          value={props.prompt}
          onChange={(e) => props.onPromptChange?.(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              generateAiResponse();
            }
          }}
          disabled={loading}
        />
        <Button
          variant='ghost'
          size='icon'
          className={`!rounded-sm !hover:bg-background !size-6 flex-shrink-0 mr-2 ${props.prompt.trim() !== '' && !loading ? 'bg-sidebar' : ''}`}
          onClick={generateAiResponse}
          disabled={loading}
        >
          <ArrowRight />
        </Button>
      </div>
      <Separator className='' />
      <NotebookCellEditor
        cellData={props.cellData}
        onCellDataChange={props.onCellDataChange}
        height={props.height}
        disableEditing={loading}
      />
    </div>
  );
};

export default NotebookAiCell;
