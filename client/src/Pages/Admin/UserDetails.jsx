import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Toastify from "toastify-js";

const API_URL = import.meta.env.VITE_API_URL;

const UserDetail = () => {
  const { id } = useParams(); // get userId from route
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/admin/users/${id}`, {
        withCredentials: true,
      });

      // ✅ The user object is nested inside res.data.user
      setUser(res.data.user);
    } catch (err) {
      Toastify({
        text: err.response?.data?.message || "Failed to load user details",
        duration: 2500,
        gravity: "bottom",
        position: "center",
        backgroundColor: "#dc2626",
      }).showToast();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading user...</div>;
  if (!user) return <div className="text-center py-10">User not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-['Inter']">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">User Details</h1>

        <div className="space-y-4">
          <div>
            <span className="font-medium text-gray-700">Name:</span> {user.name}
          </div>
          <div>
            <span className="font-medium text-gray-700">Email:</span> {user.email}
          </div>
          <div>
            <span className="font-medium text-gray-700">Mobile:</span> {user.mobile}
          </div>
          <div>
            <span className="font-medium text-gray-700">Address:</span> {user.address}
          </div>
          <div>
            <span className="font-medium text-gray-700">City:</span> {user.city}
          </div>
          <div>
            <span className="font-medium text-gray-700">Pin Code:</span> {user.pincode}
          </div>
          <div>
            <span className="font-medium text-gray-700">State:</span> {user.state}
          </div>
          <div>
            <span className="font-medium text-gray-700">Staff:</span>{" "}
            {user.is_staff ? "Yes" : "No"}
          </div>
          <div>
            <span className="font-medium text-gray-700">Active:</span>{" "}
            {user.is_active ? "Yes" : "No"}
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Link
            to="/admin/customers"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
