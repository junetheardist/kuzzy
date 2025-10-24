import { RegionListItem } from "@/types/region";
import { Users, Store, Package, ShoppingCart, ArrowRight } from "lucide-react";
import React from "react";

type TotalType = "products" | "stores" | "customers" | "orders";

interface RegionCardProps {
  region: RegionListItem;
  displayTotalFor: TotalType;
  onSelect: (region: RegionListItem) => void;
  onViewStores: (region: RegionListItem, type: TotalType) => void;
}

const totalInfoMap = {
  products: {
    label: "Products",
    icon: Package,
    key: "productCount",
  },
  stores: {
    label: "Stores",
    icon: Store,
    key: "storeCount",
  },
  customers: {
    label: "Customers",
    icon: Users,
    key: "customerCount",
  },
  orders: {
    label: "Orders",
    icon: ShoppingCart,
    key: "orderCount",
  },
};

export const RegionCard = ({ region, displayTotalFor, onSelect, onViewStores }: RegionCardProps) => {
  const info = totalInfoMap[displayTotalFor];
  const Icon = info.icon;
  const count = region[info.key as keyof RegionListItem] as number;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-lg text-gray-800 truncate">
          {region.name}
        </h3>
        <button onClick={() => onSelect(region)} className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
      <div>
        <p className="text-sm text-gray-500 h-10 overflow-hidden">
          {region.sublocationNames.slice(0, 3).join(", ")}
          {region.sublocationNames.length > 3 ? "..." : ""}
        </p>
      </div>

      <div onClick={() => onViewStores(region, displayTotalFor)} className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between cursor-pointer rounded-b-lg -m-4 p-4 hover:bg-gray-50">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-600">
            {info.label}
          </span>
        </div>
        <span className="text-lg font-bold text-gray-800">
          {count.toLocaleString()}
        </span>
      </div>
    </div>
  );
};