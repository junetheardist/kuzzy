import React from 'react';
import { Vendor, Address } from '@/redux/vendorSlice';
import { MapPin, User, Calendar, Tag, ShieldCheck } from 'lucide-react';

interface StoreDetailProps {
  store: Vendor;
}

export const StoreDetail = ({ store }: StoreDetailProps) => {
  // Handle shopAddress which can be string or Address object
  const shopAddress = typeof store.shopAddress === 'object' ? store.shopAddress : null;
  const ownerAddress = typeof store.ownerAddress === 'object' ? store.ownerAddress : null;
  
  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-4">
        <img src={store.logo} alt={`${store.shopName} logo`} className="w-20 h-20 rounded-full border-4 border-white shadow-md" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{store.shopName}</h2>
          <p className="text-gray-500 capitalize">{store.category}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
          <MapPin className="w-5 h-5 text-gray-400 mt-1 shrink-0" />
          <div>
            <p className="font-semibold text-gray-700">Address</p>
            <p className="text-gray-600">
              {shopAddress 
                ? `${shopAddress.street || ''}, ${shopAddress.city || ''}, ${shopAddress.state || ''}`.replace(/^, /, '').replace(/, ,/g, ',').replace(/,\s*$/, '')
                : 'N/A'
              }
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
          <User className="w-5 h-5 text-gray-400 mt-1 shrink-0" />
          <div>
            <p className="font-semibold text-gray-700">Owner</p>
            <p className="text-gray-600">{store.ownerName || "N/A"}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
          <Calendar className="w-5 h-5 text-gray-400 mt-1 shrink-0" />
          <div>
            <p className="font-semibold text-gray-700">Date Joined</p>
            <p className="text-gray-600">{store.dateJoined ? new Date(store.dateJoined).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
          <ShieldCheck className="w-5 h-5 text-gray-400 mt-1 shrink-0" />
          <div>
            <p className="font-semibold text-gray-700">Status</p>
            <p className="text-gray-600 capitalize">{store.status || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};