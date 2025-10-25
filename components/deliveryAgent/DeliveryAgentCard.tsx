import React from 'react';
import { DeliveryAgent } from '@/types/agent';
import { Bike, Car, Truck } from 'lucide-react';

interface DeliveryAgentCardProps {
  agent: DeliveryAgent;
  onClick?: () => void;
}

const vehicleIcons = {
  bike: <Bike className="w-4 h-4" />,
  car: <Car className="w-4 h-4" />,
  Truck: <Truck className="w-4 h-4" />,
};

export const CompactDeliveryAgentCard = ({ agent, onClick }: DeliveryAgentCardProps) => {
  return (
    <div onClick={onClick} className="flex cursor-pointer items-center gap-4 bg-white p-3 hover:bg-gray-100 transition rounded-lg">
      <div className="relative w-12 h-12 shrink-0 overflow-hidden bg-blue-100 rounded-full flex items-center justify-center">
        <span className="text-lg font-semibold text-blue-600">{agent.name.charAt(0)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate text-sm">{agent.name}</p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {vehicleIcons[agent.vehicleType]}
          <span className="capitalize">{agent.vehicleType}</span>
        </div>
      </div>
      <div className="text-right">
        <span className={`text-xs px-2 py-1 rounded-full capitalize ${
          agent.status === 'available' ? 'bg-green-100 text-green-700' :
          agent.status === 'on-delivery' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {agent.status.replace('-', ' ')}
        </span>
      </div>
    </div>
  );
};