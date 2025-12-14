import React from 'react';
import ResizablePanel from '../ui/resizable-panel';
import { Badge } from '../ui/badge';
import { TypographyH3, TypographyHint, TypographyP } from '../ui/typography';
import { Play } from 'lucide-react';
import QueryResultTable from './QueryResultTable';
import { trimStatement } from '@/utils/sql-utils';
import { StatementData } from './EditorTabView';

type QueryResultPanelProps = {
  panelHeight: number;
  onPanelHeightChange: React.Dispatch<React.SetStateAction<number>>;
  statementData: StatementData[];
};

const QueryResultPanel = (props: QueryResultPanelProps) => {
  const hasResults = props.statementData.length > 0;

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
        {!hasResults && (
          // <div className='flex flex-row gap-2 w-full p-2 border-border border-b-[1px] items-center flex-shrink-0'>
          //   <Badge
          //     variant='secondary'
          //     className={
          //       '!font-mono ' +
          //       (props.loading
          //         ? 'bg-warning/10 text-warning'
          //         : props.queryResults.every((r) => r.success)
          //           ? 'bg-success/10 text-success'
          //           : 'bg-destructive/10 text-destructive')
          //     }
          //   >
          //     {props.loading
          //       ? 'Executing'
          //       : props.queryResults.every((r) => r.success)
          //         ? 'Success'
          //         : 'Some Failed'}
          //   </Badge>
          //   {hasResults && (
          //     <Badge variant='secondary' className='!font-mono'>
          //       {props.queryResults.length} statement{props.queryResults.length !== 1 ? 's' : ''}
          //     </Badge>
          //   )}
          //   {hasResults && props.queryResults.length > 0 && (
          //     <TypographyHint className='!font-mono !text-[12px]'>
          //       {props.queryResults
          //         .filter((r) => r.success && r.result)
          //         .reduce((sum, r) => sum + (r.result?.rowCount ?? 0), 0)}{' '}
          //       total row(s)
          //     </TypographyHint>
          //   )}
          // </div>

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
        {hasResults && (
          <div className='flex-1 overflow-y-auto p-2 space-y-3'>
            {props.statementData.map((data, index) => (
              <div
                key={index}
                className='border border-border rounded-md overflow-hidden bg-background'
              >
                {/* Result Header */}

                <div className='flex flex-row gap-2 w-full p-2 border-border border-b-[1px] items-center bg-muted/30'>
                  <div className='flex flex-1 flex-row justify-between items-center'>
                    <div className='flex flex-row items-center gap-2'>
                      <Badge
                        variant='secondary'
                        className={
                          '!font-mono ' +
                          (data.loading
                            ? 'bg-warning/10 text-warning hover:bg-warning/10'
                            : data.result && data.result.success
                              ? 'bg-success/10 text-success hover:bg-success/10'
                              : 'bg-destructive/10 text-destructive hover:bg-destructive/10')
                        }
                      >
                        {data.loading
                          ? 'Executing'
                          : data.result && data.result.success
                            ? 'Success'
                            : 'Failed'}
                      </Badge>
                      {data.result && data.result.result && (
                        <Badge variant='secondary' className='!font-mono'>
                          {`${data.result.result?.executionTimeMs.toFixed(2)} ms`}
                        </Badge>
                      )}
                      <TypographyHint className='!font-mono !text-[12px]'>
                        {`Statement ${index + 1}: `}
                        <span className='rounded-sm max-w-[350px] whitespace-nowrap inline-block align-middle'>
                          "{trimStatement(data.statement, 50, true)}"
                        </span>
                      </TypographyHint>
                    </div>
                    <div className='flex flex-row items-center gap-2'>
                      <TypographyHint className='!font-mono !text-[12px]'>
                        {data.result && data.result.result
                          ? `${data.result.result.rowCount ?? 0} row(s) ${
                              data.result.result.rows && data.result.result.rows.length === 0
                                ? 'affected'
                                : 'returned'
                            }`
                          : ''}
                      </TypographyHint>
                    </div>
                  </div>
                </div>

                {/* Result Content */}
                <div className='p-2'>
                  {data.result && !data.result.success && (
                    <div className='flex flex-col w-full gap-1 py-2 px-1'>
                      <TypographyP className='!text-[14px] !font-mono text-muted-foreground'>
                        {data.result.message}
                      </TypographyP>
                    </div>
                  )}
                  {data.result &&
                    data.result.success &&
                    data.result.result &&
                    data.result.result.rows &&
                    data.result.result.rows.length > 0 && (
                      <QueryResultTable data={data.result.result} />
                    )}
                  {data.result &&
                    data.result.success &&
                    data.result.result &&
                    (!data.result.result.rows || data.result.result.rows.length === 0) && (
                      <div className='flex flex-col w-full gap-1 py-2'>
                        <TypographyP className='!text-[14px] !font-mono text-muted-foreground'>
                          {data.result.message}
                        </TypographyP>
                      </div>
                    )}
                  {data.loading && (
                    <div className='flex flex-col w-full gap-1 py-2'>
                      <TypographyHint className='!font-mono'>Executing...</TypographyHint>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ResizablePanel>
  );
};

export default QueryResultPanel;
