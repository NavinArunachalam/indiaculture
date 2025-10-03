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
  <div
    className="
      w-[calc(50%-4px)]
      sm:w-[calc(24%-1px)]
      px-1 
      bg-white rounded-lg shadow-md overflow-hidden relative
      h-[320px] sm:h-[360px] flex flex-col animate-pulse
    "
  >
    {/* Placeholder for badge */}
    <div className="absolute top-2 left-0 bg-gray-200 h-6 w-16 rounded-r"></div>

    {/* Placeholder for image */}
    <div className="flex items-center justify-center h-28 sm:h-44 bg-gray-200"></div>

    {/* Content area */}
    <div className="p-2 sm:p-3 flex flex-col flex-1 overflow-hidden min-h-0">
      {/* Category name placeholder */}
      <div className="h-3 sm:h-4 bg-gray-200 rounded mb-1 sm:mb-2 w-3/4"></div>

      {/* Product name placeholder */}
      <div className="h-3 sm:h-4 bg-gray-200 rounded mb-1 sm:mb-2 w-4/5"></div>

      {/* Offer line placeholder */}
      <div className="h-3 sm:h-4 bg-gray-200 rounded mb-1 sm:mb-2 w-2/3"></div>

      {/* Description placeholder */}
      <div
        className="h-8 sm:h-11 bg-gray-200 rounded mb-1 sm:mb-2"
        style={{ maxHeight: "44px" }}
      ></div>

      {/* Stock status placeholder */}
      <div className="h-3 bg-gray-200 rounded mb-1 sm:mb-2 w-1/2"></div>

      {/* Price and buttons placeholder */}
      <div className="flex justify-between items-center mb-1 sm:mb-2">
        <div className="flex items-center gap-1">
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-12"></div>
          <div className="h-4 sm:h-5 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
          <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
        </div>
      </div>

      {/* Buy Now button placeholder */}
      <div className="h-8 sm:h-10 bg-gray-200 rounded-md mt-auto"></div>
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

    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch products, wishlist, and cart concurrently
        const [productsRes, wishlistRes, cartRes] = await Promise.allSettled([
          axios.get(`${API_URL}/api/products`, { signal: controller.signal }), // Removed category param
          axios.get(`${API_URL}/api/wishlist`, {
            withCredentials: true,
            signal: controller.signal,
          }),
          axios.get(`${API_URL}/api/cart`, {
            withCredentials: true,
            signal: controller.signal,
          }),
        ]);

        // Handle products
        if (productsRes.status === "fulfilled") {
          const fetchedProducts = productsRes.value.data;
          console.log("API Products Response:", fetchedProducts);
          // Filter client-side like the previous version
          const hairCareProducts = Array.isArray(fetchedProducts)
            ? fetchedProducts.filter((p) => p.category?.name === "Hair Care")
            : [];
          console.log("Filtered Hair Care Products:", hairCareProducts);
          setProducts(hairCareProducts);
          // Optional: Cache products (commented out to avoid caching issues)
          // localStorage.setItem("hairCareProducts", JSON.stringify(hairCareProducts));
          // localStorage.setItem("hairCareProductsTime", Date.now().toString());
        } else {
          console.error("Products fetch failed:", productsRes.reason);
        }

        // Handle wishlist
        if (wishlistRes.status === "fulfilled") {
          const wishlistData = wishlistRes.value.data;
          console.log("Wishlist Response:", wishlistData);
          setWishlist(
            Array.isArray(wishlistData)
              ? wishlistData.map((item) => item.product?._id).filter(Boolean)
              : []
          );
        } else {
          console.log("Wishlist fetch skipped (user not logged in)");
        }

        // Handle cart
        if (cartRes.status === "fulfilled") {
          const cartData = cartRes.value.data;
          console.log("Cart Response:", cartData);
          setCart(
            Array.isArray(cartData.items)
              ? cartData.items.map((item) => item.product?._id).filter(Boolean)
              : []
          );
        } else {
          console.log("Cart fetch skipped (user not logged in)");
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Fetch error:", err.response?.data, err.message);
      } finally {
        setLoading(false);
      }
    };

    // Clear cache to ensure fresh data
    localStorage.removeItem("hairCareProducts");
    localStorage.removeItem("hairCareProductsTime");
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
        console.error("Wishlist error:", err);
        setWishlist(wishlist); // Revert optimistic update
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
        }));
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
        console.error("Cart error:", err);
        setCart(cart); // Revert optimistic update
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
          spaceBetween={8}
          slidesPerView={2}
          loop={true}
          grabCursor={true}
          breakpoints={{
            1280: { slidesPerView: 5, spaceBetween: 20 },
            1024: { slidesPerView: 5, spaceBetween: 20 },
            640: { slidesPerView: 5, spaceBetween: 20 },
            320: { slidesPerView: 2, spaceBetween: 10 },
          }}
          className="swiper-container"
        >
          {[...Array(5)].map((_, index) => (
            <SwiperSlide key={index} className="">
              <ProductCardSkeleton />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    );
  }

  if (!memoizedProducts.length) {
    console.log("No products to display, products array:", memoizedProducts);
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
        spaceBetween={8}
        slidesPerView={2}
        loop={true}
        grabCursor={true}
        breakpoints={{
          1280: { slidesPerView: 5, spaceBetween: 20 },
          1024: { slidesPerView: 5, spaceBetween: 20 },
          640: { slidesPerView: 5, spaceBetween: 20 },
          320: { slidesPerView: 2, spaceBetween: 10 },
        }}
        className="swiper-container"
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
              className="min-w-[150px]"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HairCare;