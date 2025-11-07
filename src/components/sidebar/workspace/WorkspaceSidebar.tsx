import React, { useState } from 'react';
import { TypographyHint, TypographyP } from '../../ui/typography';
import { Button } from '../../ui/button';
import { EllipsisVertical, Locate, Plus, RefreshCw } from 'lucide-react';
import { Separator } from '../../ui/separator';
import { Input } from '../../ui/input';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import CreateDbDropdownContent from './CreateDbDropdownContent';
import DbTreeView from './DbTreeView';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type WorkspaceSidebarProps = {};

const WorkspaceSidebar = (props: WorkspaceSidebarProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className='flex flex-col w-full h-full'>
      <div className='flex flex-row justify-between p-2 pl-4 items-center'>
        <TypographyP>Database</TypographyP>
        <div className='flex flex-row gap-2'>
          <Tooltip>
            <TooltipTrigger>
              <Button
                asChild
                variant='icon'
                size='icon'
                className='flex justify-center items-center !p-1 !size-6'
              >
                <Locate className='size-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent align='center' side='bottom'>
              <TypographyHint>{'Focus selected node'}</TypographyHint>
            </TooltipContent>
          </Tooltip>
          <Button variant='icon' size='icon' className='!p-0 !size-6'>
            <EllipsisVertical className='size-4' />
          </Button>
        </div>
      </div>
      <Separator orientation='horizontal' />
      <div className='flex flex-row justify-between p-2 pr-4 items-center gap-2'>
        <div className='flex flex-row gap-2'>
          <Tooltip>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <TooltipTrigger>
                <DropdownMenuTrigger asChild>
                  <Button
                    asChild
                    variant='icon'
                    size='icon'
                    className='flex justify-center items-center !p-1 !size-6'
                  >
                    <Plus className='!size-4' />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <CreateDbDropdownContent onDialogOpen={() => setIsDropdownOpen(false)} />
            </DropdownMenu>
            <TooltipContent align='center' side='bottom'>
              <TypographyHint>{'Add connection'}</TypographyHint>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button
                asChild
                variant='icon'
                size='icon'
                className='flex justify-center items-center !p-1 !size-6'
              >
                <RefreshCw className='size-4' />
              </Button>
            </TooltipTrigger>
            <TooltipContent align='center' side='bottom'>
              <TypographyHint>{'Refresh connections'}</TypographyHint>
            </TooltipContent>
          </Tooltip>
        </div>
        <Input
          type='text'
          placeholder='Search'
          className='!p-1 !h-7 !px-2 !py-0 !text-[12px] rounded-full'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <DbTreeView searchQuery={searchQuery} />
    </div>
  );
};

export default WorkspaceSidebar;
