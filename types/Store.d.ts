export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode?: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface OwnerInfo {
  id: string; // Corresponds to a UserID
  name: string;
  email: string;
  primaryPhoneNumber: string;
  secondaryPhoneNumber?: string;
  address: Address;
}

export interface StoreRegistrationDocuments {
  businessRegistrationUrl?: string; // e.g., CAC document
  idType: "national-id" | "drivers-license" | "voters-card" | "passport";
  idNumber: string;
  idDocumentUrl: string; // URL to the uploaded ID document
  proofOfAddressUrl: string; // e.g., Utility bill
}

export interface Gallery {
  coverImageUrl: string;
  otherImagesUrl: string[];
}

export interface StoreCategory {
  id: string;
  /** The display name of the category (e.g., "Electronics", "Groceries") */
  name: string;
  /** A URL-friendly slug for the category (e.g., "electronics") */
  slug: string;
  /** Optional description for the category */
  description?: string;
}

export interface Store {
  id: string;
  vendorId: string; // The user ID of the vendor who owns the store
  name: string;
  logo: string; // URL to the store's logo
  address: Address;
  category: StoreCategory["slug"]; // Corresponds to a StoreCategory
  status: "active" | "inactive" | "pending";
  dateJoined: string;
  owner: OwnerInfo;
  registrationDocuments: StoreRegistrationDocuments;
  gallery: Gallery;
}