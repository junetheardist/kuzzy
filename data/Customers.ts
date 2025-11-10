import { User } from '@/types/user';

export const customers: User[] = [
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
  {
    id: "CUST-002",
    name: "John Smith",
    email: "john.smith@example.com",
    primaryPhoneNumber: "07033334444",
    address: {
      street: "45 Market Rd",
      city: "Port Harcourt",
      state: "Rivers",
      country: "Nigeria",
    },
    role: "customer",
    dateJoined: "2023-02-15",
  },
  {
    id: "CUST-003",
    name: "Alice Johnson",
    email: "alice.j@example.com",
primaryPhoneNumber: "09055556666",
    address: {
      street: "789 High St",
      city: "Abuja",
      state: "Abuja",
      country: "Nigeria",
    },
    role: "customer",
    dateJoined: "2023-03-20",
  },
  {
    id: "CUST-004",
    name: "Bob Williams",
    email: "bob.w@example.com",
    primaryPhoneNumber: "08177778888",
    address: {
      street: "10 Palm Ave",
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria",
    },
    role: "customer",
    dateJoined: "2023-04-01",
  },
];
