import { Address, User } from './user';

export type StoreStatus = 'active' | 'pending' | 'inactive' | 'rejected';

export interface RegistrationDocuments {
  businessRegistrationUrl?: string;
  idType: 'national-id' | 'drivers-license' | 'passport';
  idNumber: string;
  idDocumentUrl: string;
  proofOfAddressUrl: string;
}

export interface StoreGallery {
  coverImageUrl: string;
  otherImagesUrl: string[];
}

export interface Store {
  id: string;
  vendorId: string;
  name: string;
  logo: string;
  address: Address;
  category: string; // Should ideally be a more specific type, e.g., StoreCategory['id']
  status: StoreStatus;
  dateJoined: string;
  owner: Partial<User> & { id: string; name: string }; // Owner might not have all user fields
  registrationDocuments: RegistrationDocuments;
  gallery: StoreGallery;
}

export interface StoreCategory {
  id: string;
  name: string;
  slug: string;
  description: string;}