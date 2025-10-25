import React from 'react';
import { Product } from '@/types/product';
import { Tag, Package, DollarSign } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
}

export const ProductDetail = ({ product }: ProductDetailProps) => {
  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <img src={product.image} alt={product.name} className="w-40 h-40 rounded-lg object-cover shadow-lg" />
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
          <p className="text-gray-500 mt-1">{product.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
          <Tag className="w-5 h-5 text-gray-400" />
          <p><span className="font-semibold">Category:</span> <span className="capitalize">{product.category}</span></p>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
          <DollarSign className="w-5 h-5 text-gray-400" />
          <p><span className="font-semibold">Price:</span> ₦{product.price.toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
          <Package className="w-5 h-5 text-gray-400" />
          <p><span className="font-semibold">Stock:</span> {product.stock}</p>
        </div>
      </div>
    </div>
  );
};