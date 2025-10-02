
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import axios from "axios";
import Toastify from "toastify-js";
import "swiper/css";
import "swiper/css/navigation";
import "toastify-js/src/toastify.css";

const API_URL = import.meta.env.VITE_API_URL;

const SkinCare = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/products`);
        const faceCareProducts = res.data.filter(
          (product) => product.category?.name === "Face Care"
        );
        setProducts(faceCareProducts);

        try {
          const wishlistRes = await axios.get(`${API_URL}/api/wishlist`, {
            withCredentials: true,
          });
          setWishlist(wishlistRes.data.map((item) => item.product._id));
        } catch {
          console.log("Wishlist skipped (user not logged in)");
        }

        try {
          const cartRes = await axios.get(`${API_URL}/api/cart`, {
            withCredentials: true,
          });
          setCart(cartRes.data.items.map((item) => item.product._id));
        } catch {
          console.log("Cart skipped (user not logged in)");
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleWishlist = async (productId) => {
    try {
      if (wishlist.includes(productId)) {
        await axios.delete(`${API_URL}/api/wishlist/${productId}`, {
          withCredentials: true,
        });
        setWishlist((prev) => prev.filter((id) => id !== productId));
        Toastify({
          text: "Removed from Wishlist",
          duration: 2000,
          gravity: "bottom",
          position: "center",
          backgroundColor: "#dc2626",
        }).showToast();
      } else {
        await axios.post(
          `${API_URL}/api/wishlist`,
          { productId },
          { withCredentials: true }
        );
        setWishlist((prev) => [...prev, productId]);
        Toastify({
          text: "Added to Wishlist",
          duration: 2000,
          gravity: "bottom",
          position: "center",
          backgroundColor: "#16a34a",
        }).showToast();
      }
    } catch (err) {
      console.error("Wishlist update failed:", err);
      alert("Please login to manage wishlist");
    }
  };

  const toggleCart = async (productId) => {
    try {
      if (cart.includes(productId)) {
        await axios.delete(`${API_URL}/api/cart/${productId}`, {
          withCredentials: true,
        });
        setCart((prev) => prev.filter((id) => id !== productId));
        Toastify({
          text: "Removed from Cart",
          duration: 2000,
          gravity: "bottom",
          position: "center",
          backgroundColor: "#dc2626",
        }).showToast();
      } else {
        await axios.post(
          `${API_URL}/api/cart`,
          { productId, quantity: 1 },
          { withCredentials: true }
        );
        setCart((prev) => [...prev, productId]);
        Toastify({
          text: "Added to Cart",
          duration: 2000,
          gravity: "bottom",
          position: "center",
          backgroundColor: "#16a34a",
        }).showToast();
      }
    } catch (err) {
      console.error("Cart update failed:", err);
      alert("Please login to manage cart");
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-600 text-lg">Loading Face Care Products...</div>;
  if (!products.length) return <div className="text-center py-10 text-gray-500 text-lg sm:text-xl">No Face Care Products Available</div>;

  return (
    <div className="px-2 sm:px-4 py-10">
      <h2 className="text-center text-2xl sm:text-4xl font-bold mb-10 relative text-green-900 font-[times] ">
        Recommended Face Care Solution
      </h2>

      <Swiper
        modules={[Navigation]}
        spaceBetween={8}
        slidesPerView={2}
        loop={true}
        grabCursor={false}
        breakpoints={{
          640: { slidesPerView: 5, spaceBetween: 20 },
        }}
        className="swiper-container"
      >
        {products.map((product) => {
          const isWished = wishlist.includes(product._id);
          const inCart = cart.includes(product._id);

          return (
            <SwiperSlide key={product._id}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden relative transition-transform duration-300 hover:-translate-y-1">
                {product.is_bestsell && (
                  <div className="absolute top-2 left-0 bg-green-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-bold rounded-r">
                    Best Sell
                  </div>
                )}

                <Link to={`/productdetails/${product._id}`}>
                  <div className="flex items-center justify-center h-32 sm:h-48 bg-gray-100">
                    <img
                      src={product.images?.[0]?.url || "/placeholder.jpg"}
                      alt={product.name}
                      className="max-w-full max-h-24 sm:max-h-44 object-contain"
                    />
                  </div>
                </Link>

                <div className="p-3 sm:p-4">
                  <span className="text-xs sm:text-sm text-gray-500 uppercase font-bold">
                    {product.category?.name || "Face Care"}
                  </span>
                  <h4 className="my-2 sm:my-3 text-sm sm:text-base">
                   
                      {product.name}
                   
                  </h4>
                  {product.offer_line && (
                    <div className="text-green-600 font-semibold text-xs sm:text-sm mb-2">
                      {product.offer_line} Launch Offer
                    </div>
                  )}
                  <p className="text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3 overflow-hidden line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex justify-between items-center">
                    <div className="text-base sm:text-lg text-green-600 font-bold">
                      {product.old_price && (
                        <small className="text-xs sm:text-sm text-gray-500 line-through mr-1 sm:mr-2">
                          ₹{product.old_price}
                        </small>
                      )}
                      ₹{product.new_price}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => toggleWishlist(product._id)}
                        className="bg-transparent border-none cursor-pointer"
                      >
                        {isWished ? (
                          <FaHeart className="text-green-800 text-xl sm:text-lg" />
                        ) : (
                          <FaRegHeart className="text-gray-400   text-xl sm:text-lg hover:text-green-800 transition" />
                        )}
                      </button>
                      <button
                        onClick={() => toggleCart(product._id)}
                        className="bg-transparent border-none cursor-pointer"
                      >
                        <FaShoppingCart
                          className={`text-xl sm:text-lg ${
                            inCart
                              ? "text-green-800"
                              : "text-gray-400 transition"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default SkinCare;
