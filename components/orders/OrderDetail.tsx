"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Order } from "@/types/order";
import { X } from "lucide-react";

interface OrderDetails {
  order: Order | null;
  onClose: () => void;
}

export const OrderDetail = ({ order, onClose }: OrderDetails) => {
  return (
    <AnimatePresence>
      {order && (
        <motion.div
          key="overlay"
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            key="popup"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-white rounded-xl shadow-2xl w-[90vw] md:w-[500px] h-[90vh]  overflow-y-auto relative"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">
                Order #{order.id}
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                Customer: <span className="font-medium">{order.customerName}</span>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Status:{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    order.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : order.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.status}
                </span>
              </p>

              <h3 className="font-semibold mb-2">Items</h3>
              <ul className="space-y-3 mb-4">
                {order.items.map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover border"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        ₦{item.price.toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-t pt-4">
                <p className="text-right text-lg font-semibold">
                  Total: ₦{order.total.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
