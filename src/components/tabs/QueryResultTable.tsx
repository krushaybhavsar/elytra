import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

  const columnNames = useMemo<string[]>(() => {
    if (fields && fields.length > 0) {
      return fields.map((field: any) => field.name);
    }
    if (rows.length > 0) {
      return Object.keys(rows[0]);
    }
    return [];
  }, [fields, rows]);

  const MAX_INITIAL_WIDTH = 400;
  const HEADER_PADDING = 48;
  const CELL_PADDING = 32;

  const measureTextWidth = (text: string, isHeader: boolean = false): number => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return text.length * 8;

    context.font = isHeader
      ? 'bold 12px ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace'
      : '12px ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';

    const metrics = context.measureText(text);
    return metrics.width;
  };

  const calculateMinColumnWidth = useCallback((columnName: string): number => {
    const headerWidth = measureTextWidth(columnName, true);
    return Math.max(80, headerWidth + HEADER_PADDING);
  }, []);
  const calculateColumnWidth = useCallback(
    (columnName: string): number => {
      const minWidth = calculateMinColumnWidth(columnName);
      let maxWidth = minWidth;

      const field = fields?.find((f: any) => f.name === columnName);
      rows.forEach((row) => {
        const value = row[columnName];
        const formattedValue = formatCellValue(value, field);
        const cellWidth = measureTextWidth(formattedValue, false);
        maxWidth = Math.max(maxWidth, cellWidth + CELL_PADDING);
      });

      return Math.max(minWidth, Math.min(maxWidth, MAX_INITIAL_WIDTH));
    },
    [rows, fields, calculateMinColumnWidth],
  );

  const minColumnWidths = useMemo(() => {
    const widths: Record<string, number> = {};
    columnNames.forEach((name) => {
      widths[name] = calculateMinColumnWidth(name);
    });
    return widths;
  }, [columnNames, calculateMinColumnWidth]);

  const initialColumnWidths = useMemo(() => {
    const widths: Record<string, number> = {};
    columnNames.forEach((name) => {
      widths[name] = calculateColumnWidth(name);
    });
    return widths;
  }, [columnNames, calculateColumnWidth]);

  const [columnWidths, setColumnWidths] = useState<Record<string, number>>(initialColumnWidths);

  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const tableRef = useRef<HTMLTableElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent, columnName: string) => {
    e.preventDefault();
    e.stopPropagation();
    setResizingColumn(columnName);
    setStartX(e.clientX);
    setStartWidth(columnWidths[columnName] || minColumnWidths[columnName] || 80);
  };

  const handleDoubleClick = (e: React.MouseEvent, columnName: string) => {
    e.preventDefault();
    e.stopPropagation();
    const optimalWidth = calculateColumnWidth(columnName);
    setColumnWidths((prev) => ({
      ...prev,
      [columnName]: optimalWidth,
    }));
  };

  useEffect(() => {
    if (!resizingColumn) return;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - startX;
      const minWidth = minColumnWidths[resizingColumn] || 80;
      const newWidth = Math.max(minWidth, startWidth + diff);
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
  }, [resizingColumn, startX, startWidth, minColumnWidths]);

  useEffect(() => {
    setColumnWidths((prev) => {
      const updated = { ...prev };
      let hasChanges = false;
      columnNames.forEach((name) => {
        if (!updated[name]) {
          updated[name] = initialColumnWidths[name] || minColumnWidths[name] || 80;
          hasChanges = true;
        }
      });
      return hasChanges ? updated : prev;
    });
  }, [columnNames, initialColumnWidths, minColumnWidths]);

  if (rows.length === 0) {
    return (
      <div className='flex items-center justify-center h-full w-full'>
        <TypographyHint className='text-muted-foreground'>No data to display</TypographyHint>
      </div>
    );
  }

  const [tableHeight, setTableHeight] = useState<number>(0);
  const [handlePositions, setHandlePositions] = useState<Record<string, number>>({});

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

  useEffect(() => {
    if (!tableRef.current || !wrapperRef.current) return;

    const updatePositions = () => {
      const table = tableRef.current;
      const wrapper = wrapperRef.current;
      if (!table || !wrapper) return;

      const headerRow = table.querySelector('thead tr');
      if (!headerRow) return;

      const positions: Record<string, number> = {};
      const cells = Array.from(headerRow.children) as HTMLTableCellElement[];
      const wrapperRect = wrapper.getBoundingClientRect();
      const tableRect = table.getBoundingClientRect();
      const tableOffsetLeft = tableRect.left - wrapperRect.left;

      columnNames.forEach((columnName, index) => {
        if (index < columnNames.length - 1 && cells[index]) {
          const cell = cells[index];
          const cellRightEdge = tableOffsetLeft + cell.offsetLeft + cell.offsetWidth;
          positions[columnName] = cellRightEdge;
        }
      });

      setHandlePositions(positions);
    };

    const timeoutId = setTimeout(() => {
      updatePositions();
    }, 0);

    const resizeObserver = new ResizeObserver(() => {
      updatePositions();
    });

    if (tableRef.current) {
      resizeObserver.observe(tableRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [columnNames, columnWidths, minColumnWidths, rows, tableHeight]);

  return (
    <div
      ref={containerRef}
      className='w-full h-full max-h-[300px] max-w-full overflow-auto relative'
    >
      <div
        ref={wrapperRef}
        className='relative inline-block rounded-md overflow-hidden border border-border'
        style={{ minHeight: tableHeight || 'auto' }}
      >
        <Table
          ref={tableRef}
          style={{
            tableLayout: 'fixed',
            width: Object.values(columnWidths).reduce((sum, width) => sum + width, 0) + 'px',
          }}
        >
          <TableHeader>
            <TableRow>
              {columnNames.map((columnName) => {
                const minWidth = minColumnWidths[columnName] || 80;
                return (
                  <TableHead
                    key={columnName}
                    className='!bg-muted/50 !hover:bg-muted/50'
                    style={{
                      width: `${columnWidths[columnName] || minWidth}px`,
                      minWidth: `${minWidth}px`,
                      maxWidth: `${columnWidths[columnName] || minWidth}px`,
                    }}
                  >
                    <div className='pr-4 overflow-hidden whitespace-nowrap'>{columnName}</div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columnNames.map((columnName) => {
                  const field = fields?.find((f: any) => f.name === columnName);
                  const value = row[columnName];
                  const minWidth = minColumnWidths[columnName] || 80;
                  return (
                    <TableCell
                      key={columnName}
                      style={{
                        width: `${columnWidths[columnName] || minWidth}px`,
                        minWidth: `${minWidth}px`,
                        maxWidth: `${columnWidths[columnName] || minWidth}px`,
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                      }}
                      title={formatCellValue(value, field)}
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
          const measuredPosition = handlePositions[columnName];
          const position =
            measuredPosition ??
            (() => {
              let pos = 0;
              for (let i = 0; i <= index; i++) {
                const colName = columnNames[i];
                pos += columnWidths[colName] || minColumnWidths[colName] || 80;
              }
              return pos;
            })();
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
              onDoubleClick={(e) => handleDoubleClick(e, columnName)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default QueryResultTable;
