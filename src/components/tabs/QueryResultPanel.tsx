import React from 'react';
import ResizablePanel from '../ui/resizable-panel';
import { QueryResult } from '@/model/DatabaseModel';
import { Badge } from '../ui/badge';
import { TypographyH3, TypographyHint, TypographyP } from '../ui/typography';
import { Play } from 'lucide-react';
import QueryResultTable from './QueryResultTable';

type QueryResultPanelProps = {
  panelHeight: number;
  onPanelHeightChange: React.Dispatch<React.SetStateAction<number>>;
  loading: boolean;
  queryResult: QueryResult | undefined;
};

const QueryResultPanel = (props: QueryResultPanelProps) => {
  return (
    <ResizablePanel
      axis='y'
      resizeHandles={['n']}
      initialHeight={0}
      minHeight={0}
      maxHeight={500}
      showThumb={true}
      className='w-full border-t-[1px] border-border flex-shrink-0'
      height={props.panelHeight}
      onHeightChange={props.onPanelHeightChange}
    >
      <div className='w-full h-full flex flex-col overflow-hidden'>
        {props.queryResult || props.loading ? (
          <div className='flex flex-row gap-2 w-full p-2 border-border border-b-[1px] items-center'>
            <Badge
              variant='secondary'
              className={
                '!font-mono ' +
                (props.loading
                  ? 'bg-warning/10 text-warning'
                  : props.queryResult?.success
                    ? 'bg-success/10 text-success'
                    : 'bg-destructive/10 text-destructive')
              }
            >
              {props.loading ? 'Executing' : props.queryResult?.success ? 'Success' : 'Failed'}
            </Badge>
            {props.queryResult?.result && (
              <Badge
                variant='secondary'
                className='!font-mono'
              >{`${props.queryResult.result.executionTimeMs} ms`}</Badge>
            )}
            <TypographyHint className='!font-mono !text-[12px]'>
              {!props.loading && props.queryResult && props.queryResult.result
                ? `${props.queryResult.result.rowCount ?? 0} row(s) ${
                    props.queryResult.result.rows && props.queryResult.result.rows.length == 0
                      ? 'affected'
                      : 'returned'
                  }.`
                : null}
            </TypographyHint>
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center h-full w-full gap-3'>
            <TypographyH3>No results yet.</TypographyH3>
            <TypographyHint className='whitespace-nowrap flex flew-row items-center gap-1.5'>
              Click the
              <span className='border-border border-[1px] p-1 rounded-sm'>
                <Play size={12} />
              </span>
              button above to execute your query.
            </TypographyHint>
          </div>
        )}
        {props.queryResult &&
          (!props.queryResult.success || props.queryResult.result?.rows?.length == 0) && (
            <div className='flex flex-col h-full w-full p-2 gap-1'>
              <TypographyP className='!font-mono'>{props.queryResult.message}</TypographyP>
            </div>
          )}
        {props.queryResult &&
          props.queryResult.success &&
          props.queryResult.result &&
          props.queryResult.result.rows &&
          props.queryResult.result.rows.length != 0 && (
            <QueryResultTable data={props.queryResult.result} />
          )}
      </div>
    </ResizablePanel>
  );
};

export default QueryResultPanel;
