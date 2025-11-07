// src/components/stores/StoreCard.tsx
import Image from "next/image";
import {Address, Gallery, Vendor} from "@/redux/vendorSlice";
import { MapPin } from "lucide-react";

interface StoreCardProps {
    store: Vendor;
    onLocationClick?: (lat: number, lng: number) => void;
}

// Placeholder image for missing images
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

// 🟢 Default detailed variant
export const StoreCard = ({store, onLocationClick}: StoreCardProps) => {
    const coverImage = (store?.gallery as Gallery)?.coverImageUrl || PLACEHOLDER_IMAGE;
    const logo = store?.logo || PLACEHOLDER_IMAGE;
    const shopAddress = store?.shopAddress as Address;
    const shopName = store?.shopName || "Store";
    const ownerName = store?.ownerName || "Unknown";
    const dateJoined = store?.dateJoined ? new Date(store.dateJoined).toLocaleDateString() : "N/A";

    const handleLocationClick = () => {
        if (onLocationClick && shopAddress?.latitude && shopAddress?.longitude) {
            onLocationClick(shopAddress.latitude, shopAddress.longitude);
        }
    };

    return (
        <div
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer">
            <div className="relative h-32 w-full mb-3 rounded-lg overflow-hidden bg-gray-100">
                <Image
                    src={coverImage}
                    alt={shopName}
                    fill
                    className="object-cover"
                    onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = PLACEHOLDER_IMAGE;
                    }}
                />
            </div>
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="font-semibold text-gray-800">{shopName}</h3>
                    <p className="text-sm text-gray-500 capitalize">{store?.category || "N/A"}</p>
                </div>
                <span
                    className={`text-xs px-2 py-1 rounded-full capitalize ${
                        store?.status === "active"
                            ? "bg-green-100 text-green-700"
                            : store?.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                    }`}
                >
          {store?.status || "inactive"}
        </span>
            </div>

            <p className="text-sm text-gray-600 mb-3">
                {shopAddress?.street && shopAddress?.city 
                    ? `${shopAddress.street}, ${shopAddress.city}` 
                    : shopAddress?.city || "Address not available"}
            </p>

            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                        <Image
                            src={logo}
                            alt={`${shopName} logo`}
                            fill
                            className="object-contain p-1"
                            onError={(e) => {
                                const img = e.target as HTMLImageElement;
                                img.src = PLACEHOLDER_IMAGE;
                            }}
                        />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-800">{ownerName}</p>
                        <p className="text-xs text-gray-500">
                            Joined: {dateJoined}
                        </p>
                    </div>
                </div>
                {shopAddress?.latitude && shopAddress?.longitude && (
                    <button
                        onClick={handleLocationClick}
                        className="text-gray-400 hover:text-indigo-600 transition-colors shrink-0"
                        title="View on map"
                    >
                        <MapPin size={18} />
                    </button>
                )}
            </div>
        </div>
    );
};

// 🟣 Compact variant with store logo
export const CompactStoreCard = ({store, onLocationClick}: StoreCardProps) => {
    const logo = store?.logo || PLACEHOLDER_IMAGE;
    const shopName = store?.shopName || "Store";
    const shopAddress = store?.shopAddress as Address;
    const city = shopAddress?.city || "Unknown";

    const handleLocationClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onLocationClick && shopAddress?.latitude && shopAddress?.longitude) {
            onLocationClick(shopAddress.latitude, shopAddress.longitude);
        }
    };

    return (
        <div className="flex cursor-pointer items-center gap-4 bg-white p-3 hover:bg-gray-100 transition">
            <div className="relative w-14 h-14 shrink-0 overflow-hidden bg-gray-100 rounded-lg">
                <Image
                    src={logo}
                    alt={shopName}
                    fill
                    className="object-contain p-1"
                    onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = PLACEHOLDER_IMAGE;
                    }}
                />
            </div>

            <div className="flex-1 min-w-0">
                <p className="font-semibold truncate text-sm">{shopName}</p>
                <p className="text-xs text-gray-500 capitalize">{store?.category || "N/A"}</p>
            </div>

            <div className="flex items-center gap-3">
                <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">{city}</p>
                    <p className="text-xs text-gray-500">{store?.status || "inactive"}</p>
                </div>
                {shopAddress?.latitude && shopAddress?.longitude && (
                    <button
                        onClick={handleLocationClick}
                        className="text-gray-400 hover:text-indigo-600 transition-colors shrink-0"
                        title="View on map"
                    >
                        <MapPin size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};
