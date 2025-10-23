// src/types/order.ts
export interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  date: string;
  status: "pending" | "completed" | "cancelled";
  items: OrderItem[];
  total: number;
}
