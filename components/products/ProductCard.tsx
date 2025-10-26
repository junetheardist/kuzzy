import React from 'react';
import { Product } from '@/types/product';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export const CompactProductCard = ({ product, onClick }: ProductCardProps) => {
  return (
    <div onClick={onClick} className="flex cursor-pointer items-center gap-4 bg-white p-3 hover:bg-gray-100 transition rounded-lg">
      <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-md bg-gray-100">
        <Image
          src={product.gallery.coverImageUrl}
          alt={product.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate text-sm">{product.name}</p>
        <p className="text-xs text-gray-500 truncate">₦{product.price.toLocaleString()}</p>
      </div>
      <p className="text-sm font-medium text-gray-600">Stock: {product.stock}</p>
    </div>
  );
};