"use client";
import React, { useState } from "react";

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

interface ProductFormProps {
  onSubmit: (product: Product) => void;
  initialData?: Product;
}

export const ProductForm = ({ onSubmit, initialData }: ProductFormProps) => {
  const [formData, setFormData] = useState<Product>(
    initialData || {
      name: "",
      description: "",
      price: 0,
      image: "",
      category: "",
      stock: 0,
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg mx-auto space-y-4 border"
    >
      <h2 className="text-lg font-semibold text-gray-800">
        {initialData ? "Edit Product" : "Add Product"}
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Product Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring focus:ring-amber-200"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          required
          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring focus:ring-amber-200"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Price (₦)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring focus:ring-amber-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring focus:ring-amber-200"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring focus:ring-amber-200"
        >
          <option value="">Select category</option>
          <option value="clothing">Clothing</option>
          <option value="electronics">Electronics</option>
          <option value="books">Books</option>
          <option value="food">Food</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image URL</label>
        <input
          type="url"
          name="image"
          value={formData.image}
          onChange={handleChange}
          required
          placeholder="https://example.com/product.jpg"
          className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring focus:ring-amber-200"
        />
      </div>

      {formData.image && (
        <div className="mt-2 flex justify-center">
          <img
            src={formData.image}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border"
          />
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg font-semibold transition"
      >
        {initialData ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
};
