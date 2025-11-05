// src/components/stores/StoreDetailsModal.tsx
import React, { useState } from "react";
import Image from "next/image";
import { X, Edit } from "lucide-react";
import { Address, Gallery, Vendor } from "@/redux/vendorSlice";
import { products } from "@/data/products";

interface StoreDetailsModalProps {
  store: Vendor | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (store: Vendor) => void;
}

// Placeholder image for missing images
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

type TabType = "details" | "products";

export const StoreDetailsModal: React.FC<StoreDetailsModalProps> = ({
  store,
  isOpen,
  onClose,
  onEdit,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("details");

  if (!isOpen || !store) return null;

  const shopAddress = store.shopAddress as Address;
  const ownerAddress = store.ownerAddress as Address;
  const gallery = store.gallery as Gallery;
  const coverImage = gallery?.coverImageUrl || PLACEHOLDER_IMAGE;

  return (
    <div
      className="fixed inset-0 bg-black/30 z-50 flex justify-center items-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh] w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{store.shopName}</h2>
            <p className="text-sm text-gray-600 capitalize mt-1">{store.category || "Store"}</p>
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => {
                  onEdit(store);
                  onClose();
                }}
                className="p-2 rounded-full hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700 transition-colors"
                title="Edit store"
              >
                <Edit className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 border-b border-gray-200 px-4 pt-4">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 -mb-0.5 ${
              activeTab === "details"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Store Details
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 -mb-0.5 ${
              activeTab === "products"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Products
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Details Tab */}
          {activeTab === "details" && (
            <div className="space-y-6">
          <div>
            <span
              className={`inline-block text-xs px-3 py-1 rounded-full capitalize font-medium ${
                store.status === "active"
                  ? "bg-green-100 text-green-700"
                  : store.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {store.status}
            </span>
          </div>

          {/* Cover Image */}
          {coverImage && (
            <div className="relative h-64 w-full rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={coverImage}
                alt={store.shopName}
                fill
                className="object-cover"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = PLACEHOLDER_IMAGE;
                }}
              />
            </div>
          )}

          {/* Shop Details Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Shop Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 font-medium">EMAIL</p>
                <p className="text-gray-900 mt-1">{store.shopEmail || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">PRIMARY PHONE</p>
                <p className="text-gray-900 mt-1">
                  {store.shopPrimaryPhoneNumber || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">SECONDARY PHONE</p>
                <p className="text-gray-900 mt-1">
                  {store.shopSecondaryPhoneNumber || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">SALES TYPE</p>
                <p className="text-gray-900 mt-1 capitalize">
                  {store.saleType || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Shop Address Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Shop Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 font-medium">STREET</p>
                <p className="text-gray-900 mt-1">
                  {shopAddress?.street || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">CITY</p>
                <p className="text-gray-900 mt-1">
                  {shopAddress?.city || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">STATE</p>
                <p className="text-gray-900 mt-1">
                  {shopAddress?.state || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">COUNTRY</p>
                <p className="text-gray-900 mt-1">
                  {shopAddress?.country || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">POSTAL CODE</p>
                <p className="text-gray-900 mt-1">
                  {shopAddress?.postalCode || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">COORDINATES</p>
                <p className="text-gray-900 text-xs mt-1 font-mono">
                  {shopAddress?.latitude && shopAddress?.longitude
                    ? `${shopAddress.latitude.toFixed(4)}, ${shopAddress.longitude.toFixed(4)}`
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Owner Details Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Owner Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 font-medium">NAME</p>
                <p className="text-gray-900 mt-1">{store.ownerName || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">EMAIL</p>
                <p className="text-gray-900 mt-1">{store.ownerEmail || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">PRIMARY PHONE</p>
                <p className="text-gray-900 mt-1">
                  {store.ownerPrimaryPhoneNumber || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">SECONDARY PHONE</p>
                <p className="text-gray-900 mt-1">
                  {store.ownerSecondaryPhoneNumber || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Owner Address Section */}
          {(ownerAddress?.street || ownerAddress?.city) && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                Owner Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 font-medium">STREET</p>
                  <p className="text-gray-900 mt-1">
                    {ownerAddress?.street || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">CITY</p>
                  <p className="text-gray-900 mt-1">
                    {ownerAddress?.city || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">STATE</p>
                  <p className="text-gray-900 mt-1">
                    {ownerAddress?.state || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">COUNTRY</p>
                  <p className="text-gray-900 mt-1">
                    {ownerAddress?.country || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Business Registration Section */}
          {(store.officialBusinessName || store.cacNumber) && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                Business Registration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-600 font-medium">OFFICIAL BUSINESS NAME</p>
                  <p className="text-gray-900 mt-1">
                    {store.officialBusinessName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">CAC NUMBER</p>
                  <p className="text-gray-900 mt-1">
                    {store.cacNumber || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Metadata Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
              Metadata
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 font-medium">DATE JOINED</p>
                <p className="text-gray-900 mt-1">
                  {new Date(store.dateJoined).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-medium">STORE ID</p>
                <p className="text-gray-900 text-xs break-all mt-1 font-mono">
                  {store._id}
                </p>
              </div>
            </div>
          </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Product</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-700">Price</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Stock</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Manufacturer</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length > 0 ? (
                      products.map((product) => (
                        <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="relative w-8 h-8 rounded overflow-hidden bg-gray-100 shrink-0">
                                <Image
                                  src={product.gallery.coverImageUrl || PLACEHOLDER_IMAGE}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                  onError={(e) => {
                                    const img = e.target as HTMLImageElement;
                                    img.src = PLACEHOLDER_IMAGE;
                                  }}
                                />
                              </div>
                              <span className="font-medium text-gray-900 truncate">{product.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded capitalize">
                              {product.category}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right text-gray-900 font-medium">
                            ₦{product.price.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              product.stock > 50 
                                ? "bg-green-100 text-green-700"
                                : product.stock > 0
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600 text-sm truncate">{product.manufacturer}</td>
                          <td className="py-3 px-4 text-gray-600 text-sm">
                            {new Date(product.dateAdded).toLocaleDateString("en-US", { 
                              month: "short", 
                              day: "numeric",
                              year: "2-digit"
                            })}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-8 px-4 text-center text-gray-500">
                          No products available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
