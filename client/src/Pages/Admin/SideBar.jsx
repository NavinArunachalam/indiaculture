import React from "react";
import { Link } from "react-router-dom";
import {
  FiHome,
  FiBox,
  FiList,
  FiShoppingCart,
  FiEdit,
  FiImage,
  FiVideo,
  FiUsers,
  FiStar,
  FiHeart,
  FiCode, // Icon for Procols (representing development)
  FiGlobe, // Icon for India Culture (representing culture)
} from "react-icons/fi";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen p-4 shadow-lg sticky right-0 top-0">
      {/* Header Section */}
      <div className="mb-6 px-4">
        {/* Company: Procols */}
        <div className="flex items-center justify-start gap-2 text-xs text-purple-300 uppercase tracking-wider">
          <FiCode className="text-purple-300 text-base " />
          <span className="">Procols</span>
        </div>

        {/* Admin Page: India Culture */}
        <div className="flex items-center justify-start gap-2 mt-2">
          <FiGlobe className="text-white text-xl" />
          <h1 className="text-lg font-bold text-white">India Culture</h1>
        </div>

        {/* Role */}
        <p className="text-sm text-gray-400 mt-1 pl-7">Super Admin</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {[
            { to: "/admin/dashboard", icon: FiHome, label: "Dashboard" },
            { to: "/admin/products", icon: FiBox, label: "Products" },
            { to: "/admin/categories", icon: FiList, label: "Categories" },
            { to: "/admin/orders", icon: FiShoppingCart, label: "Orders" },
            { to: "/admin/manageorders", icon: FiEdit, label: "Manage Orders" },
            { to: "/admin/hero", icon: FiImage, label: "Hero" },
            { to: "/admin/reels", icon: FiVideo, label: "Reels" },
            { to: "/admin/customers", icon: FiUsers, label: "Customers" },
            { to: "/admin/reviews", icon: FiStar, label: "Reviews" },
            { to: "/admin/wishlistadmin", icon: FiHeart, label: "Wishlist" },
            { to: "/admin/offers", icon: FiHeart, label: "Offers" },
          ].map((item, index) => (
            <li key={index}>
              <Link
                to={item.to}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-200 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200"
              >
                <item.icon className="text-lg" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;