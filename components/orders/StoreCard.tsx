// src/components/stores/StoreCard.tsx
import Image from "next/image";
import { Store } from "@/types/Store";

interface StoreCardProps {
  store: Store;
}

// 🟢 Default detailed variant
export const StoreCard = ({ store }: StoreCardProps) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer">
      <div className="relative h-32 w-full mb-3 rounded-lg overflow-hidden">
        <Image
          src={store.gallery.coverImageUrl}
          alt={store.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-gray-800">{store.name}</h3>
          <p className="text-sm text-gray-500 capitalize">{store.category}</p>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full capitalize ${
            store.status === "active"
              ? "bg-green-100 text-green-700"
              : store.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {store.status}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-3">
        {store.address.street}, {store.address.city}
      </p>

      <div className="flex items-center gap-2">
        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100">
          <Image
            src={store.logo}
            alt={`${store.name} logo`}
            fill
            className="object-contain p-1"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-800">{store.owner.name}</p>
          <p className="text-xs text-gray-500">
            Joined: {new Date(store.dateJoined).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

// 🟣 Compact variant with store logo
export const CompactStoreCard = ({ store }: StoreCardProps) => {
  return (
    <div className="flex cursor-pointer items-center gap-4 bg-white p-3 hover:bg-gray-100 transition">
      <div className="relative w-14 h-14 shrink-0 overflow-hidden bg-gray-100 rounded-lg">
        <Image
          src={store.logo}
          alt={store.name}
          fill
          className="object-contain p-1 text-[9px] text-center"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate text-sm">{store.name}</p>
        <p className="text-xs text-gray-500 capitalize">{store.category}</p>
      </div>

      <div className="text-right">
        <p className="text-sm font-medium text-gray-800">{store.address.city}</p>
        <p className="text-xs text-gray-500">{store.status}</p>
      </div>
    </div>
  );
};