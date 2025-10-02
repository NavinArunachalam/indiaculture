// src/layouts/UserLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer";   

const UserLayout = () => {
  return (
    <div className="user-layout">
      <Navbar />

      <main style={{ minHeight: "80vh", padding: "1rem" }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default UserLayout;
