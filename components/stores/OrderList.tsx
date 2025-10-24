// src/components/orders/OrderList.tsx
import React from "react";
import { Order } from "@/types/order";
import { OrderCard, CompactOrderCard } from "../orders/OrderCard";

interface OrderListProps {
  orders: Order[];
  onOrderSelect?: (order: Order) => void;
}

/* 🟢 Default Grid View (uses detailed OrderCard) */
export const OrderList = ({ orders }: OrderListProps) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 cursor-pointer ">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

/* 🟣 Compact List View (uses CompactOrderCard) */
export const CompactOrderList = ({ orders }: OrderListProps) => {
  return (
    <div className="space-y-1 ">
      {orders.map((order) => (
        <CompactOrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

/* 🔵 Table Variant (for dashboard / admin pages) */
export const TableOrderList = ({ orders, onOrderSelect }: OrderListProps) => {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-xl border  border-gray-200">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold ">
          <tr>
            <th className="px-4 py-3">Order ID</th>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Items</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((order) => (
            <tr
              key={order.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onOrderSelect?.(order)}
            >
              <td className="px-4 py-3 font-medium text-gray-800">
                #{order.id}
              </td>
              <td className="px-4 py-3 text-gray-700">{order.customerName}</td>
              <td className="px-4 py-3 text-gray-500">
                {order.items.length} item{order.items.length > 1 && "s"}
              </td>
              <td className="px-4 py-3 font-medium text-gray-800">
                ₦{order.total.toLocaleString()}
              </td>
              <td className="px-4 py-3">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
