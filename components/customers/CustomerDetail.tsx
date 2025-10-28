import React from 'react';
import { User as Customer } from '@/types/user';
import { orders } from '@/data/orders';
import { Mail, Phone, MapPin, Calendar, ShoppingCart, DollarSign } from 'lucide-react';

interface CustomerDetailProps {
  customer: Customer;
}

export const CustomerDetail = ({ customer }: CustomerDetailProps) => {
  const customerOrders = orders.filter(order => order.customerName === customer.name);
  const totalSpent = customerOrders.reduce((acc, order) => acc + order.total, 0);

  return (
    <div className="p-4 space-y-6">
      {/* Customer Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{customer.name}</h2>
        <p className="text-gray-500 capitalize">{customer.role}</p>
      </div>

      {/* Contact and Address */}
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
          <p><span className="font-semibold">Address:</span> {customer.address.street}, {customer.address.city}, {customer.address.state}</p>
        </div>
      </div>

      {/* Experience Metrics */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Experience</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-400 shrink-0" />
            <p><span className="font-semibold">Joined:</span> {new Date(customer.dateJoined).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
            <ShoppingCart className="w-5 h-5 text-gray-400 shrink-0" />
            <p><span className="font-semibold">Total Orders:</span> {customerOrders.length}</p>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
            <DollarSign className="w-5 h-5 text-gray-400 shrink-0" />
            <p><span className="font-semibold">Total Spent:</span> ₦{totalSpent.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Transaction History</h3>
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-600">Order ID</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-600">Date</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-600">Status</th>
                <th className="px-4 py-2 text-right font-semibold text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customerOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-gray-700">{order.id}</td>
                  <td className="px-4 py-2 text-gray-600">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <span className={`capitalize px-2 py-0.5 text-xs rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-700' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>{order.status}</span>
                  </td>
                  <td className="px-4 py-2 text-right font-semibold text-gray-800">₦{order.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};