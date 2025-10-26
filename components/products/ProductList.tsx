import React from 'react';
import { Product } from '@/types/product';
import { CompactProductCard } from './ProductCard';

interface ProductListProps {
  products: Product[];
  onProductSelect?: (product: Product) => void;
}

export const CompactProductList = ({ products, onProductSelect }: ProductListProps) => {
  return (
    <div className="space-y-1">
      {products.map((product) => (
        <CompactProductCard key={product.id} product={product} onClick={() => onProductSelect?.(product)} />
      ))}
    </div>
  );
};