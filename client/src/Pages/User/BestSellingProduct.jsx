
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import "./BestSellingProduct.css";

// API URL from environment variable
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
  <div className="product-card w-full max-w-[160px] sm:max-w-[200px] bg-white rounded-lg shadow-md flex flex-col animate-pulse">
    <div className="w-full h-40 sm:h-48 bg-gray-200"></div>
    <div className="p-2 sm:p-3 flex flex-col flex-grow">
      <div className="h-4 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 bg-gray-200 rounded mb-1"></div>
      <div className="h-3 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Memoized ProductCard component
const ProductCard = React.memo(({ product, inCart, isCartToggling, handleAddToCart }) => (
  <div
    className={`product-card w-full max-w-[160px] sm:max-w-[200px] bg-white rounded-lg shadow-md flex flex-col transition-transform duration-300 hover:-translate-y-1 ${
      isCartToggling ? "opacity-50" : ""
    }`}
  >
    <Link to={`/productdetails/${product._id}`}>
      <div className="product-image w-full h-40 sm:h-48 bg-gray-100 overflow-hidden">
        <img
          src={`${product.images?.[0]?.url || "/placeholder.png"}?w=160&format=webp`}
          alt={product.name}
          className="w-full h-full object-contain object-center"
          loading="lazy"
          onError={(e) => (e.target.src = "/placeholder.png")}
        />
      </div>
    </Link>
    <div className="product-details p-2 sm:p-3 flex flex-col flex-grow">
      <h2 className="product-name text-sm sm:text-base font-semibold truncate">{product.name}</h2>
      {product.offer_line && (
        <span className="offer-badge text-xs bg-green-100 text-green-800 rounded px-1 py-0.5">
          {product.offer_line} Launch Offer
        </span>
      )}
      <p className="product-description text-xs sm:text-sm text-gray-600 truncate">
        {product.description}
      </p>
      <div className="product-footer flex justify-between items-center mt-auto">
        <div className="price-box">
          <span className="old-price text-xs text-gray-500 line-through">
            ₹{product.old_price}
          </span>
          <span className="current-price text-sm font-bold">₹{product.new_price}</span>
        </div>
        <button
          className={`add-to-cart text-xs sm:text-sm px-2 py-1 rounded ${
            inCart ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          } text-white`}
          onClick={() => handleAddToCart(product._id)}
          disabled={isCartToggling}
        >
          {inCart ? "In Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  </div>
));

const BestSellingProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [cartToggling, setCartToggling] = useState({});

  useEffect(() => {
    const controller = new AbortController();

    // Check localStorage for cached data
    const cachedProducts = localStorage.getItem("bestSellingProducts");
    const cacheTime = localStorage.getItem("bestSellingProductsTime");
    if (cachedProducts && cacheTime && Date.now() - parseInt(cacheTime) < 3600000) {
      try {
        const parsedProducts = JSON.parse(cachedProducts);
        if (Array.isArray(parsedProducts)) {
          setProducts(parsedProducts);
          setLoading(false);
        }
      } catch (err) {
        console.error("Invalid cached products:", err);
        localStorage.removeItem("bestSellingProducts");
        localStorage.removeItem("bestSellingProductsTime");
      }
    }

    const fetchData = async () => {
      try {
        const [catRes, prodRes, cartRes] = await Promise.allSettled([
          axios.get(`${API_URL}/api/categories`, { signal: controller.signal }),
          axios.get(`${API_URL}/api/products`, {
            signal: controller.signal,
            params: { is_bestsell: true },
            headers: { "If-Modified-Since": cacheTime || "" },
          }),
          axios.get(`${API_URL}/api/cart`, {
            withCredentials: true,
            signal: controller.signal,
          }),
        ]);

        if (catRes.status === "fulfilled") {
          const allCategories = catRes.value.data.map((c) => ({ _id: c._id, name: c.name }));
          setCategories([{ _id: "all", name: "All Products" }, ...allCategories]);
        }

        if (prodRes.status === "fulfilled") {
          const bestSellingProducts = prodRes.value.data.filter((p) => p.is_bestsell);
          if (
            JSON.stringify(bestSellingProducts) !==
            JSON.stringify(JSON.parse(cachedProducts || "[]"))
          ) {
            setProducts(bestSellingProducts);
            localStorage.setItem("bestSellingProducts", JSON.stringify(bestSellingProducts));
            localStorage.setItem("bestSellingProductsTime", Date.now());
          }
        } else if (prodRes.status === "rejected" && prodRes.reason.response?.status === 304) {
          console.log("Products not modified, using cache");
        }

        if (cartRes.status === "fulfilled") {
          setCart(cartRes.value.data.items.map((item) => item.product._id));
        } else {
          console.log("Cart fetch skipped (user not logged in)");
        }
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, []);

  // Debounced handleAddToCart
  const handleAddToCart = useCallback(
    debounce(async (productId) => {
      setCartToggling((prev) => ({ ...prev, [productId]: true }));
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
        setCartToggling((prev) => ({ ...prev, [productId]: false }));
        return;
      }

      if (cart.includes(productId)) {
        Toastify({
          text: "Product already in cart",
          duration: 2000,
          gravity: "bottom",
          position: "center",
          backgroundColor: "#f59e0b",
          className: "toastify-mobile",
        }).showToast();
        setCartToggling((prev) => ({ ...prev, [productId]: false }));
        return;
      }

      const optimistic = [...cart, productId];
      setCart(optimistic);

      try {
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
      } catch (err) {
        console.error("Error adding to cart:", err);
        setCart(cart);
        Toastify({
          text: "Please login to add to cart",
          duration: 2000,
          gravity: "bottom",
          position: "center",
          backgroundColor: "#dc2626",
          className: "toastify-mobile",
        }).showToast();
      } finally {
        setCartToggling((prev) => ({ ...prev, [productId]: false }));
      }
    }, 300),
    [cart, products]
  );

  // Memoize filtered products
  const filteredProducts = useMemo(
    () =>
      selectedCategory === "all"
        ? products
        : products.filter(
            (p) => p.category && p.category._id === selectedCategory && p.is_bestsell
          ),
    [products, selectedCategory]
  );

  if (loading) {
    return (
      <main className="shop-container px-2 sm:px-4 py-10">
        <div className="shop-header">
          <h1 className="col-span-2 text-center mb-3 font-[times] text-[#2e5939] leading-[1.08] font-bold capitalize">
            Best Selling Products
          </h1>
          <p>
            Transform your self-care routine with our carefully curated selection
            of skin, hair, and wellness products.
          </p>
        </div>
        <div className="products-grid grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="w-full max-w-[160px] sm:max-w-[200px] mx-auto">
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="shop-container px-2 sm:px-4 py-10">
      <div className="shop-header">
        <h1 className="col-span-2 text-center mb-3 font-[times] text-[#2e5939] leading-[1.08] font-bold capitalize">
          Best Selling Products
        </h1>
        <p>
          Transform your self-care routine with our carefully curated selection
          of skin, hair, and wellness products.
        </p>
      </div>

      <div className="categories flex flex-wrap gap-2 justify-center mb-6">
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setSelectedCategory(cat._id)}
            className={`category-button px-3 py-1 rounded text-sm sm:text-base ${
              selectedCategory === cat._id
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="products-grid grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="w-full max-w-[160px] sm:max-w-[200px] mx-auto"
            >
              <ProductCard
                product={product}
                inCart={cart.includes(product._id)}
                isCartToggling={cartToggling[product._id] || false}
                handleAddToCart={handleAddToCart}
              />
            </div>
          ))
        ) : (
          <p className="no-products col-span-2 sm:col-span-4 text-center text-gray-500 text-lg">
            No Products Available
          </p>
        )}
      </div>
    </main>
  );
};

export default BestSellingProduct;