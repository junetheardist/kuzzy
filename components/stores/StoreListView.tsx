import React from 'react';
import {Store} from '@/types/Store';
import {ColumnDefinition, ListView} from '@/components/ui/ListView'
import {Vendor, Address} from "@/redux/vendorSlice";

interface TableStoreListProps {
    stores: Store[] | Vendor[];
}

// Helper function to safely access properties from Store or Vendor
const isVendor = (store: unknown): store is Vendor => {
    return typeof store === 'object' && store !== null && 'ownerName' in store;
};

const storeColumns: ColumnDefinition<any>[] = [
    {
        key: 'name',
        header: 'Store Name',
        render: (store) => {
            const name = isVendor(store) ? store.shopName : (store as Store).name;
            return <span className="font-medium text-gray-800">{name}</span>;
        },
    },
    {
        key: 'owner',
        header: 'Owner',
        render: (store) => {
            const ownerName = isVendor(store) ? store.ownerName : (store as Store).owner?.name;
            return <span className="text-gray-700">{ownerName || "N/A"}</span>;
        },
    },
    {
        key: 'category',
        header: 'Category',
        render: (store) => <span className="text-gray-500 capitalize">{store.category}</span>,
    },
    {
        key: 'address',
        header: 'Location',
        render: (store) => {
            let city = 'N/A';
            let state = 'N/A';
            
            if (isVendor(store)) {
                const addr = typeof store.shopAddress === 'object' ? store.shopAddress : null;
                city = addr?.city || 'N/A';
                state = addr?.state || 'N/A';
            } else {
                city = (store as Store).address?.city || 'N/A';
                state = (store as Store).address?.state || 'N/A';
            }
            
            return <span className="text-gray-500">{city}, {state}</span>;
        },
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
