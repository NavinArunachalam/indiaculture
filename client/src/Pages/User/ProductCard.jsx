import React from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";

const ProductCard = React.memo(
  ({ product, isWished, inCart, isWishlistToggling, isCartToggling, toggleWishlist, toggleCart }) => {
    return (
      <article className="w-[150px] h-[320px] bg-white rounded-lg shadow flex flex-col overflow-hidden">
        {/* Best Sell Badge */}
        {product.is_bestsell && (
          <div className="absolute top-2 left-0 bg-green-600 text-white px-2 py-1 text-xs font-bold rounded-r">
            Best Sell
          </div>
        )}

        {/* Image Container */}
        <Link to={`/productdetails/${product._id}`} className="block w-full h-[150px] bg-gray-100">
          <img
            src={product.images?.[0]?.url || "/placeholder.jpg"}
            alt={product.name || "Hair care product"}
            className="w-full h-full object-cover object-center"
            loading="lazy"
          />
        </Link>

        {/* Content Container */}
        <div className="p-3 flex flex-col flex-grow">
          {/* Category */}
          <span className="text-xs text-gray-500 uppercase font-semibold truncate">
            {product.category?.name || "Hair Care"}
          </span>

          {/* Product Name */}
          <h4 className="my-1 text-sm font-semibold truncate">
            <Link
              to={`/productdetails/${product._id}`}
              className="text-gray-800 no-underline hover:text-green-600"
            >
              {product.name}
            </Link>
          </h4>

          {/* Offer Line */}
          {product.offer_line && (
            <div className="text-green-600 font-semibold text-xs truncate">
              {product.offer_line}
            </div>
          )}

          {/* Description */}
          <p className="text-xs text-gray-700  truncate">
            {product.description || "No description available"}
          </p>

          {/* Price and Actions */}
          <div className="mt-auto flex justify-between items-center">
            <div className="text-base text-green-600 font-bold">
              {product.old_price && (
                <small className="text-xs text-gray-500 line-through mr-1">
                  ₹{product.old_price}
                </small>
              )}
              ₹{product.new_price}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleWishlist(product._id)}
                disabled={isWishlistToggling}
                className="bg-transparent border-none disabled:opacity-50"
                aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
              >
                {isWished ? (
                  <FaHeart className="text-green-800 text-base" />
                ) : (
                  <FaRegHeart className="text-gray-400 text-base hover:text-green-800" />
                )}
              </button>
              <button
                onClick={() => toggleCart(product._id)}
                disabled={isCartToggling || product.stock === 0}
                className="bg-transparent border-none disabled:opacity-50"
                aria-label={inCart ? "Remove from cart" : "Add to cart"}
              >
                <FaShoppingCart
                  className={`text-base ${inCart ? "text-green-800" : "text-gray-400 hover:text-green-800"}`}
                />
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }
);

export default ProductCard;