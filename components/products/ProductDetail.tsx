import React, { useState } from 'react';
import { Product } from '@/types/product';
import { orders } from '@/data/orders';
import { stores } from '@/data/stores';
import { Tag, Package, DollarSign, ShoppingCart, BarChart, User, Calendar, Star, MessageSquare, Building } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
}

export const ProductDetail = ({ product }: ProductDetailProps) => {
  const [mainImage, setMainImage] = useState(product.gallery.coverImageUrl);
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate purchase stats
  const purchaseStats = orders.reduce((acc, order) => {
    const item = order.items.find(i => i.id === product.id);
    if (item) {
      acc.unitsSold += item.quantity;
      acc.revenue += item.price * item.quantity;
    }
    return acc;
  }, { unitsSold: 0, revenue: 0 });

  // Find stores that sell this product
  const sellingStoreIds = new Set(orders.filter(o => o.items.some(i => i.id === product.id)).map(o => o.storeId));
  const sellingStores = stores.filter(s => sellingStoreIds.has(s.id));

  return (
    <div className="p-4">
      {/* Gallery and Main Info */}
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="w-full md:w-1/2">
          <div className="aspect-square w-full bg-gray-100 rounded-lg overflow-hidden shadow-lg">
            <img src={mainImage} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-2 mt-2">
            {product.gallery.otherImagesUrl.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name} thumbnail ${index + 1}`}
                className={`w-16 h-16 rounded-md object-cover cursor-pointer border-2 ${mainImage === img ? 'border-indigo-500' : 'border-transparent'}`}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
          <p className="text-gray-500 mt-1">{product.description}</p>
          <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg mt-4">
            <DollarSign className="w-5 h-5 text-gray-400" />
            <p><span className="font-semibold">Price:</span> ₦{product.price.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <button onClick={() => setActiveTab('overview')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Overview
            </button>
            <button onClick={() => setActiveTab('availability')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'availability' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Availability
            </button>
            <button onClick={() => setActiveTab('feedback')} className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'feedback' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              Feedback
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg"><Tag className="w-5 h-5 text-gray-400" /><p><span className="font-semibold">Category:</span> <span className="capitalize">{product.category}</span></p></div>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg"><Package className="w-5 h-5 text-gray-400" /><p><span className="font-semibold">Stock:</span> {product.stock}</p></div>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg"><User className="w-5 h-5 text-gray-400" /><p><span className="font-semibold">Manufacturer:</span> {product.manufacturer}</p></div>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg"><Calendar className="w-5 h-5 text-gray-400" /><p><span className="font-semibold">Date Added:</span> {new Date(product.dateAdded).toLocaleDateString()}</p></div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2"><BarChart className="w-5 h-5" /> Purchase Stats</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg"><span className="font-semibold">Units Sold:</span> {purchaseStats.unitsSold}</div>
                <div className="bg-gray-50 p-3 rounded-lg"><span className="font-semibold">Total Revenue:</span> ₦{purchaseStats.revenue.toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'availability' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2"><ShoppingCart className="w-5 h-5" /> Available In</h3>
            <div className="space-y-3">
              {sellingStores.length > 0 ? sellingStores.map(store => (
                <div key={store.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg text-sm">
                  <Building className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-semibold">{store.name}</p>
                    <p className="text-gray-500">{store.address?.street || ''}, {store.address?.city || ''}</p>
                  </div>
                </div>
              )) : <p className="text-sm text-gray-500">Not currently sold in any tracked stores.</p>}
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2"><MessageSquare className="w-5 h-5" /> Customer Feedback</h3>
            <div className="space-y-4">
              {product.feedback.length > 0 ? product.feedback.map(fb => (
                <div key={fb.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-gray-800">{fb.customerName}</p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < fb.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{fb.comment}</p>
                  <p className="text-xs text-gray-400 text-right">{new Date(fb.date).toLocaleDateString()}</p>
                </div>
              )) : <p className="text-sm text-gray-500">No feedback yet for this product.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};