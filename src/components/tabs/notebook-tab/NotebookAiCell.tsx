import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';
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

  const generateAiResponse = async () => {
    if (loading) return;
    setLoading(true);
    // Simulate AI processing delay
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div className='flex flex-col w-full relative'>
      <div className='relative w-full flex flex-row items-center'>
        <Input
          className='border-0 px-2'
          placeholder='Ask AI to generate, explain, or optimize a query...'
          value={props.prompt}
          onChange={(e) => props.onPromptChange?.(e.target.value)}
        />
        <Button
          variant='ghost'
          size='icon'
          className='!rounded-sm !hover:bg-background !size-6 flex-shrink-0 mr-2'
        >
          <ArrowRight />
        </Button>
      </div>
      <Separator className='' />
      <NotebookCellEditor
        cellData={props.cellData}
        onCellDataChange={props.onCellDataChange}
        height={props.height}
      />
    </div>
  );
};

export default NotebookAiCell;
