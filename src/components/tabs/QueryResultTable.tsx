import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TypographyHint } from '@/components/ui/typography';

type QueryResultTableProps = {
  data: {
    rows: any[];
    rowCount: number | null;
    fields: any;
  };
};

const formatCellValue = (value: any, field?: any): string => {
  if (value === null || value === undefined) {
    return 'NULL';
  }
  if (field?.dataTypeID === 1114 || field?.dataTypeID === 1184) {
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleString();
      }
    } catch {}
  }
  if (
    typeof value === 'number' ||
    (field && [23, 20, 21, 700, 701, 1700].includes(field.dataTypeID))
  ) {
    return String(value);
  }
  if (typeof value === 'boolean' || field?.dataTypeID === 16) {
    return value ? 'true' : 'false';
  }
  return String(value);
};

const QueryResultTable = (props: QueryResultTableProps) => {
  const { rows, fields } = props.data;

  const columnNames = React.useMemo<string[]>(() => {
    if (fields && fields.length > 0) {
      return fields.map((field: any) => field.name);
    }
    if (rows.length > 0) {
      return Object.keys(rows[0]);
    }
    return [];
  }, [fields, rows]);

  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(() => {
    const initialWidths: Record<string, number> = {};
    columnNames.forEach((name) => {
      const baseWidth = Math.max(120, name.length * 10 + 40);
      initialWidths[name] = baseWidth;
    });
    return initialWidths;
  });

  const [resizingColumn, setResizingColumn] = React.useState<string | null>(null);
  const [startX, setStartX] = React.useState(0);
  const [startWidth, setStartWidth] = React.useState(0);
  const tableRef = React.useRef<HTMLTableElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const MIN_COLUMN_WIDTH = 80;

  const handleMouseDown = (e: React.MouseEvent, columnName: string) => {
    e.preventDefault();
    e.stopPropagation();
    setResizingColumn(columnName);
    setStartX(e.clientX);
    setStartWidth(columnWidths[columnName] || MIN_COLUMN_WIDTH);
  };

  useEffect(() => {
    if (!resizingColumn) return;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startX;
      const newWidth = Math.max(MIN_COLUMN_WIDTH, startWidth + diff);
      setColumnWidths((prev) => ({
        ...prev,
        [resizingColumn]: newWidth,
      }));
    };

    const handleMouseUp = () => {
      setResizingColumn(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [resizingColumn, startX, startWidth]);

  useEffect(() => {
    setColumnWidths((prev) => {
      const updated = { ...prev };
      columnNames.forEach((name) => {
        if (!updated[name]) {
          updated[name] = Math.max(120, name.length * 10 + 40);
        }
      });
      return updated;
    });
  }, [columnNames]);

  if (rows.length === 0) {
    return (
      <div className='flex items-center justify-center h-full w-full'>
        <TypographyHint className='text-muted-foreground'>No data to display</TypographyHint>
      </div>
    );
  }

  const [tableHeight, setTableHeight] = useState<number>(0);

  useEffect(() => {
    if (tableRef.current) {
      const updateHeight = () => {
        if (tableRef.current) {
          setTableHeight(tableRef.current.offsetHeight);
        }
      };
      updateHeight();
      const resizeObserver = new ResizeObserver(updateHeight);
      resizeObserver.observe(tableRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [rows, columnWidths]);

  return (
    <div
      ref={containerRef}
      className='w-full h-full overflow-auto border border-border rounded-md relative'
    >
      <div className='relative inline-block' style={{ minHeight: tableHeight || 'auto' }}>
        <Table ref={tableRef}>
          <TableHeader>
            <TableRow>
              {columnNames.map((columnName) => (
                <TableHead
                  key={columnName}
                  className='!bg-muted/50 !hover:bg-muted/50'
                  style={{
                    width: `${columnWidths[columnName] || MIN_COLUMN_WIDTH}px`,
                    minWidth: MIN_COLUMN_WIDTH,
                  }}
                >
                  <div className='pr-4 overflow-hidden text-ellipsis whitespace-nowrap'>
                    {columnName}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columnNames.map((columnName) => {
                  const field = fields?.find((f: any) => f.name === columnName);
                  const value = row[columnName];
                  return (
                    <TableCell
                      key={columnName}
                      style={{
                        width: `${columnWidths[columnName] || MIN_COLUMN_WIDTH}px`,
                        minWidth: MIN_COLUMN_WIDTH,
                      }}
                      title={formatCellValue(value, field)} // Show full text on hover
                    >
                      {formatCellValue(value, field)}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {columnNames.map((columnName, index) => {
          if (index >= columnNames.length - 1) return null;
          let position = 0;
          for (let i = 0; i <= index; i++) {
            position += columnWidths[columnNames[i]] || MIN_COLUMN_WIDTH;
          }
          return (
            <div
              key={`resize-${columnName}`}
              className='absolute top-0 w-1 cursor-col-resize hover:w-2 z-30 transition-all'
              style={{
                left: `${position}px`,
                height: tableHeight > 0 ? `${tableHeight}px` : '100%',
                transform: 'translateX(-50%)',
                pointerEvents: 'auto',
              }}
              onMouseDown={(e) => handleMouseDown(e, columnName)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default QueryResultTable;
