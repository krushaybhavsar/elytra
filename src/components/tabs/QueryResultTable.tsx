import React from 'react';
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

// Helper function to format cell values based on data type
const formatCellValue = (value: any, field?: any): string => {
  if (value === null || value === undefined) {
    return 'NULL';
  }

  // Handle date/time types (PostgreSQL timestamp types: 1114, 1184)
  if (field?.dataTypeID === 1114 || field?.dataTypeID === 1184) {
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleString();
      }
    } catch {
      // Fall through to default formatting
    }
  }

  // Handle numeric types (PostgreSQL integer: 23, bigint: 20, numeric: 1700, etc.)
  if (
    typeof value === 'number' ||
    (field && [23, 20, 21, 700, 701, 1700].includes(field.dataTypeID))
  ) {
    return String(value);
  }

  // Handle boolean types (PostgreSQL boolean: 16)
  if (typeof value === 'boolean' || field?.dataTypeID === 16) {
    return value ? 'true' : 'false';
  }

  // Default: convert to string
  return String(value);
};

const QueryResultTable = (props: QueryResultTableProps) => {
  const { rows, fields } = props.data;

  // Get column names from fields or from first row keys
  const columnNames = React.useMemo<string[]>(() => {
    if (fields && fields.length > 0) {
      return fields.map((field: any) => field.name);
    }
    if (rows.length > 0) {
      return Object.keys(rows[0]);
    }
    return [];
  }, [fields, rows]);

  if (rows.length === 0) {
    return (
      <div className='flex items-center justify-center h-full w-full'>
        <TypographyHint className='text-muted-foreground'>No data to display</TypographyHint>
      </div>
    );
  }

  return (
    <div className='w-full h-full overflow-auto border border-border rounded-md'>
      <Table>
        <TableHeader>
          <TableRow>
            {columnNames.map((columnName) => (
              <TableHead key={columnName} className='bg-muted/30'>
                {columnName}
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
                return <TableCell key={columnName}>{formatCellValue(value, field)}</TableCell>;
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default QueryResultTable;
