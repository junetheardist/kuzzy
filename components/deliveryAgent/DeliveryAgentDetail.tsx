import React from 'react';
import { DeliveryAgent } from '@/types/agent';
import { Mail, Phone, Bike, Car, Truck, ShieldCheck, Star, FileText, BadgeCheck, BadgeX, Clock } from 'lucide-react';

interface DeliveryAgentDetailProps {
  agent: DeliveryAgent;
}

const vehicleIcons = {
  bike: <Bike className="w-5 h-5 text-gray-400" />,
  car: <Car className="w-5 h-5 text-gray-400" />,
  Truck: <Truck className="w-5 h-5 text-gray-400" />,
};

export const DeliveryAgentDetail = ({ agent }: DeliveryAgentDetailProps) => {
  return (
    <div className="p-4 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">{agent.name}</h2>
        <p className="text-gray-500 capitalize">{agent.role.replace('-', ' ')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
          <Mail className="w-5 h-5 text-gray-400 shrink-0" />
          <p className="text-gray-600 truncate">{agent.email}</p>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
          <Phone className="w-5 h-5 text-gray-400 shrink-0" />
          <p className="text-gray-600">{agent.primaryPhoneNumber}</p>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
          {vehicleIcons[agent.vehicleType]}
          <p><span className="font-semibold">Vehicle:</span> <span className="capitalize">{agent.vehicleType}</span> ({agent.licenseNumber})</p>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
          <ShieldCheck className="w-5 h-5 text-gray-400 shrink-0" />
          <p><span className="font-semibold">Status:</span> <span className="capitalize">{agent.status.replace('-', ' ')}</span></p>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg col-span-1 md:col-span-2">
          <Star className="w-5 h-5 text-gray-400 shrink-0" />
          <p><span className="font-semibold">Completed Deliveries:</span> {agent.completedDeliveries}</p>
        </div>
      </div>

      {/* KYC Information */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">KYC Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
            <FileText className="w-5 h-5 text-gray-400 shrink-0" />
            <p><span className="font-semibold">ID Type:</span> <span className="capitalize">{agent.kyc.idType.replace('-', ' ')}</span> ({agent.kyc.idNumber})</p>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
            {agent.kyc.verificationStatus === 'verified' && <BadgeCheck className="w-5 h-5 text-green-500 shrink-0" />}
            {agent.kyc.verificationStatus === 'pending' && <Clock className="w-5 h-5 text-yellow-500 shrink-0" />}
            {agent.kyc.verificationStatus === 'rejected' && <BadgeX className="w-5 h-5 text-red-500 shrink-0" />}
            <p><span className="font-semibold">Status:</span>
              <span className={`capitalize ml-1 font-medium ${
                agent.kyc.verificationStatus === 'verified' ? 'text-green-700' :
                agent.kyc.verificationStatus === 'pending' ? 'text-yellow-700' :
                'text-red-700'
              }`}>
                {agent.kyc.verificationStatus}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Delivery History */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Delivery History</h3>
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-600">Order ID</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-600">Date</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-600">Status</th>
                <th className="px-4 py-2 text-right font-semibold text-gray-600">Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {agent.deliveryHistory.map((item) => (
                <tr key={item.orderId} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-gray-700">{item.orderId}</td>
                  <td className="px-4 py-2 text-gray-600">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <span className={`capitalize px-2 py-0.5 text-xs rounded-full ${
                      item.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>{item.status}</span>
                  </td>
                  <td className="px-4 py-2 text-right font-semibold text-gray-800">₦{item.earnings.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};