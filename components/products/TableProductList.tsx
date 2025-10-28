import React from 'react';
import { Product } from '@/types/product';
import { ListView, ColumnDefinition } from '@/components/ui/ListView';

interface TableProductListProps {
  products: Product[];
  onItemClick?: (product: Product) => void;
}

const productColumns: ColumnDefinition<Product>[] = [
  {
    key: 'name',
    header: 'Product Name',
    render: (product) => (
      <div className="flex items-center gap-3">
        <img src={product.gallery.coverImageUrl} alt={product.name} className="w-8 h-8 rounded-md object-cover" />
        <span className="font-medium text-gray-800">{product.name}</span>
      </div>
    ),
  },
  {
    key: 'category',
    header: 'Category',
    render: (product) => <span className="text-gray-500 capitalize">{product.category}</span>,
  },
  {
    key: 'price',
    header: 'Price',
    render: (product) => <span className="text-gray-700">₦{product.price.toLocaleString()}</span>,
  },
  { key: 'stock', header: 'Stock', render: (product) => <span className="text-gray-700">{product.stock}</span> },
];

export const TableProductList = ({ products, onItemClick }: TableProductListProps) => {
  return <ListView items={products.slice(0, 15)} columns={productColumns} onItemClick={onItemClick} emptyStateMessage="No products found." />;
};