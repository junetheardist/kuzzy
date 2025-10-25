import React from 'react';
import { User } from '@/types/user';
import { Mail, Phone, MapPin, Calendar } from 'lucide-react';

interface CustomerDetailProps {
  customer: User;
}

export const CustomerDetail = ({ customer }: CustomerDetailProps) => {
  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{customer.name}</h2>
        <p className="text-gray-500 capitalize">{customer.role}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
          <Mail className="w-5 h-5 text-gray-400 shrink-0" />
          <p className="text-gray-600 truncate">{customer.email}</p>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
          <Phone className="w-5 h-5 text-gray-400 shrink-0" />
          <p className="text-gray-600">{customer.primaryPhoneNumber}</p>
        </div>
        <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg col-span-1 md:col-span-2">
          <MapPin className="w-5 h-5 text-gray-400 mt-1 shrink-0" />
          <div>
            <p className="font-semibold text-gray-700">Address</p>
            <p className="text-gray-600">{customer.address.street}, {customer.address.city}, {customer.address.state}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
          <Calendar className="w-5 h-5 text-gray-400 shrink-0" />
          <p><span className="font-semibold">Date Joined:</span> {new Date(customer.dateJoined).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};