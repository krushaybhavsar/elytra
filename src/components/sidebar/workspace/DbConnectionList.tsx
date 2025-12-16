import { Separator } from '@/components/ui/separator';
import { TypographyHint, TypographyP } from '@/components/ui/typography';
import { useDbConnectionManager } from '@/managers/DbConnectionManager';
import { DatabaseIcons } from '@/types/database.types';
import React, { useEffect, useState } from 'react';

interface DbConnectionList {
  searchQuery: string;
}

const DbConnectionList = (props: DbConnectionList) => {
  const dbConnectionManager = useDbConnectionManager();
  const { data: connections } = dbConnectionManager.getAllConnections();
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
            <button className='flex flex-row p-2 gap-2 w-full rounded-sm hover:bg-accent justify-start items-start overflow-hidden'>
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
            </button>
            {index < filteredConnections.length - 1 && <Separator className='w-full my-1' />}
          </div>
        ))}
    </div>
  );
};

export default DbConnectionList;
