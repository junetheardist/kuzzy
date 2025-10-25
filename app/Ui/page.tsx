'use client';
import React, { useState, useMemo } from 'react';
import { CompactOrderList, TableOrderList as PreviewTableOrderList } from "@/components/orders/orderList";
import { CompactStoreList } from "@/components/stores/StoreList";
import { RegionFilterView } from '@/components/Regions/RegionFilterView';
import { regions, states } from '@/data/regions';
import UserMap from '@/components/dashboard/UserMap';
import { orders } from '@/data/orders';
import { stores,  } from '@/data/stores';
import { OrderDetail } from '@/components/orders/OrderDetail';
import { Order } from '@/types/order';
import { Product } from '@/types/product';
import { User as Customer } from '@/types/user';
import { Modal } from '@/components/ui/Modal';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import { TableStoreList } from '@/components/stores/StoreListView';
import { products } from '@/data/products';
import { customers } from '@/data/customers';
import { StoreDetail } from '@/components/stores/StoreDetail';
import { ProductDetail } from '@/components/products/ProductDetail';
import { CustomerDetail } from '@/components/customers/CustomerDetail';
import { TableProductList } from '@/components/products/TableProductList';
import { TableCustomerList } from '@/components/customers/TableCustomerList';
import { AddStoreForm } from '@/components/Forms/stores/AddStoreForm';
import { Button } from '@/components/ui/Button';


export default function UiComponents() {
    const [expanded, setExpanded] = useState(false); // This state is no longer used for the modal, but keeping it for now.
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [activeTab, setActiveTab] = useState('orders');
    const [preview, setPreview] = useState<{ type: string; data: any } | null>(null);
    const [selectedStore, setSelectedStore] = useState<typeof stores[number]| null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isAddStoreModalOpen, setAddStoreModalOpen] = useState(false);

    const handleShowPreview = (type: string, data: any) => {
        setPreview({ type, data });
    };

    const previewContent = useMemo(() => {
        if (!preview) return null;

        const { type, data } = preview;
        const regionName = data?.name || '';

        // Determine the list of states to filter by.
        const isTopLevelRegion = regions.some(r => r.id === data.id);
        const statesToFilter = isTopLevelRegion ? data.sublocationNames : [data.name];

        switch (type) {
            case 'stores':
                const filteredStores = stores.filter(store => statesToFilter.includes(store.address.state));
                return { title: `Stores in ${regionName}`, content: <TableStoreList stores={filteredStores} onItemClick={setSelectedStore} /> };
            case 'products':
                // Products are not tied to a region in the current data model, so we show all.
                return { title: `Products in ${regionName}`, content: <TableProductList products={products} onItemClick={setSelectedProduct} /> };
            case 'customers':
                const filteredCustomers = customers.filter(customer => statesToFilter.includes(customer.address.state));
                return { title: `Customers in ${regionName}`, content: <TableCustomerList customers={filteredCustomers} onItemClick={setSelectedCustomer} /> };
            case 'orders':
                const storeIdsInRegion = stores
                    .filter(store => statesToFilter.includes(store.address.state))
                    .map(store => store.id);
                const filteredOrders = orders.filter(order => storeIdsInRegion.includes(order.storeId));
                return { title: `Orders in ${regionName}`, content: <PreviewTableOrderList orders={filteredOrders} onOrderSelect={setSelectedOrder} /> };
            default:
                return null;
        }
    }, [preview]);

    return (
        <div className='w-screen relative flex items-center justify-center  h-screen '>
            <div className='absolute flex  top-5  outline p-6  gap-4 h-[90vh] w-[90vw] rounded-2xl  z-10 pointer-events-none '>
                <div className='w-md h-full flex flex-col rounded-xl relative z-20 pointer-events-auto bg-white overflow-hidden'>
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`flex-1 py-2 text-sm font-semibold transition-colors ${activeTab === 'orders' ? 'bg-gray-100 text-gray-800' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('stores')}
                            className={`flex-1 py-2 text-sm font-semibold transition-colors ${activeTab === 'stores' ? 'bg-gray-100 text-gray-800' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Stores
                        </button>
                        <button
                            onClick={() => setActiveTab('locations')}
                            className={`flex-1 py-2 text-sm font-semibold transition-colors ${activeTab === 'locations' ? 'bg-gray-100 text-gray-800' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            Locations
                        </button>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {activeTab === 'orders' && <div className="py-4"><CompactOrderList orders={orders} onOrderSelect={setSelectedOrder} /></div>}
                        {activeTab === 'stores' && (
                            <div className="py-4">
                                <div className="px-4 mb-2">
                                    <Button onClick={() => setAddStoreModalOpen(true)} className="w-full">
                                        <Plus className="w-4 h-4 mr-2" /> Add Store
                                    </Button>
                                </div>
                                <CompactStoreList stores={stores} onStoreSelect={setSelectedStore} />
                            </div>
                        )}
                        {activeTab === 'locations' && <RegionFilterView onShowPreview={handleShowPreview} />}
                    </div>
                </div>

                <AnimatePresence>
                    {preview && previewContent && (
                        <motion.div
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="p-3 bg-white rounded-xl relative flex-1 pointer-events-auto overflow-hidden flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-2 p-2">
                                <h2 className="text-lg font-semibold">{previewContent.title}</h2>
                                <button onClick={() => setPreview(null)} className="p-1.5 rounded-full hover:bg-gray-100">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className='h-full overflow-y-auto pointer-events-auto'>
                                {previewContent.content}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

               
                </div>
                <Modal
                    isOpen={!!selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    title={selectedOrder ? `Order #${selectedOrder.id}` : 'Order Details'}
                >
                    {selectedOrder && <OrderDetail order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
                </Modal>

                <Modal
                    isOpen={isAddStoreModalOpen}
                    onClose={() => setAddStoreModalOpen(false)}
                    title="Add a New Store">
                    <AddStoreForm onClose={() => setAddStoreModalOpen(false)} />
                </Modal>

                <Modal
                    isOpen={!!selectedStore}
                    onClose={() => setSelectedStore(null)}
                    title={selectedStore ? `Store: ${selectedStore.name}` : 'Store Details'}
                >
                    {selectedStore && <StoreDetail store={selectedStore} />}
                </Modal>
                <Modal
                    isOpen={!!selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    title={selectedProduct ? `Product: ${selectedProduct.name}` : 'Product Details'}
                >
                    {selectedProduct && <ProductDetail product={selectedProduct} />}
                </Modal>
                <Modal
                    isOpen={!!selectedCustomer}
                    onClose={() => setSelectedCustomer(null)}
                    title={selectedCustomer ? `Customer: ${selectedCustomer.name}` : 'Customer Details'}
                >
                    {selectedCustomer && <CustomerDetail customer={selectedCustomer} />}
                </Modal>
            <UserMap />
        </div>

    );

}