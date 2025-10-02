import React from "react";
import "./EmptyCart.css"; // keep styles separate for clarity

const EmptyCart = () => {
  return (
    <div className="preloader">
      <svg
        className="cart"
        role="img"
        aria-label="Shopping cart line animation"
        viewBox="0 0 128 128"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="8"
        >
          {/* Static track */}
          <g className="cart__track">
            <polyline points="4,4 21,4 26,22 124,22 112,64 35,64 39,80 106,80" />
            <circle cx="43" cy="111" r="13" />
            <circle cx="102" cy="111" r="13" />
          </g>
          {/* Animated lines & wheels */}
          <g className="cart__lines">
            <polyline
              className="cart__top"
              points="4,4 21,4 26,22 124,22 112,64 35,64 39,80 106,80"
            />
            <g className="cart__wheel1">
              <circle className="cart__wheel-stroke" cx="43" cy="111" r="13" />
            </g>
            <g className="cart__wheel2">
              <circle className="cart__wheel-stroke" cx="102" cy="111" r="13" />
            </g>
          </g>
        </g>
      </svg>
      <div className="preloader__text">
        <p className="preloader__msg">Your cart is empty…</p>
        <p className="preloader__msg preloader__msg--last">Nothing to show here.</p>
      </div>
    </div>
  );
};

export default EmptyCart;
