import React from 'react';
import { X } from 'lucide-react';
import { Vendor } from '@/redux/vendorSlice';
import { EditStoreForm } from '@/components/Forms/stores/EditStoreForm';

interface EditStoreModalProps {
    store: Vendor | null;
    isOpen: boolean;
    onClose: () => void;
}

export const EditStoreModal: React.FC<EditStoreModalProps> = ({ store, isOpen, onClose }) => {
    if (!isOpen || !store) return null;

    return (
        <div
            className="fixed inset-0 bg-black/30 z-50 flex justify-center items-center p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh] w-full max-w-3xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Edit Store: {store.shopName}</h2>
                        <p className="text-sm text-gray-600 mt-1">Update store information and details</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
                        title="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    <EditStoreForm store={store} onClose={onClose} />
                </div>
            </div>
        </div>
    );
};
