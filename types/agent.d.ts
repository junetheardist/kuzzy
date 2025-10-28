import { User } from './user';

export type AgentStatus = 'available' | 'on-delivery' | 'inactive';
export type VehicleType = 'bike' | 'car' | 'Truck';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type IDType = 'national-id' | 'drivers-license' | 'voters-card' | 'passport';

export interface KYC {
  idType: IDType;
  idNumber: string;
  idDocumentUrl: string;
  proofOfAddressUrl: string;
  verificationStatus: VerificationStatus;
  verifiedBy?: string; // Support staff ID
  verifiedAt?: string; // ISO Date string
}

export interface DeliveryHistoryItem {
  orderId: string;
  date: string; // ISO Date string
  status: 'completed' | 'cancelled';
  earnings: number;
}

export interface DeliveryAgent extends User {
  role: 'delivery-agent';
  vehicleType: VehicleType;
  licenseNumber: string;
  status: AgentStatus;
  completedDeliveries: number;
  kyc: KYC;
  deliveryHistory: DeliveryHistoryItem[];
}