// src/components/orders/OrderCard.tsx
import Image from "next/image";
import { Order } from "@/types/order";

interface OrderCardProps {
  order: Order;
  onClick?: (order: Order) => void; // 🆕 added for modal trigger
}

// 🟢 Default detailed variant
export const OrderCard = ({ order, onClick }: OrderCardProps) => {
  return (
    <div
      onClick={() => onClick?.(order)}
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-800">Order #{order.id}</h3>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            order.status === "completed"
              ? "bg-green-100 text-green-700"
              : order.status === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {order.status}
        </span>
      </div>

      <p className="text-sm text-gray-500 mb-2">{order.customerName}</p>

      {/* Items List */}
      <div className="space-y-1">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center text-sm text-gray-600"
          >
            <span className="truncate">{item.name}</span>
            <span className="text-gray-500">x{item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="mt-3 text-right">
        <span className="text-sm font-medium text-gray-800">
          ₦{order.total.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

// 🟣 Compact variant with product image
export const CompactOrderCard = ({ order, onClick }: OrderCardProps) => {
  const firstItem = order.items[0];

  return (
    <div
      onClick={() => onClick?.(order)}
      className="flex cursor-pointer items-center gap-4 bg-white p-3 hover:bg-gray-100 transition rounded-lg"
    >
      {/* Product thumbnail */}
      <div className="relative w-14 h-14 shrink-0 overflow-hidden bg-gray-50 rounded-lg">
        <Image
          src={firstItem.image}
          alt={firstItem.name}
          fill
          className="object-cover text-[9px] text-center"
        />
      </div>

      {/* Order info */}
      <div className="flex-1 min-w-0">
        <span className="flex gap-2 items-center">
          <p className="font-medium text-sm text-gray-400 truncate">
            {order.id}
          </p>
          <p className="text-xs text-amber-700 truncate">
            {order.customerName}
          </p>
        </span>
        <span className="flex gap-2">
          <p className="font-semibold truncate text-sm">{firstItem.name}</p>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full ${
              order.status === "completed"
                ? "bg-green-100 text-green-700"
                : order.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {order.status}
          </span>
        </span>
        <span className="block text-sm font-medium text-gray-800">
          ₦{order.total.toLocaleString()}
        </span>
      </div>

      {/* Total and count */}
      <div className="text-right flex items-end gap-2">
        <p className="text-[0.7rem] text-gray-500 font-bold truncate p-0.5 rounded-full bg-neutral-100 w-fit px-1">
          +{order.items.length}
        </p>
      </div>
    </div>
  );
};
