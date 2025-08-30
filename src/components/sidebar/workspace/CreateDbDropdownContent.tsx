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
import { databaseManager } from '@/managers/manager.config';

type CreateDbDropdownContentProps = {
  onDialogOpen: () => void;
};

const CreateDbDropdownContent = (props: CreateDbDropdownContentProps) => {
  const { setDialogOpen, setDialogContent } = useDialog();
  const [supportedDatabases, setSupportedDatabases] = useState<string[]>([]);

  useEffect(() => {
    databaseManager.getSupportedDatabases().then((dbTypes) => {
      console.log('Supported databases:', dbTypes);
      setSupportedDatabases(dbTypes);
    });
  }, []);

  const selectDbType = (dbType: string) => () => {
    props.onDialogOpen();
    // setDialogContent(dbConfig.connectionModalContent({ dbProtocol: dbType }));
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
              {supportedDatabases.map((dbType) => {
                return (
                  <DropdownMenuItem key={dbType} onClick={selectDbType(dbType)}>
                    {/* <db.icon className='size-4' />
                    <img src={dbConfig?.icon} alt={dbConfig?.name} className='!size-4' />
                    {dbConfig?.name} */}
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
