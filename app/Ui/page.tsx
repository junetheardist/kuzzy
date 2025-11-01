'use client';
import React, {useEffect, useMemo, useState} from 'react';
import {CompactOrderList, TableOrderList as PreviewTableOrderList} from "@/components/orders/orderList";
import {CompactStoreList} from "@/components/stores/StoreList";
import {RegionFilterView} from '@/components/Regions/RegionFilterView';
import {regions} from '@/data/regions';
import {orders} from '@/data/orders';
import {stores} from '@/data/stores';
import {OrderDetail} from '@/components/orders/OrderDetail';
import {Order} from '@/types/order';
import {Modal} from '../../components/ui/Modal';
import {AnimatePresence, motion} from 'framer-motion';
import {X} from 'lucide-react';
import {TableStoreList} from '@/components/stores/StoreListView';
import {products} from '@/data/products';
import {customers} from '@/data/customers'; // Import the new customer data
import {TableProductList} from '@/components/products/TableProductList';
import {TableCustomerList} from '@/components/customers/TableCustomerList';
import GoogleMapView from "@/components/dashboard/GoogleMapView";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {fetchVendors} from "@/redux/vendorSlice";


export default function UiComponents() {
    const [expanded, setExpanded] = useState(false); // This state is no longer used for the modal, but keeping it for now.
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [activeTab, setActiveTab] = useState('orders');
    const [preview, setPreview] = useState<{ type: string; data: any } | null>(null);

    const dispatch = useAppDispatch();
    const {vendors, loading, error} = useAppSelector((s) => s.vendor);

    useEffect(() => {
        dispatch(fetchVendors());
    }, [dispatch]);

    const handleShowPreview = (type: string, data: any) => {
        setPreview({type, data});
    };

    const previewContent = useMemo(() => {
        if (!preview) return null;

        const {type, data} = preview;
        const regionName = data?.name || '';

        // Determine the list of states to filter by.
        const isTopLevelRegion = regions.some(r => r.id === data.id);
        const statesToFilter = isTopLevelRegion ? data.sublocationNames : [data.name];

        switch (type) {
            case 'stores':
                const filteredStores = stores.filter(store => statesToFilter.includes(store.address.state));
                return {title: `Stores in ${regionName}`, content: <TableStoreList stores={vendors}/>};
            case 'products':
                // Products are not tied to a region in the current data model, so we show all.
                return {title: `Products in ${regionName}`, content: <TableProductList products={products}/>};
            case 'customers':
                const filteredCustomers = customers.filter(customer => statesToFilter.includes(customer.address.state));
                return {
                    title: `Customers in ${regionName}`,
                    content: <TableCustomerList customers={filteredCustomers}/>
                };
            case 'orders':
                const storeIdsInRegion = stores
                    .filter(store => statesToFilter.includes(store.address.state))
                    .map(store => store.id);
                const filteredOrders = orders.filter(order => storeIdsInRegion.includes(order.storeId));
                return {title: `Orders in ${regionName}`, content: <PreviewTableOrderList orders={filteredOrders}/>};
            default:
                return null;
        }
    }, [preview]);

    return (
        <div className='w-screen relative flex items-center justify-center  h-screen '>
            <div
                className='absolute flex  top-5  outline p-6  gap-4 h-[90vh] w-[90vw] rounded-2xl  z-10 pointer-events-none '>
                <div
                    className='w-md h-full flex flex-col rounded-xl relative z-20 pointer-events-auto bg-white overflow-hidden'>
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
                        {activeTab === 'orders' &&
                            <div className="py-4"><CompactOrderList orders={orders} onOrderSelect={setSelectedOrder}/>
                            </div>}
                        {activeTab === 'stores' && <div className="py-4"><CompactStoreList stores={vendors}/></div>}
                        {activeTab === 'locations' && <RegionFilterView onShowPreview={handleShowPreview}/>}
                    </div>
                </div>

                <AnimatePresence>
                    {preview && previewContent && (
                        <motion.div
                            initial={{opacity: 0, x: 100}}
                            animate={{opacity: 1, x: 0}}
                            exit={{opacity: 0, x: 100}}
                            transition={{duration: 0.3, ease: "easeInOut"}}
                            className="p-3 bg-white rounded-xl relative flex-1 pointer-events-auto overflow-hidden flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-2 p-2">
                                <h2 className="text-lg font-semibold">{previewContent.title}</h2>
                                <button onClick={() => setPreview(null)}
                                        className="p-1.5 rounded-full hover:bg-gray-100">
                                    <X className="w-5 h-5"/>
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
                {selectedOrder && <OrderDetail order={selectedOrder} onClose={function (): void {
                    throw new Error('Function not implemented.');
                }}/>} {/* Changed from OrderDetailsPopup */}
            </Modal>
            <GoogleMapView/>
        </div>

    );

}
