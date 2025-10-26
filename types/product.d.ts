export interface ProductFeedback {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  manufacturer: string;
  dateAdded: string;
  gallery: {
    coverImageUrl: string;
    otherImagesUrl: string[];
  };
  feedback: ProductFeedback[];
}