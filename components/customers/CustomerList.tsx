import React from 'react';
import { User } from '@/types/user';
import { CustomerCard, CompactCustomerCard } from './CustomerCard';

interface CustomerListProps {
  customers: User[];
  onCustomerSelect?: (customer: User) => void;
}

export const CustomerList = ({ customers, onCustomerSelect }: CustomerListProps) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
      {customers.map((customer) => (
        <CustomerCard key={customer.id} customer={customer} onClick={() => onCustomerSelect?.(customer)} />
      ))}
    </div>
  );
};

export const CompactCustomerList = ({ customers, onCustomerSelect }: CustomerListProps) => {
  return (
    <div className="space-y-1">
      {customers.map((customer) => (
        <CompactCustomerCard key={customer.id} customer={customer} onClick={() => onCustomerSelect?.(customer)} />
      ))}
    </div>
  );
};