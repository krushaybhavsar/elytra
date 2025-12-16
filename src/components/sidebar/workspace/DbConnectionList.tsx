import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { TypographyHint, TypographyP } from '@/components/ui/typography';
import { useDbConnectionManager } from '@/managers/DbConnectionManager';
import { DatabaseIcons } from '@/types/database.types';
import { ChevronRight, Edit, SquarePlus, Trash } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface DbConnectionList {
  searchQuery: string;
  onNewTab?: (connectionId: string) => void;
}

const DbConnectionList = (props: DbConnectionList) => {
  const dbConnectionManager = useDbConnectionManager();
  const { data: connections } = dbConnectionManager.getAllConnections();
  const closeConnectionMutation = dbConnectionManager.closeConnection();
  const [filteredConnections, setFilteredConnections] = useState(connections);

  useEffect(() => {
    if (props.searchQuery && props.searchQuery.trim().length > 0 && connections) {
      const filtered = connections.filter(
        (connection) =>
          connection.connectionConfig.name
            .toLowerCase()
            .includes(props.searchQuery.toLowerCase()) ||
          connection.connectionConfig.user
            ?.toLowerCase()
            .includes(props.searchQuery.toLowerCase()) ||
          connection.connectionConfig.host
            ?.toLowerCase()
            .includes(props.searchQuery.toLowerCase()) ||
          connection.connectionConfig.database
            ?.toLowerCase()
            .includes(props.searchQuery.toLowerCase()),
      );
      setFilteredConnections(filtered);
    } else {
      setFilteredConnections(connections);
    }
  }, [props.searchQuery, connections]);

  return (
    <div className='flex flex-col px-2 justify-start items-center w-full h-fit'>
      {filteredConnections &&
        filteredConnections.map((connection, index) => (
          <div key={index} className='w-full'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className='group relative flex flex-row p-2 gap-2 w-full rounded-sm justify-start items-start overflow-hidden cursor-pointer hover:bg-accent'>
                  {DatabaseIcons[connection.connectionConfig.pluginId]({
                    className: 'size-4 shrink-0 mt-0.5',
                  })}
                  <div className='flex flex-col w-full gap-0.5 justify-start items-start min-w-0 overflow-hidden'>
                    <TypographyP className='!text-[14px] !text-foreground whitespace-nowrap truncate w-full text-start'>
                      {connection.connectionConfig.name}
                    </TypographyP>
                    {connection.connectionConfig.user && (
                      <TypographyHint className='!text-[12px] whitespace-nowrap truncate w-full text-start'>
                        {connection.connectionConfig.user}
                      </TypographyHint>
                    )}
                  </div>
                  <div className='pointer-events-none absolute right-0 top-0 bottom-0 w-14 bg-gradient-to-r from-transparent via-accent/100 to-accent opacity-0 group-hover:opacity-100' />
                  <div className='absolute right-2 top-0 bottom-0 flex justify-center items-center opacity-0 group-hover:opacity-100'>
                    <ChevronRight className='!size-4 !stroke-[2px] !stroke-foreground shrink-0 relative' />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-56' align='start' side='right'>
                <DropdownMenuItem onClick={() => props.onNewTab?.(connection.connectionId)}>
                  <SquarePlus className='!size-4' />
                  New tab
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className='!size-4' />
                  Edit connection
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className='!focus:bg-destructive/5 !focus:text-destructive hover:!bg-destructive/5 hover:!text-destructive'
                  onClick={() => closeConnectionMutation.mutate(connection.connectionId)}
                  disabled={closeConnectionMutation.isPending}
                >
                  <Trash />
                  Remove connection
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {index < filteredConnections.length - 1 && <Separator className='w-full my-1' />}
          </div>
        ))}
    </div>
  );
};

export default DbConnectionList;
