import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import "./BestSellingProduct.css";

const API_URL = import.meta.env.VITE_API_URL;

const BestSellingProduct = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Fetch categories
        const catRes = await axios.get(`${API_URL}/api/categories`);
        const allCategories = catRes.data.map((c) => ({ _id: c._id, name: c.name }));
        setCategories([{ _id: "all", name: "All Products" }, ...allCategories]);

        // ✅ Fetch products
        const prodRes = await axios.get(`${API_URL}/api/products`);
        const bestSellingProducts = prodRes.data.filter((p) => p.is_bestsell);
        setProducts(bestSellingProducts);

        // ✅ Fetch cart (optional: to highlight products already in cart)
        try {
          const cartRes = await axios.get(`${API_URL}/api/cart`, { withCredentials: true });
          setCart(cartRes.data.items.map((item) => item.product._id));
        } catch {
          console.log("Cart fetch skipped (user not logged in)");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Filter products by category
  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category && p.category._id === selectedCategory && p.is_bestsell);

  // ✅ Add to Cart
  const handleAddToCart = async (productId) => {
    try {
      if (cart.includes(productId)) {
        Toastify({
          text: "Product already in cart",
          duration: 2000,
          gravity: "bottom",
          position: "center",
          backgroundColor: "#f59e0b",
        }).showToast();
        return;
      }

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
    } catch (err) {
      console.error("Error adding to cart:", err);
      Toastify({
        text: "Please login to add to cart",
        duration: 2000,
        gravity: "bottom",
        position: "center",
        backgroundColor: "#dc2626",
      }).showToast();
    }
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <main className="shop-container">
      {/* Header */}
      <div className="shop-header">
        <h1 className="col-span-2 text-center mb-3 font-[times] text-[#2e5939] leading-[1.08] font-bold capitalize">
          Best Selling Products
        </h1>
        <p>
          Transform your self-care routine with our carefully curated selection
          of skin, hair, and wellness products.
        </p>
      </div>

      {/* Categories */}
      <div className="categories">
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setSelectedCategory(cat._id)}
            className={`category-button ${selectedCategory === cat._id ? "active" : ""}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <Link to={`/productdetails/${product._id}`}>
                <div className="product-image">
                  <img
                    src={product.images?.[0]?.url}
                    alt={product.name}
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />
                </div>
              </Link>
              <div className="product-details">
                <h2 className="product-name">{product.name}</h2>
                {product.offer_line && (
                  <span className="offer-badge">{product.offer_line} Launch Offer</span>
                )}
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <div className="price-box">
                    <span className="old-price">₹{product.old_price}</span>
                    <span className="current-price">₹{product.new_price}</span>
                  </div>
                  <button
                    className="add-to-cart"
                    onClick={() => handleAddToCart(product._id)}
                  >
                    {cart.includes(product._id) ? "In Cart" : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-products">No Products Available</p>
        )}
      </div>
    </main>
  );
};

export default BestSellingProduct;