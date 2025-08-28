import React from 'react';
import { TypographyP } from '../../ui/typography';
import { Button } from '../../ui/button';
import { EllipsisVertical, Locate, Plus, RefreshCw } from 'lucide-react';
import { Separator } from '../../ui/separator';
import { Input } from '../../ui/input';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CreateDbDropdownContent from './CreateDbDropdownContent';

type WorkspaceSidebarProps = {};

const WorkspaceSidebar = (props: WorkspaceSidebarProps) => {
  return (
    <div className='flex flex-col w-full h-full'>
      <div className='flex flex-row justify-between p-2 pl-4 items-center'>
        <TypographyP>Database</TypographyP>
        <div className='flex flex-row gap-2'>
          <Button variant='icon' size='icon' className='!p-0 !size-6'>
            <Locate className='size-4' />
          </Button>
          <Button variant='icon' size='icon' className='!p-0 !size-6'>
            <EllipsisVertical className='size-4' />
          </Button>
        </div>
      </div>
      <Separator orientation='horizontal' />
      <div className='flex flex-row justify-between p-2 items-center gap-2'>
        <div className='flex flex-row gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='icon' size='icon' className='!p-0 !size-6'>
                <Plus className='size-4' />
              </Button>
            </DropdownMenuTrigger>
            <CreateDbDropdownContent />
          </DropdownMenu>
          <Button variant='icon' size='icon' className='!p-0 !size-6'>
            <RefreshCw className='size-4' />
          </Button>
        </div>
        <Input
          type='text'
          placeholder='Search'
          className='!p-1 !h-7 !px-2 !py-0 !text-[12px] rounded-full'
        />
      </div>
    </div>
  );
};

export default WorkspaceSidebar;
