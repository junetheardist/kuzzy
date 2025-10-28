import React from 'react';
import { Store } from '@/types/Store';
import { MapPin, User, Calendar, Tag, ShieldCheck } from 'lucide-react';

interface StoreDetailProps {
  store: Store;
}

export const StoreDetail = ({ store }: StoreDetailProps) => {
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-4">
        <img src={store.logo} alt={`${store.name} logo`} className="w-20 h-20 rounded-full border-4 border-white shadow-md" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{store.name}</h2>
          <p className="text-gray-500 capitalize">{store.category}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
          <MapPin className="w-5 h-5 text-gray-400 mt-1 shrink-0" />
          <div>
            <p className="font-semibold text-gray-700">Address</p>
            <p className="text-gray-600">{store.address.street}, {store.address.city}, {store.address.state}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
          <User className="w-5 h-5 text-gray-400 mt-1 shrink-0" />
          <div>
            <p className="font-semibold text-gray-700">Owner</p>
            <p className="text-gray-600">{store.owner.name}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
          <Calendar className="w-5 h-5 text-gray-400 mt-1 shrink-0" />
          <div>
            <p className="font-semibold text-gray-700">Date Joined</p>
            <p className="text-gray-600">{new Date(store.dateJoined).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
          <ShieldCheck className="w-5 h-5 text-gray-400 mt-1 shrink-0" />
          <div>
            <p className="font-semibold text-gray-700">Status</p>
            <p className="text-gray-600 capitalize">{store.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};