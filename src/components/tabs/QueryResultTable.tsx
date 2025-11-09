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

  const MIN_COLUMN_WIDTH = 80;
  const MAX_INITIAL_WIDTH = 400;
  const PADDING = 16; // p-2 = 8px on each side

  // Helper function to measure text width
  const measureTextWidth = (text: string, isHeader: boolean = false): number => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return text.length * 6; // Fallback estimation

    // Match the font styles from the table
    context.font = isHeader
      ? 'bold 12px ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace'
      : '12px ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';

    const metrics = context.measureText(text);
    return metrics.width;
  };

  // Calculate optimal width for a column
  const calculateColumnWidth = useCallback(
    (columnName: string): number => {
      let maxWidth = 0;

      // Measure header text
      const headerWidth = measureTextWidth(columnName, true);
      maxWidth = Math.max(maxWidth, headerWidth);

      // Measure all cell values in this column
      const field = fields?.find((f: any) => f.name === columnName);
      rows.forEach((row) => {
        const value = row[columnName];
        const formattedValue = formatCellValue(value, field);
        const cellWidth = measureTextWidth(formattedValue, false);
        maxWidth = Math.max(maxWidth, cellWidth);
      });

      // Add padding and ensure minimum width
      const totalWidth = maxWidth + PADDING;
      return Math.max(MIN_COLUMN_WIDTH, Math.min(totalWidth, MAX_INITIAL_WIDTH));
    },
    [rows, fields],
  );

  // Calculate initial column widths based on content
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
    setStartWidth(columnWidths[columnName] || MIN_COLUMN_WIDTH);
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

  // Update widths when columns change (add new columns, but preserve manual resizes)
  useEffect(() => {
    setColumnWidths((prev) => {
      const updated = { ...prev };
      let hasChanges = false;
      columnNames.forEach((name) => {
        if (!updated[name]) {
          updated[name] = initialColumnWidths[name] || MIN_COLUMN_WIDTH;
          hasChanges = true;
        }
      });
      return hasChanges ? updated : prev;
    });
  }, [columnNames, initialColumnWidths]);

  if (rows.length === 0) {
    return (
      <div className='flex items-center justify-center h-full w-full'>
        <TypographyHint className='text-muted-foreground'>No data to display</TypographyHint>
      </div>
    );
  }

  const [tableHeight, setTableHeight] = useState<number>(0);
  const [handlePositions, setHandlePositions] = useState<Record<string, number>>({});

  // Measure table height
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

  // Measure actual column border positions for accurate handle alignment
  useEffect(() => {
    if (!tableRef.current || !wrapperRef.current) return;

    const updatePositions = () => {
      // tableRef points to the actual table element (ref is forwarded to table)
      const table = tableRef.current;
      const wrapper = wrapperRef.current;
      if (!table || !wrapper) return;

      const headerRow = table.querySelector('thead tr');
      if (!headerRow) return;

      const positions: Record<string, number> = {};
      const cells = Array.from(headerRow.children) as HTMLTableCellElement[];

      // Calculate positions relative to the wrapper div
      const wrapperRect = wrapper.getBoundingClientRect();
      const tableRect = table.getBoundingClientRect();
      const tableOffsetLeft = tableRect.left - wrapperRect.left;

      columnNames.forEach((columnName, index) => {
        if (index < columnNames.length - 1 && cells[index]) {
          const cell = cells[index];
          // Position at the right edge of the cell (where the border is)
          // offsetLeft is relative to the table, so add table's offset to wrapper
          const cellRightEdge = tableOffsetLeft + cell.offsetLeft + cell.offsetWidth;
          positions[columnName] = cellRightEdge;
        }
      });

      setHandlePositions(positions);
    };

    // Use requestAnimationFrame to ensure DOM is fully rendered
    const timeoutId = setTimeout(() => {
      updatePositions();
    }, 0);

    // Also update on resize and when table changes
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
  }, [columnNames, columnWidths, rows, tableHeight]);

  return (
    <div
      ref={containerRef}
      className='w-full h-full overflow-auto border border-border rounded-md relative'
    >
      <div
        ref={wrapperRef}
        className='relative inline-block'
        style={{ minHeight: tableHeight || 'auto' }}
      >
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
        {/* Single resize handle per column, spanning full table height */}
        {columnNames.map((columnName, index) => {
          if (index >= columnNames.length - 1) return null;

          // Use measured position if available, otherwise fall back to calculated
          const measuredPosition = handlePositions[columnName];
          const position =
            measuredPosition ??
            (() => {
              let pos = 0;
              for (let i = 0; i <= index; i++) {
                pos += columnWidths[columnNames[i]] || MIN_COLUMN_WIDTH;
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
