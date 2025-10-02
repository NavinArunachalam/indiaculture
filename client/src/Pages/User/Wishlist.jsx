import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const API_URL = import.meta.env.VITE_API_URL;

const Wishlist = () => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/wishlist`, {
          withCredentials: true,
        });
        setWishlistProducts(res.data.map((item) => item.product));
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setWishlistProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  // Remove from wishlist
  const handleRemove = async (productId) => {
    try {
      await axios.delete(`${API_URL}/api/wishlist/${productId}`, {
        withCredentials: true,
      });
      setWishlistProducts((prev) => prev.filter((p) => p._id !== productId));

      Toastify({
        text: "Removed from Wishlist",
        duration: 2000,
        gravity: "bottom",
        position: "center",
        backgroundColor: "#dc2626",
      }).showToast();
    } catch (error) {
      console.error("Error removing wishlist item:", error);
    }
  };

  if (loading) return <div className="text-center py-10">Loading wishlist...</div>;
  if (!wishlistProducts.length)
    return (
      <h2 className="text-center text-lg sm:text-xl font-semibold text-gray-500 py-10">
        Your wishlist is empty 💔
      </h2>
    );

  return (
    <div className="px-1 sm:px-4">
      <h2 className="text-center text-xl sm:text-2xl font-bold mb-8 relative after:content-[''] after:block after:w-16 after:h-1 after:bg-green-600 after:mx-auto after:mt-2 after:rounded">
        My Wishlist
      </h2>

      <div className="flex flex-wrap gap-2 sm:gap-2">
        {wishlistProducts.map((product) => (
          <div
            key={product._id}
            className="
              w-[calc(50%-4px)]
              sm:w-[calc(19%-1px)]
              px-1 
              bg-white rounded-lg shadow-md overflow-hidden relative
              transition-transform duration-300 hover:-translate-y-1
            "
          >
            {/* Badge if exists */}
            {product.badge && (
              <div className="absolute top-2 left-0 bg-green-600 text-white px-2 sm:px-3 py-1 text-xs font-bold rounded-r">
                {product.badge}
              </div>
            )}

            <Link to={`/productdetails/${product._id}`}>
              <div className="flex items-center justify-center h-28 sm:h-44 bg-gray-100 overflow-hidden">
                <img
                  src={product.images?.[0]?.url || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>

            <div className="p-2 sm:p-3 overflow-hidden">
             
              <h4 className="my-1 sm:my-2 text-xs sm:text-sm truncate text-gray-800">
                {product.name}
              </h4>

              {product.offer_line && (
                <div className="text-green-600 font-semibold text-xs sm:text-sm mb-1 sm:mb-2 truncate">
                  {product.offer_line} Launch offer
                </div>
              )}

              <p className="text-xs text-gray-600 mb-1 sm:mb-2 line-clamp-2">
                {product.description}
              </p>

            

              <div className="flex justify-between items-center">
                <div className="text-sm sm:text-base text-green-600 font-bold">
                  {product.old_price && (
                    <small className="text-xs text-gray-500 line-through mr-1">
                      ₹{product.old_price}
                    </small>
                  )}
                  ₹{product.new_price}
                </div>

                {/* Only delete button */}
                <button
                  onClick={() => handleRemove(product._id)}
                  className="bg-transparent border-none cursor-pointer"
                  title="Remove from Wishlist"
                >
                  <i className="fa fa-trash text-red-600 hover:text-red-800 text-lg sm:text-xl "></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
