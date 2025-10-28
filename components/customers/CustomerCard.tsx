import React from 'react';
import { User } from '@/types/user';
import { Mail, Phone } from 'lucide-react';

interface CustomerCardProps {
  customer: User;
  onClick?: () => void;
}

export const CustomerCard = ({ customer, onClick }: CustomerCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="relative w-14 h-14 shrink-0 overflow-hidden bg-indigo-100 rounded-full flex items-center justify-center">
          <span className="text-xl font-semibold text-indigo-600">
            {customer.name.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate text-md text-gray-800">{customer.name}</p>
          <p className="text-sm text-gray-500 capitalize">{customer.role}</p>
        </div>
      </div>
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Mail className="w-4 h-4 shrink-0 text-gray-400" />
          <p className="truncate">{customer.email}</p>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Phone className="w-4 h-4 shrink-0 text-gray-400" />
          <p>{customer.primaryPhoneNumber}</p>
        </div>
      </div>
    </div>
  );
};

export const CompactCustomerCard = ({ customer, onClick }: CustomerCardProps) => {
  return (
    <div onClick={onClick} className="flex cursor-pointer items-center gap-4 bg-white p-3 hover:bg-gray-100 transition rounded-lg">
      <div className="relative w-12 h-12 shrink-0 overflow-hidden bg-indigo-100 rounded-full flex items-center justify-center">
        <span className="text-lg font-semibold text-indigo-600">{customer.name.charAt(0)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate text-sm">{customer.name}</p>
        <p className="text-xs text-gray-500 truncate">{customer.email}</p>
      </div>
    </div>
  );
};