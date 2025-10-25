import React from 'react';
import { DeliveryAgent } from '@/types/agent';
import { CompactDeliveryAgentCard } from '@/components/deliveryAgent/DeliveryAgentCard';

interface DeliveryAgentListProps {
  agents: DeliveryAgent[];
  onAgentSelect?: (agent: DeliveryAgent) => void;
}

export const CompactDeliveryAgentList = ({ agents, onAgentSelect }: DeliveryAgentListProps) => { 
  return (
    <div className="space-y-1">
      {agents.map((agent) => (
        <CompactDeliveryAgentCard key={agent.id} agent={agent} onClick={() => onAgentSelect?.(agent)} />
      ))}
    </div>
  );
};