import React from 'react';
import {Store} from '@/types/Store';
import {ColumnDefinition, ListView} from '@/components/ui/ListView'
import {Vendor} from "@/redux/vendorSlice";

interface TableStoreListProps {
    stores: Store[] | Vendor[];
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

export const TableStoreList = ({stores}: TableStoreListProps) => {
    return <ListView items={stores as Store[]} columns={storeColumns} emptyStateMessage="No stores found."/>;
};
