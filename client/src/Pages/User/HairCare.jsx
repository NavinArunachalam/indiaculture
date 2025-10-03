import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import axios from "axios";
import Toastify from "toastify-js";
import "swiper/css";
import "swiper/css/navigation";
import "toastify-js/src/toastify.css";
import ProductCard from "./ProductCard";

const API_URL = import.meta.env.VITE_API_URL;

// Simple debounce utility
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const HairCare = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [toggling, setToggling] = useState({}); // Track toggling state for buttons

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setLoading(true);
        const productsRes = await axios.get(`${API_URL}/api/products`, {
          signal: controller.signal,
        });
        setProducts(productsRes.data);

        try {
          const wishlistRes = await axios.get(`${API_URL}/api/wishlist`, {
            withCredentials: true,
            signal: controller.signal,
          });
          setWishlist(wishlistRes.data.map((item) => item.product._id));
        } catch {
          console.log("Wishlist fetch skipped");
        }

        try {
          const cartRes = await axios.get(`${API_URL}/api/cart`, {
            withCredentials: true,
            signal: controller.signal,
          });
          setCart(cartRes.data.items.map((item) => item.product._id));
        } catch {
          console.log("Cart fetch skipped");
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort(); // Cleanup on unmount
  }, []);

  // Memoize filtered products to avoid redundant filtering
  const hairCareProducts = useMemo(() => {
    return products.filter((p) => p.category?.name === "Hair Care");
  }, [products]);

  // Debounced toggleWishlist with optimistic updates and toggling state
  const toggleWishlist = useCallback(
    debounce(async (productId) => {
      setToggling((prev) => ({ ...prev, [productId]: true }));
      const optimistic = wishlist.includes(productId)
        ? wishlist.filter((id) => id !== productId)
        : [...wishlist, productId];
      setWishlist(optimistic);

      try {
        if (wishlist.includes(productId)) {
          await axios.delete(`${API_URL}/api/wishlist/${productId}`, {
            withCredentials: true,
          });
          Toastify({
            text: "Removed from Wishlist",
            duration: 1500, // Reduced for faster feedback
            gravity: "bottom",
            position: "center",
            backgroundColor: "#dc2626",
            className: "toastify-mobile",
          }).showToast();
        } else {
          await axios.post(
            `${API_URL}/api/wishlist`,
            { productId },
            { withCredentials: true }
          );
          Toastify({
            text: "Added to Wishlist",
            duration: 1500,
            gravity: "bottom",
            position: "center",
            backgroundColor: "#16a34a",
            className: "toastify-mobile",
          }).showToast();
        }
      } catch (err) {
        console.error(err);
        setWishlist(wishlist); // Revert if failed
        Toastify({
          text: "Please login to manage wishlist",
          duration: 1500,
          gravity: "bottom",
          position: "center",
          backgroundColor: "#dc2626",
          className: "toastify-mobile",
        }).showToast();
      } finally {
        setToggling((prev) => ({ ...prev, [productId]: false }));
      }
    }, 250), // 250ms debounce for faster response
    [wishlist]
  );

  // Debounced toggleCart with optimistic updates and toggling state
  const toggleCart = useCallback(
    debounce(async (productId) => {
      setToggling((prev) => ({ ...prev, [productId]: true }));
      const optimistic = cart.includes(productId)
        ? cart.filter((id) => id !== productId)
        : [...cart, productId];
      setCart(optimistic);

      try {
        if (cart.includes(productId)) {
          await axios.delete(`${API_URL}/api/cart/${productId}`, {
            withCredentials: true,
          });
          Toastify({
            text: "Removed from Cart",
            duration: 1500,
            gravity: "bottom",
            position: "center",
            backgroundColor: "#dc2626",
            className: "toastify-mobile",
          }).showToast();
        } else {
          await axios.post(
            `${API_URL}/api/cart`,
            { productId, quantity: 1 },
            { withCredentials: true }
          );
          Toastify({
            text: "Added to Cart",
            duration: 1500,
            gravity: "bottom",
            position: "center",
            backgroundColor: "#16a34a",
            className: "toastify-mobile",
          }).showToast();
        }
      } catch (err) {
        console.error(err);
        setCart(cart); // Revert if failed
        Toastify({
          text: "Please login to manage cart",
          duration: 1500,
          gravity: "bottom",
          position: "center",
          backgroundColor: "#dc2626",
          className: "toastify-mobile",
        }).showToast();
      } finally {
        setToggling((prev) => ({ ...prev, [productId]: false }));
      }
    }, 250), // 250ms debounce for faster response
    [cart]
  );

  if (loading) return <div className="text-center py-10 text-gray-600 text-lg">Loading Hair Care Products...</div>;
  if (!hairCareProducts.length) return <div className="text-center py-10 text-gray-500 text-lg sm:text-xl">No Hair Care Products Available</div>;

  return (
    <div className="px-2 sm:px-4 py-10">
      <h2 className="text-center text-2xl sm:text-4xl font-bold mb-10 relative text-green-900 font-[times]">
        Recommended Hair Care Solution
      </h2>

      <Swiper
        modules={[Navigation]}
        spaceBetween={8}
        slidesPerView={2}
        loop={false} // Disabled for better mobile performance
        grabCursor={true} // Enabled for better touch UX
        breakpoints={{
          640: { slidesPerView: 5, spaceBetween: 20 },
          320: { slidesPerView: 2, spaceBetween: 10 }, // Optimized for smaller screens
        }}
        className="swiper-container"
      >
        {hairCareProducts.map((product) => (
          <SwiperSlide key={product._id}>
            <ProductCard
              product={product}
              isWished={wishlist.includes(product._id)}
              inCart={cart.includes(product._id)}
              toggleWishlist={toggleWishlist}
              toggleCart={toggleCart}
              isToggling={toggling[product._id] || false} // Pass toggling state
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HairCare;