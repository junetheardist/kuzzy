import { Product } from '@/types/product'

export const products: Product[] = [
  {
    id: "PROD-001",
    name: "Classic White T-Shirt",
    description: "A comfortable and stylish 100% cotton white t-shirt, perfect for any occasion.",
    price: 8500,
    image: "https://i.pinimg.com/564x/e0/be/99/e0be9963a84343315a8fbde53380340d.jpg",
    category: "clothing",
    stock: 150,
  },
  {
    id: "PROD-002",
    name: "Noise-Cancelling Headphones",
    description: "Immerse yourself in sound with these premium noise-cancelling headphones with a 24-hour battery life.",
    price: 75000,
    image: "https://i.pinimg.com/564x/83/c5/a6/83c5a63c83f740575a352fa22e783845.jpg",
    category: "electronics",
    stock: 45,
  },
  {
    id: "PROD-003",
    name: "The Alchemist by Paulo Coelho",
    description: "A classic novel about following your dreams, this book has inspired millions worldwide.",
    price: 8000,
    image: "https://i.pinimg.com/564x/6a/54/93/6a5493c4f429e1445095e9f485018c21.jpg",
    category: "books",
    stock: 200,
  },
  {
    id: "PROD-004",
    name: "Organic Whole Bean Coffee",
    description: "A rich and aromatic blend of 100% Arabica beans, sourced sustainably.",
    price: 12000,
    image: "https://i.pinimg.com/564x/c9/53/22/c9532226a2253231fac93a86363c3263.jpg",
    category: "food",
    stock: 80,
  },
  {
    id: "PROD-005",
    name: "Smartwatch Series 8",
    description: "Track your fitness, stay connected, and monitor your health with this state-of-the-art smartwatch.",
    price: 250000,
    image: "https://i.pinimg.com/564x/e8/b7/3c/e8b73c5c5b73c5c5b73c5c5b73c5c5b7.jpg",
    category: "electronics",
    stock: 30,
  },
];