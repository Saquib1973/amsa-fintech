import React from 'react';
import { Skeleton } from './skeleton';

export type CellValue = string | number | boolean | null | undefined;

interface Column<T> {
  header: string;
  accessorKey: keyof T;
  cell?: (value: CellValue, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  emptyMessage = "No data available"
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="w-full border-collapse">
          <div className="bg-surface-main">
            <div className="flex">
              {columns.map((_, index) => (
                <div key={index} className="px-6 py-3 flex-1">
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2 mt-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex">
                {columns.map((_, colIndex) => (
                  <div key={colIndex} className="px-6 py-4 flex-1">
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full text-center py-8">
        <div className="text-gray-500 text-sm">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-surface-main">
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="px-6 py-4 max-w-[100px] truncate whitespace-nowrap text-sm text-gray-900"
                >
                  {column.cell
                    ? column.cell(row[column.accessorKey] as CellValue, row)
                    : String(row[column.accessorKey])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}