import React from 'react';
import { User } from '@/types/user';
import { ListView, ColumnDefinition } from '@/components/ui/ListView';

interface TableCustomerListProps {
  customers: User[];
}

const customerColumns: ColumnDefinition<User>[] = [
  {
    key: 'name',
    header: 'Name',
    render: (customer) => <span className="font-medium text-gray-800">{customer.name}</span>,
  },
  {
    key: 'email',
    header: 'Email',
    render: (customer) => <span className="text-gray-700">{customer.email}</span>,
  },
  {
    key: 'primaryPhoneNumber',
    header: 'Phone',
    render: (customer) => <span className="text-gray-500">{customer.primaryPhoneNumber}</span>,
  },
  {
    key: 'dateJoined',
    header: 'Date Joined',
    render: (customer) => <span className="text-gray-500">{new Date(customer.dateJoined).toLocaleDateString()}</span>,
  },
];

export const TableCustomerList = ({ customers }: TableCustomerListProps) => {
  return <ListView items={customers.slice(0, 15)} columns={customerColumns} emptyStateMessage="No customers found." />;
};
