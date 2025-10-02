import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiBox } from "react-icons/fi";
import axios from "axios";

const AdminWishlist = () => {
  const [wishlistData, setWishlistData] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch wishlist from API
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/wishlist/all`, {
          withCredentials: true,
        });

        // Flatten grouped data
        const flattened = [];
        data.data.forEach((userGroup) => {
          userGroup.products.forEach((product) => {
            flattened.push({
              user: userGroup.user,
              product,
              addedDate: product.createdAt || new Date().toISOString(),
            });
          });
        });

        setWishlistData(flattened);
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [API_URL]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <p className="p-6 text-center">Loading wishlists...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiHeart className="text-purple-600" /> Wishlist Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              View products added to wishlists
            </p>
          </div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            {wishlistData.length} items
          </span>
        </div>
      </div>

      {/* Wishlist Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Added Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {wishlistData.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    {/* User */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Product */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={
                              item.product.images?.[0]?.url ||
                              "/api/placeholder/80/80"
                            }
                            alt={item.product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.product.category?.name ||
                              item.product.category ||
                              "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Added Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(item.addedDate)}
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">
                        ₹{item.product.new_price?.toLocaleString() || 0}
                      </span>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWishlist;
