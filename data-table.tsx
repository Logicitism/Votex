import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ReactNode, useState } from "react";

interface Column<T> {
  header: string;
  accessorKey: keyof T | ((row: T) => any);
  cell?: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  emptyState?: ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  onRowClick,
  isLoading = false,
  emptyState
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;
    
    let aValue = typeof columns.find(col => col.accessorKey === sortColumn)?.accessorKey === 'function'
      ? (columns.find(col => col.accessorKey === sortColumn)?.accessorKey as (row: T) => any)(a)
      : a[sortColumn];
    
    let bValue = typeof columns.find(col => col.accessorKey === sortColumn)?.accessorKey === 'function'
      ? (columns.find(col => col.accessorKey === sortColumn)?.accessorKey as (row: T) => any)(b)
      : b[sortColumn];
    
    if (aValue === bValue) return 0;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return sortDirection === 'asc'
      ? (aValue < bValue ? -1 : 1)
      : (bValue < aValue ? -1 : 1);
  });

  if (isLoading) {
    return (
      <div className="w-full py-10 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (data.length === 0 && emptyState) {
    return <div className="w-full py-10">{emptyState}</div>;
  }

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead 
                key={index}
                onClick={() => {
                  if (typeof column.accessorKey === 'string') {
                    handleSort(column.accessorKey as keyof T);
                  }
                }}
                className={typeof column.accessorKey === 'string' ? 'cursor-pointer' : ''}
              >
                {column.header}
                {sortColumn === column.accessorKey && (
                  <span className="ml-2">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((row, rowIndex) => (
            <TableRow 
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              className={onRowClick ? 'cursor-pointer hover:bg-muted' : ''}
            >
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex}>
                  {column.cell 
                    ? column.cell(row)
                    : typeof column.accessorKey === 'function'
                      ? column.accessorKey(row)
                      : row[column.accessorKey] as ReactNode}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
