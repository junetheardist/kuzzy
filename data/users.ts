import { User } from '@/types/user';

export const users: User[] = [
  {
    id: "USER-001",
    name: "Bolanle Adeoye",
    email: "bolanle.adeoye@example.com",
    primaryPhoneNumber: "08012345678",
    address: {
      street: "10 Fola Osibo Rd",
      city: "Lekki",
      state: "Lagos",
      country: "Nigeria",
    },
    role: "vendor",
    dateJoined: "2024-01-10",
  },
  {
    id: "USER-002",
    name: "Chidi Okoro",
    email: "chidi.okoro@example.com",
    primaryPhoneNumber: "09087654321",
    address: {
      street: "22 Adetokunbo Ademola Crescent",
      city: "Wuse II",
      state: "Abuja",
      country: "Nigeria",
    },
    role: "vendor",
    dateJoined: "2024-03-20",
  },
  {
    id: "USER-003",
    name: "Admin Kuzzy",
    email: "admin@kuzzy.com",
    primaryPhoneNumber: "08000000000",
    address: {
      street: "1 Kuzzy HQ",
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria",
    },
    role: "admin",
    dateJoined: "2023-01-01",
  },
  // Including a customer here to show the 'users' file can contain all roles
  {
    id: "CUST-001",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    primaryPhoneNumber: "08011112222",
    address: {
      street: "123 Main St",
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria",
    },
    role: "customer",
    dateJoined: "2023-01-10",
  },
];