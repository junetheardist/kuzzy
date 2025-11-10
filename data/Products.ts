import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: "PROD-001",
    name: "Classic White T-Shirt",
    description: "A comfortable and stylish 100% cotton white t-shirt, perfect for any occasion.",
    price: 8500,    
    category: "clothing",
    stock: 150,
    manufacturer: "Kuzzy Apparel",
    dateAdded: "2024-01-10",
    gallery: {
      coverImageUrl: "https://i.pinimg.com/564x/e0/be/99/e0be9963a84343315a8fbde53380340d.jpg",
      otherImagesUrl: [
        "https://i.pinimg.com/564x/e0/be/99/e0be9963a84343315a8fbde53380340d.jpg",
        "https://i.pinimg.com/564x/f3/35/2c/f3352c73913512b5a6d5b589355a2f8a.jpg",
      ]
    },
    feedback: [
      { id: "FB-001", customerName: "Amina Yusuf", rating: 5, comment: "Great quality and fits perfectly!", date: "2024-05-20" },
      { id: "FB-002", customerName: "John Doe", rating: 4, comment: "Good shirt, but it shrunk a little after washing.", date: "2024-05-15" }
    ]
  },
  {
    id: "PROD-002",
    name: "Noise-Cancelling Headphones",
    description: "Immerse yourself in sound with these premium noise-cancelling headphones with a 24-hour battery life.",
    price: 75000,
    category: "electronics",
    stock: 45,
    manufacturer: "SoundWave",
    dateAdded: "2024-02-01",
    gallery: {
      coverImageUrl: "https://i.pinimg.com/564x/83/c5/a6/83c5a63c83f740575a352fa22e783845.jpg",
      otherImagesUrl: [
        "https://i.pinimg.com/564x/83/c5/a6/83c5a63c83f740575a352fa22e783845.jpg",
        "https://i.pinimg.com/564x/de/9b/72/de9b7291511a78c3e1b3352c73913512.jpg"
      ]
    },
    feedback: [
      { id: "FB-003", customerName: "Chioma Nwosu", rating: 5, comment: "Amazing sound quality and very comfortable.", date: "2024-06-10" }
    ]
  },
  {
    id: "PROD-003",
    name: "The Alchemist by Paulo Coelho",
    description: "A classic novel about following your dreams, this book has inspired millions worldwide.",
    price: 8000,
    category: "books",
    stock: 200,
    manufacturer: "HarperCollins",
    dateAdded: "2023-11-20",
    gallery: {
      coverImageUrl: "https://i.pinimg.com/736x/f3/fe/06/f3fe068c5af4cbfc94e811d86f723d22.jpg",
      otherImagesUrl: []
    },
    feedback: []
  },
  {
    id: "PROD-004",
    name: "Organic Whole Bean Coffee",
    description: "A rich and aromatic blend of 100% Arabica beans, sourced sustainably.",
    price: 12000,
    category: "food",
    stock: 80,
    manufacturer: "Bean Supreme",
    dateAdded: "2024-03-05",
    gallery: {
      coverImageUrl: "https://i.pinimg.com/564x/c9/53/22/c9532226a2253231fac93a86363c3263.jpg",
      otherImagesUrl: []
    },
    feedback: [
      { id: "FB-004", customerName: "Tunde Adebayo", rating: 4, comment: "Good coffee, but a bit pricey.", date: "2024-06-01" }
    ]
  },
  {
    id: "PROD-005",
    name: "Smartwatch Series 8",
    description: "Track your fitness, stay connected, and monitor your health with this state-of-the-art smartwatch.",
    price: 250000,
    category: "electronics",
    stock: 30,
    manufacturer: "Apple",
    dateAdded: "2024-04-15",
    gallery: {
      coverImageUrl: "https://i.pinimg.com/1200x/70/a3/ec/70a3ecf46f31b616e412be8ef30ea7b1.jpg",
      otherImagesUrl: [
        "https://i.pinimg.com/736x/11/39/29/113929c7f7dc58c4ae193b075d28f1f7.jpg",
        "https://i.pinimg.com/736x/91/27/5b/91275bc0c1f2760149751e0d6929b0b6.jpg"
      ]
    },
    feedback: [
      { id: "FB-005", customerName: "Jane Doe", rating: 5, comment: "Best smartwatch I've ever owned!", date: "2024-05-25" }
    ]
  },
];
