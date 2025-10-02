import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const API_URL = import.meta.env.VITE_API_URL;

const Product = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const selectedCategory = params.get("category") || "All";

  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/products`);
        setProducts(res.data);

        try {
          const wishlistRes = await axios.get(`${API_URL}/api/wishlist`, { withCredentials: true });
          setWishlist(wishlistRes.data.map((item) => item.product._id));
        } catch {}

        try {
          const cartRes = await axios.get(`${API_URL}/api/cart`, { withCredentials: true });
          setCart(cartRes.data.items.map((item) => item.product._id));
        } catch {}
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
        await axios.delete(`${API_URL}/api/wishlist/${productId}`, { withCredentials: true });
        setWishlist((prev) => prev.filter((id) => id !== productId));
      } else {
        await axios.post(`${API_URL}/api/wishlist`, { productId }, { withCredentials: true });
        setWishlist((prev) => [...prev, productId]);
      }
    } catch {
      alert("Please login to manage wishlist");
    }
  };

  const toggleCart = async (productId) => {
    const product = products.find((p) => p._id === productId);
    if (product.stock === 0) {
      Toastify({
        text: "Product is out of stock",
        duration: 2000,
        gravity: "bottom",
        position: "center",
        backgroundColor: "#dc2626",
      }).showToast();
      return;
    }

    try {
      if (cart.includes(productId)) {
        await axios.delete(`${API_URL}/api/cart/${productId}`, { withCredentials: true });
        setCart((prev) => prev.filter((id) => id !== productId));
        Toastify({
          text: "Removed from Cart",
          duration: 2000,
          gravity: "bottom",
          position: "center",
          backgroundColor: "#dc2626",
        }).showToast();
      } else {
        await axios.post(`${API_URL}/api/cart`, { productId, quantity: 1 }, { withCredentials: true });
        setCart((prev) => [...prev, productId]);
        Toastify({
          text: "Added to Cart",
          duration: 2000,
          gravity: "bottom",
          position: "center",
          backgroundColor: "#16a34a",
        }).showToast();
      }
    } catch {
      alert("Please login to manage cart");
    }
  };

  const handleBuyNow = async (productId) => {
    const product = products.find((p) => p._id === productId);
    if (product.stock === 0) {
      Toastify({
        text: "Product is out of stock",
        duration: 2000,
        gravity: "bottom",
        position: "center",
        backgroundColor: "#dc2626",
      }).showToast();
      return;
    }

    try {
      const userRes = await axios.get(`${API_URL}/api/user`, { withCredentials: true });
      const user = userRes.data;

      if (!user || !user._id) {
        Toastify({
          text: "Please login to buy products",
          duration: 2000,
          gravity: "bottom",
          position: "center",
          backgroundColor: "#dc2626",
        }).showToast();
        navigate("/login");
        return;
      }

      const addrFields = [user.name, user.mobile, user.address, user.city, user.state, user.pincode];
      const hasAddress = addrFields.every((f) => f && f.trim()) && /^[0-9]{10}$/.test(user.mobile);

      if (!hasAddress) {
        Toastify({
          text: !/^[0-9]{10}$/.test(user.mobile) ? "Please enter a valid 10-digit phone number" : "Please complete your address and phone number before placing the order",
          duration: 2500,
          gravity: "bottom",
          position: "center",
          backgroundColor: "#dc2626",
        }).showToast();
        navigate("/address", { state: { productId, quantity: 1 } });
        return;
      }

      navigate("/revieworder", { 
        state: { 
          productId, 
          quantity: 1,
          address: {
            name: user.name,
            phone: user.mobile,
            address: user.address,
            city: user.city,
            state: user.state,
            pincode: user.pincode,
          }
        } 
      });
    } catch {
      Toastify({
        text: "Please login to buy products",
        duration: 2000,
        gravity: "bottom",
        position: "center",
        backgroundColor: "#dc2626",
      }).showToast();
      navigate("/login");
    }
  };

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category?.name === selectedCategory);

  if (loading) return <div className="text-center py-10">Loading products...</div>;

  return (
    <div className="overflow-visible px-2 sm:px-4">
      <h2 className="text-center text-2xl sm:text-3xl font-bold mb-10 relative after:content-[''] after:block after:w-16 after:h-1 after:bg-green-600 after:mx-auto after:mt-2 after:rounded">
        {selectedCategory === "All" ? "All Products" : selectedCategory}
      </h2>

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-500 text-lg sm:text-xl">
          No products available in this category.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2 sm:gap-5 px-2">
          {filteredProducts.map((product) => {
            const isWished = wishlist.includes(product._id);
            const inCart = cart.includes(product._id);

            return (
              <div
                key={product._id}
                className="
                  w-[calc(50%-4px)]      /* Two cards per row on mobile, adjusted for 2px gap */
                  sm:w-[calc(25%-15px)]   /* Four cards per row on sm screens, adjusted for 5px gap */
                  bg-white rounded-lg shadow-md overflow-hidden relative
                  transition-transform duration-300 hover:-translate-y-1
                "
              >
                {product.badge && (
                  <div className="absolute top-2 left-0 bg-green-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 text-xs font-bold rounded-r">
                    {product.badge}
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
                    {product.category?.name || "Unknown"}
                  </span>
                  <h4 className="my-2 sm:my-3 text-sm sm:text-base">
                    <a href="#" className="text-gray-800 no-underline hover:text-green-600 transition-colors">
                      {product.name}
                    </a>
                  </h4>
                  {product.offer_line && (
                    <div className="text-green-600 font-semibold text-xs sm:text-sm mb-2">
                      {product.offer_line} Launch Offer
                    </div>
                  )}
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="text-xs sm:text-sm text-red-600 font-semibold mb-2">
                    {product.stock === 0 ? "Out of Stock" : `In Stock: ${product.stock} units`}
                  </div>

                  <div className="flex justify-between items-center mb-2">
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
                          <FaHeart className="text-green-800 text-base sm:text-lg" />
                        ) : (
                          <FaRegHeart className="text-gray-400 text-base sm:text-lg hover:text-green-600 transition" />
                        )}
                      </button>
                      <button
                        onClick={() => toggleCart(product._id)}
                        className="bg-transparent border-none cursor-pointer"
                        disabled={product.stock === 0}
                      >
                        <FaShoppingCart
                          className={`text-base sm:text-lg ${
                            inCart ? "text-green-800" : product.stock === 0 ? "text-gray-400 cursor-not-allowed" : "text-gray-400 hover:text-green-600 transition"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <button
                    className="w-full mt-2 sm:mt-3 py-2 sm:py-2.5 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:bg-gray-500 disabled:cursor-not-allowed"
                    onClick={() => handleBuyNow(product._id)}
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? "Out of Stock" : "Buy Now"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Product;