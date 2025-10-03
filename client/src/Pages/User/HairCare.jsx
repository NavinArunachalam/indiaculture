import React, { useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import axios from "axios";
import Toastify from "toastify-js";
import "swiper/css";
import "swiper/css/navigation";
import "toastify-js/src/toastify.css";
import ProductCard from "./ProductCard";

const API_URL = import.meta.env.VITE_API_URL;

const HairCare = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productsRes = await axios.get(`${API_URL}/api/products`);
        const hairCareProducts = productsRes.data.filter(
          (p) => p.category?.name === "Hair Care"
        );
        setProducts(hairCareProducts);

        try {
          const wishlistRes = await axios.get(`${API_URL}/api/wishlist`, {
            withCredentials: true,
          });
          setWishlist(wishlistRes.data.map((item) => item.product._id));
        } catch {
          console.log("Wishlist fetch skipped");
        }

        try {
          const cartRes = await axios.get(`${API_URL}/api/cart`, {
            withCredentials: true,
          });
          setCart(cartRes.data.items.map((item) => item.product._id));
        } catch {
          console.log("Cart fetch skipped");
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Use useCallback to prevent re-creations on every render
  const toggleWishlist = useCallback(async (productId) => {
    const optimistic = wishlist.includes(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];
    setWishlist(optimistic);

    try {
      if (wishlist.includes(productId)) {
        await axios.delete(`${API_URL}/api/wishlist/${productId}`, { withCredentials: true });
        Toastify({
          text: "Removed from Wishlist",
          duration: 2000,
          gravity: "bottom",
          position: "center",
          backgroundColor: "#dc2626",
        }).showToast();
      } else {
        await axios.post(`${API_URL}/api/wishlist`, { productId }, { withCredentials: true });
        Toastify({
          text: "Added to Wishlist",
          duration: 2000,
          gravity: "bottom",
          position: "center",
          backgroundColor: "#16a34a",
        }).showToast();
      }
    } catch (err) {
      console.error(err);
      setWishlist(wishlist); // revert if failed
      alert("Please login to manage wishlist");
    }
  }, [wishlist]);

  const toggleCart = useCallback(async (productId) => {
    const optimistic = cart.includes(productId)
      ? cart.filter((id) => id !== productId)
      : [...cart, productId];
    setCart(optimistic);

    try {
      if (cart.includes(productId)) {
        await axios.delete(`${API_URL}/api/cart/${productId}`, { withCredentials: true });
        Toastify({
          text: "Removed from Cart",
          duration: 2000,
          gravity: "bottom",
          position: "center",
          backgroundColor: "#dc2626",
        }).showToast();
      } else {
        await axios.post(`${API_URL}/api/cart`, { productId, quantity: 1 }, { withCredentials: true });
        Toastify({
          text: "Added to Cart",
          duration: 2000,
          gravity: "bottom",
          position: "center",
          backgroundColor: "#16a34a",
        }).showToast();
      }
    } catch (err) {
      console.error(err);
      setCart(cart); // revert if failed
      alert("Please login to manage cart");
    }
  }, [cart]);

  if (loading) return <div className="text-center py-10 text-gray-600 text-lg">Loading Hair Care Products...</div>;
  if (!products.length) return <div className="text-center py-10 text-gray-500 text-lg sm:text-xl">No Hair Care Products Available</div>;

  return (
    <div className="px-2 sm:px-4 py-10">
      <h2 className="text-center text-2xl sm:text-4xl font-bold mb-10 relative text-green-900 font-[times] ">
        Recommended Hair Care Solution
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
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <ProductCard
              product={product}
              isWished={wishlist.includes(product._id)}
              inCart={cart.includes(product._id)}
              toggleWishlist={toggleWishlist}
              toggleCart={toggleCart}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HairCare;
