'use client';
import React from 'react';
import { CompactOrderList, TableOrderList } from "@/components/orders/orderList";
import { CompactStoreList } from "@/components/stores/StoreList";
import { RegionFilterView } from '@/components/Regions/RegionFilterView';
import UserMap from '@/components/dashboard/UserMap'; // This line is already correct, no change needed.
import { orders } from '@/data/orders';
import { stores } from '@/data/stores';
import { useState } from 'react';
import { OrderDetailsPopup } from '@/components/orders/OrderDetailsPopup';
import { Order } from '@/types/order';
import { Modal } from '../../components/Modal';


export default function UiComponents() {
    const [expanded, setExpanded] = useState(false); // This state is no longer used for the modal, but keeping it for now.
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [activeTab, setActiveTab] = useState('orders');

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
                        {activeTab === 'stores' && <div className="py-4"><CompactStoreList stores={stores} /></div>}
                        {activeTab === 'locations' && <RegionFilterView />}
                    </div>
                </div>
                    <div
                        className="p-3 bg-white rounded-xl relative flex-1 pointer-events-auto overflow-hidden"
                    >
                        <div className='h-full overflow-y-scroll pointer-events-auto'>
                            <h2 className="text-lg font-semibold mb-2 ml-2 ">Orders Table list</h2>
                            <TableOrderList orders={orders} onOrderSelect={setSelectedOrder} />
                        </div>
                    </div>
                </div>
                <Modal
                    isOpen={!!selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    title={selectedOrder ? `Order #${selectedOrder.id}` : 'Order Details'}
                >
                    {selectedOrder && (
                        <OrderDetailsPopup order={selectedOrder} onClose={() => setSelectedOrder(null)} />
                    )}
                </Modal>
            <UserMap />
        </div>

    );

}