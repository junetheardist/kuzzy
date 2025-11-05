// src/components/stores/StoreList.tsx
import React, { useState } from "react";
import {CompactStoreCard, StoreCard} from "./StoreCard";
import {Vendor} from "@/redux/vendorSlice";
import { StoreDetailsModal } from "./StoreDetailsModal";
import { EditStoreModal } from "./EditStoreModal";

interface StoreListProps {
    stores: Vendor[];
}

/* 🟢 Default Grid View (uses detailed StoreCard) */
export const StoreList = ({stores}: StoreListProps) => {
    const [selectedStore, setSelectedStore] = useState<Vendor | null>(null);
    const [editingStore, setEditingStore] = useState<Vendor | null>(null);
    
    return (
        <>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
                {stores.map((store) => (
                    <div key={store._id} onClick={() => setSelectedStore(store)}>
                        <StoreCard store={store}/>
                    </div>
                ))}
            </div>
            <StoreDetailsModal 
                store={selectedStore} 
                isOpen={selectedStore !== null}
                onClose={() => setSelectedStore(null)}
                onEdit={(store) => {
                    setEditingStore(store);
                    setSelectedStore(null);
                }}
            />
            <EditStoreModal
                store={editingStore}
                isOpen={editingStore !== null}
                onClose={() => setEditingStore(null)}
            />
        </>
    );
};

/* 🟣 Compact List View (uses CompactStoreCard) */
export const CompactStoreList = ({stores}: StoreListProps) => {
    const [selectedStore, setSelectedStore] = useState<Vendor | null>(null);
    const [editingStore, setEditingStore] = useState<Vendor | null>(null);
    
    return (
        <>
            <div className="space-y-1">
                {stores.map((store) => (
                    <div key={store._id} onClick={() => setSelectedStore(store)}>
                        <CompactStoreCard store={store}/>
                    </div>
                ))}
            </div>
            <StoreDetailsModal 
                store={selectedStore} 
                isOpen={selectedStore !== null}
                onClose={() => setSelectedStore(null)}
                onEdit={(store) => {
                    setEditingStore(store);
                    setSelectedStore(null);
                }}
            />
            <EditStoreModal
                store={editingStore}
                isOpen={editingStore !== null}
                onClose={() => setEditingStore(null)}
            />
        </>
    );
};

// Note: A Table variant for stores can be added here later if needed,
// similar to the TableOrderList component.