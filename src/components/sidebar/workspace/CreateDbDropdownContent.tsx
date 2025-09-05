import React, { useEffect, useState } from 'react';
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
import { useDialog } from '@/components/contexts/DialogContext';
import { DatabaseConfig } from '@/model/DatabaseModel';
import { DatabaseConnectionModals, DatabaseIcons } from '@/types/database';
import { dbPluginManager } from '@/managers/manager.config';

type CreateDbDropdownContentProps = {
  onDialogOpen: () => void;
};

const CreateDbDropdownContent = (props: CreateDbDropdownContentProps) => {
  const { setDialogOpen, setDialogContent } = useDialog();
  const [supportedDbConfigs, setSupportedDbConfigs] = useState<DatabaseConfig[]>([]);

  useEffect(() => {
    if (supportedDbConfigs.length > 0) return;
    dbPluginManager.getSupportedDbConfigs().then((configs) => {
      setSupportedDbConfigs(configs);
    });
  }, [supportedDbConfigs]);

  const selectDbType = (id: string) => () => {
    props.onDialogOpen();
    setDialogContent(DatabaseConnectionModals[id as keyof typeof DatabaseConnectionModals]);
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
              {supportedDbConfigs.map((config) => {
                return (
                  <DropdownMenuItem key={config.id} onClick={selectDbType(config.id)}>
                    {DatabaseIcons[config.id]({ className: '!size-4' })}
                    {config.name}
                  </DropdownMenuItem>
                );
              })}
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
