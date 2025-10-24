import React from 'react';

export interface ColumnDefinition<T> {
  key: keyof T | 'actions';
  header: string;
  render: (item: T) => React.ReactNode;
}

interface ListViewProps<T> {
  items: T[];
  columns: ColumnDefinition<T>[];
  onItemClick?: (item: T) => void;
  emptyStateMessage?: string;
}

export const ListView = <T extends { id: string | number }>({
  items,
  columns,
  onItemClick,
  emptyStateMessage = "No items found.",
}: ListViewProps<T>) => {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-xl border border-gray-200">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-4 py-3">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item) => (
            <tr
              key={item.id}
              className={`hover:bg-gray-50 ${onItemClick ? 'cursor-pointer' : ''}`}
              onClick={() => onItemClick?.(item)}
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 align-top">
                  {col.render(item)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && (
        <p className="text-center text-gray-500 py-8">{emptyStateMessage}</p>
      )}
    </div>
  );
};