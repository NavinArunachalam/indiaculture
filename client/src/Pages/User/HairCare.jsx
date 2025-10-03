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

// Skeleton loader component
const ProductCardSkeleton = () => (
  <div className="w-[150px] h-[320px] bg-white rounded-lg shadow flex flex-col animate-pulse">
    <div className="w-full h-[150px] bg-gray-200 rounded-t-lg"></div>
    <div className="p-3 flex flex-col flex-grow">
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 bg-gray-200 rounded mb-1"></div>
      <div className="h-3 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const HairCare = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [toggling, setToggling] = useState({ wishlist: {}, cart: {} });

  useEffect(() => {
    const controller = new AbortController();

    // Check localStorage for cached data
    const cachedProducts = localStorage.getItem("hairCareProducts");
    const cacheTime = localStorage.getItem("hairCareProductsTime");
    if (cachedProducts && cacheTime && Date.now() - parseInt(cacheTime) < 3600000) {
      try {
        const parsedProducts = JSON.parse(cachedProducts);
        if (Array.isArray(parsedProducts)) {
          setProducts(parsedProducts);
          setLoading(false);
        }
      } catch (err) {
        console.error("Invalid cached products:", err);
        localStorage.removeItem("hairCareProducts");
        localStorage.removeItem("hairCareProductsTime");
      }
    }

    const fetchData = async () => {
      try {
        const [productsRes, wishlistRes, cartRes] = await Promise.allSettled([
          axios.get(`${API_URL}/api/products`, {
            signal: controller.signal,
            params: { category: "Hair Care" },
            headers: { "If-Modified-Since": cacheTime || "" },
          }),
          axios.get(`${API_URL}/api/wishlist`, {
            withCredentials: true,
            signal: controller.signal,
          }),
          axios.get(`${API_URL}/api/cart`, {
            withCredentials: true,
            signal: controller.signal,
          }),
        ]);

        if (productsRes.status === "fulfilled") {
          const hairCareProducts = productsRes.value.data.filter(
            (p) => p.category?.name === "Hair Care"
          );
          if (
            JSON.stringify(hairCareProducts) !==
            JSON.stringify(JSON.parse(cachedProducts || "[]"))
          ) {
            setProducts(hairCareProducts);
            localStorage.setItem("hairCareProducts", JSON.stringify(hairCareProducts));
            localStorage.setItem("hairCareProductsTime", Date.now());
          }
        } else if (productsRes.status === "rejected" && productsRes.reason.response?.status === 304) {
          console.log("Products not modified, using cache");
        }

        if (wishlistRes.status === "fulfilled") {
          setWishlist(wishlistRes.value.data.map((item) => item.product._id));
        } else {
          console.log("Wishlist fetch skipped");
        }

        if (cartRes.status === "fulfilled") {
          setCart(cartRes.value.data.items.map((item) => item.product._id));
        } else {
          console.log("Cart fetch skipped");
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, []);

  const toggleWishlist = useCallback(
    debounce(async (productId) => {
      setToggling((prev) => ({
        ...prev,
        wishlist: { ...prev.wishlist, [productId]: true },
      }));
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
            duration: 2000,
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
            duration: 2000,
            gravity: "bottom",
            position: "center",
            backgroundColor: "#16a34a",
            className: "toastify-mobile",
          }).showToast();
        }
      } catch (err) {
        console.error(err);
        setWishlist(wishlist);
        Toastify({
          text: "Please login to manage wishlist",
          duration: 2000,
          gravity: "bottom",
          position: "center",
          backgroundColor: "#dc2626",
          className: "toastify-mobile",
        }).showToast();
      } finally {
        setToggling((prev) => ({
          ...prev,
          wishlist: { ...prev.wishlist, [productId]: false },
        }));
      }
    }, 300),
    [wishlist]
  );

  const toggleCart = useCallback(
    debounce(async (productId) => {
      setToggling((prev) => ({
        ...prev,
        cart: { ...prev.cart, [productId]: true },
      }));
      const product = products.find((p) => p._id === productId);
      if (product?.stock === 0) {
        Toastify({
          text: "Product is out of stock",
          duration: 2000,
          gravity: "bottom",
          position: "center",
          backgroundColor: "#dc2626",
          className: "toastify-mobile",
        }).showToast();
        setToggling((prev) => ({
          ...prev,
          cart: { ...prev.cart, [productId]: false },
        });
        return;
      }

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
            duration: 2000,
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
            duration: 2000,
            gravity: "bottom",
            position: "center",
            backgroundColor: "#16a34a",
            className: "toastify-mobile",
          }).showToast();
        }
      } catch (err) {
        console.error(err);
        setCart(cart);
        Toastify({
          text: "Please login to manage cart",
          duration: 2000,
          gravity: "bottom",
          position: "center",
          backgroundColor: "#dc2626",
          className: "toastify-mobile",
        }).showToast();
      } finally {
        setToggling((prev) => ({
          ...prev,
          cart: { ...prev.cart, [productId]: false },
        }));
      }
    }, 300),
    [cart, products]
  );

  const memoizedProducts = useMemo(() => products, [products]);

  if (loading) {
    return (
      <div className="px-4 py-10">
        <h2 className="text-center text-2xl font-bold mb-8 text-green-900">
          Recommended Hair Care Solutions
        </h2>
        <Swiper
          modules={[Navigation]}
          spaceBetween={6}
          slidesPerView={2.2}
          loop={false}
          grabCursor={true}
          navigation
          breakpoints={{
            1280: { slidesPerView: 5, spaceBetween: 12 },
            1024: { slidesPerView: 4, spaceBetween: 10 },
            640: { slidesPerView: 3, spaceBetween: 8 },
            320: { slidesPerView: 2.2, spaceBetween: 6 },
          }}
          className="px-1.5"
        >
          {[...Array(5)].map((_, index) => (
            <SwiperSlide key={index} className="flex items-center justify-center">
              <ProductCardSkeleton />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  }

  if (!memoizedProducts.length) {
    return (
      <div className="text-center py-10 text-gray-500 text-lg">
        No Hair Care Products Available
      </div>
    );
  }

  return (
    <div className="px-4 py-10">
      <h2 className="text-center text-2xl font-bold mb-8 text-green-900">
        Recommended Hair Care Solutions
      </h2>
      <Swiper
        modules={[Navigation]}
        spaceBetween={6}
        slidesPerView={2.2}
        loop={false}
        grabCursor={true}
        navigation
        breakpoints={{
          1280: { slidesPerView: 5, spaceBetween: 12 },
          1024: { slidesPerView: 4, spaceBetween: 10 },
          640: { slidesPerView: 3, spaceBetween: 8 },
          320: { slidesPerView: 2.2, spaceBetween: 6 },
        }}
        className="px-1.5"
      >
        {memoizedProducts.map((product) => (
          <SwiperSlide key={product._id} className="flex items-center justify-center">
            <ProductCard
              product={product}
              isWished={wishlist.includes(product._id)}
              inCart={cart.includes(product._id)}
              isWishlistToggling={toggling.wishlist[product._id] || false}
              isCartToggling={toggling.cart[product._id] || false}
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