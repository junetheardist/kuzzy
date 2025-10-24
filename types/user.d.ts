export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

export type UserRole = 'customer' | 'vendor' | 'admin' | 'rider';

export interface User {
  id: string;
  name: string;
  email: string;
  primaryPhoneNumber: string;
  secondaryPhoneNumber?: string;
  address: Address;
  role: UserRole;
  dateJoined: string;
}