import React from 'react';
import { Store } from '@/types/Store';
import { ListView, ColumnDefinition } from '@/components/ui/ListView'

interface TableStoreListProps {
  stores: Store[];
  onItemClick?: (store: Store) => void;
}

const storeColumns: ColumnDefinition<Store>[] = [
  {
    key: 'name',
    header: 'Store Name',
    render: (store) => <span className="font-medium text-gray-800">{store.name}</span>,
  },
  {
    key: 'owner',
    header: 'Owner',
    render: (store) => <span className="text-gray-700">{store.owner.name}</span>,
  },
  {
    key: 'category',
    header: 'Category',
    render: (store) => <span className="text-gray-500 capitalize">{store.category}</span>,
  },
  {
    key: 'address',
    header: 'Location',
    render: (store) => <span className="text-gray-500">{store.address.city}, {store.address.state}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (store) => (
      <span className={`text-xs px-2 py-1 rounded-full capitalize ${
        store.status === 'active' ? 'bg-green-100 text-green-700' :
        store.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
        'bg-red-100 text-red-700'
      }`}>
        {store.status}
      </span>
    ),
  },
];

export const TableStoreList = ({ stores, onItemClick }: TableStoreListProps) => {
  return <ListView items={stores} columns={storeColumns} onItemClick={onItemClick} emptyStateMessage="No stores found." />;
};