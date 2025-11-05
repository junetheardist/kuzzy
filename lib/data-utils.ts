import { stores } from '@/data/stores';
import { customers } from '@/data/customers';
import { orders } from '@/data/orders';
import { products } from '@/data/products';
import { deliveryAgents } from '@/data/deliveryAgents';

/**
 * Gets the total number of stores within a given set of locations (states, LGAs, etc.).
 * A store's location is determined by its `address.state`.
 */
export const getStoreCount = (locations: string[]): number => {
  return stores.filter(store => locations.includes(store.address?.state || '')).length;
};

/**
 * Gets the total number of customers within a given set of locations.
 * A customer's location is determined by their `address.state`.
 */
export const getCustomerCount = (locations: string[]): number => {
  return customers.filter(customer => locations.includes(customer.address.state)).length;
};

/**
 * Gets the total number of delivery agents within a given set of locations.
 * An agent's location is determined by their `address.state`.
 */
export const getDeliveryAgentCount = (locations: string[]): number => {
  return deliveryAgents.filter(agent => locations.includes(agent.address.state)).length;
};

/**
 * Gets the total number of orders from stores within a given set of locations.
 * An order's location is determined by the location of the store it belongs to.
 */
export const getOrderCount = (locations: string[]): number => {
  const storeIdsInLocation = stores
    .filter(store => locations.includes(store.address?.state || ''))
    .map(store => store.id);
  return orders.filter(order => storeIdsInLocation.includes(order.storeId)).length;
};

/**
 * Gets the total stock of all products from stores within a given set of locations.
 * This function assumes all products are available in all stores for simplicity.
 * A more complex implementation would link products to specific store inventories.
 */
export const getProductCount = (locations: string[]): number => {
  const storeCount = getStoreCount(locations);
  // For mock purposes, let's assume each store has a fraction of the total product stock.
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  // This is a simplified calculation. A real-world scenario would be more complex.
  return storeCount > 0 ? Math.round(totalStock / stores.length * storeCount) : 0;
};