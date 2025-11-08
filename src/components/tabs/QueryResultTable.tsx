import React, { useMemo, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

type QueryResultTableProps = {
  data: {
    rows: any[];
    rowCount: number | null;
    fields: any;
  };
};

const QueryResultTable = (props: QueryResultTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<any>[]>(() => {
    let fieldNames: string[] = [];

    if (props.data.fields && Array.isArray(props.data.fields)) {
      fieldNames = props.data.fields.map((field: any) => {
        return field.name || field.fieldName || String(field);
      });
    } else if (props.data.rows && props.data.rows.length > 0) {
      fieldNames = Object.keys(props.data.rows[0]);
    }

    if (fieldNames.length === 0) {
      return [];
    }

    return fieldNames.map((fieldName) => {
      return {
        accessorKey: fieldName,
        header: ({ column }) => {
          return (
            <Button
              variant='icon'
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className='h-8 px-2 -ml-2'
            >
              {fieldName}
              <span className='ml-2'>
                {column.getIsSorted() === 'asc' ? (
                  <ArrowUp className='h-4 w-4' />
                ) : column.getIsSorted() === 'desc' ? (
                  <ArrowDown className='h-4 w-4' />
                ) : (
                  <ArrowUpDown className='h-4 w-4 opacity-50' />
                )}
              </span>
            </Button>
          );
        },
        cell: ({ row }) => {
          const value = row.getValue(fieldName);
          if (value === null || value === undefined) {
            return <span className='text-muted-foreground'>[NULL]</span>;
          }
          if (typeof value === 'object') {
            return <span className='font-mono text-xs'>{JSON.stringify(value)}</span>;
          }
          // Handle boolean values
          if (typeof value === 'boolean') {
            return <span>{value ? 'true' : 'false'}</span>;
          }
          // Handle dates
          if (value instanceof Date) {
            return <span>{value.toISOString()}</span>;
          }
          // Default: convert to string
          return <span>{String(value)}</span>;
        },
        enableSorting: true,
      };
    });
  }, [props.data.fields, props.data.rows]);

  const table = useReactTable({
    data: props.data.rows || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div className='w-full h-full overflow-auto'>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default QueryResultTable;
