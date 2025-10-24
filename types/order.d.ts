// src/types/order.ts
export interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  category: "electronics" | "groceries" | "clothes" | "body-care";
  description?: string;
}

export interface Order {
  id: string;
  storeId: string; // Corresponds to a Store ID
  customerName: string;
  date: string;
  status: "pending" | "completed" | "cancelled";
  items: OrderItem[];
  total: number;
}
