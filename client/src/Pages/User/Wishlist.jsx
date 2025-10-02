import React, { useEffect, useState } from "react";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";
import "./Wishlist.css";

const API_URL = import.meta.env.VITE_API_URL;

const Wishlist = () => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/wishlist`, { withCredentials: true });
        setWishlistProducts(res.data.map(item => item.product));
      } catch (error) {
        console.error("Error fetching wishlist:", error);
        setWishlistProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  if (loading) return <p>Loading wishlist...</p>;
  if (!wishlistProducts.length) return <h2 className="section-title">Your wishlist is empty 💔</h2>;

  // Remove wishlist item
  async function handleRemove(productId) {
    try {
      await axios.delete(`${API_URL}/api/wishlist/${productId}`, { withCredentials: true });
      setWishlistProducts(prev => prev.filter(p => p._id !== productId));
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
  }

  return (
    <div className="wishlist-container">
      <h1 className="section-title">My Wishlist</h1>
      <div className="wishlist-grid">
        {wishlistProducts.map((product) => (
          <div className="product-card" key={product._id}>
            <div className="product-tumb">
              <img
                src={product.images?.[0]?.url || "https://via.placeholder.com/150"}
                alt={product.name}
              />
            </div>
            <div className="product-details">
              <span className="product-catagory">{product.category?.name}</span>
              <h4>{product.name}</h4>
              <p>{product.description}</p>
              <div className="product-bottom-details">
                <div className="product-price">
                  {product.old_price && <small>₹{product.old_price}</small>} ₹{product.new_price}
                </div>
                <div className="product-links">
                  <button
                    className="delete-btn"
                    onClick={() => handleRemove(product._id)}
                    title="Remove from Wishlist"
                  >
                    <i className="fa fa-trash text-red-600 hover:text-red-800 text-xl"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
