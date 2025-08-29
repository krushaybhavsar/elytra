import React from 'react';
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { Database, FolderPlus } from 'lucide-react';
import { SupportedDbTypeMap, SupportedDbTypes } from '@/services/database/types';
import { useDialog } from '@/components/contexts/DialogContext';

type CreateDbDropdownContentProps = {
  onDialogOpen: () => void;
};

const CreateDbDropdownContent = (props: CreateDbDropdownContentProps) => {
  const { setDialogOpen, setDialogContent } = useDialog();

  const selectDbType = (dbType: SupportedDbTypes) => () => {
    props.onDialogOpen();
    setDialogContent(SupportedDbTypeMap[dbType].connectionModalContent({ dbProtocol: dbType }));
    setDialogOpen(true);
  };

  return (
    <DropdownMenuContent className='w-fit' align='start'>
      <DropdownMenuGroup>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Database className='!size-4' />
            New connection
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {Object.entries(SupportedDbTypeMap).map(({ 0: dbId, 1: db }) => (
                <DropdownMenuItem key={dbId} onClick={selectDbType(dbId as SupportedDbTypes)}>
                  <db.icon className='size-4' />
                  {db.displayName}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuItem>
          <FolderPlus className='!size-4' />
          New group
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
};

export default CreateDbDropdownContent;
