// src/components/stores/StoreList.tsx
import React from "react";
import { Store } from "@/types/Store";
import { StoreCard, CompactStoreCard } from "./StoreCard";

interface StoreListProps {
  stores: Store[];
}

/* 🟢 Default Grid View (uses detailed StoreCard) */
export const StoreList = ({ stores }: StoreListProps) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
      {stores.map((store) => (
        <StoreCard key={store.id} store={store} />
      ))}
    </div>
  );
};

/* 🟣 Compact List View (uses CompactStoreCard) */
export const CompactStoreList = ({ stores }: StoreListProps) => {
  return (
    <div className="space-y-1">
      {stores.map((store) => (
        <CompactStoreCard key={store.id} store={store} />
      ))}
    </div>
  );
};

// Note: A Table variant for stores can be added here later if needed,
// similar to the TableOrderList component.