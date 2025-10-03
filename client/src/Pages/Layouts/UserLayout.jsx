// src/layouts/UserLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer";
import Whatsapp from "./Whatsapp";
const UserLayout = () => {
  return (
    <div className="user-layout">
      <Navbar />
      <main style={{ minHeight: "80vh", padding: "1rem" }}>
        <Outlet />
      </main>
        <Whatsapp />
      <Footer />
    

    </div>
  );
};

export default UserLayout;
