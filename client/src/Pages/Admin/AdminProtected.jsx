import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const AdminProtected = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // withCredentials ensures cookies (httpOnly JWT) are sent
        const res = await axios.get(`${API_URL}/api/admin/profile`, { withCredentials: true });

        if (res.data.admin) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading) return <div>Loading...</div>;

  // If admin, show protected routes, otherwise redirect to login
  return isAdmin ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AdminProtected;
