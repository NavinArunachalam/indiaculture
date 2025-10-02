import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiCheck, FiX } from "react-icons/fi";
import axios from "axios";
import Toastify from "toastify-js";

const API_URL = import.meta.env.VITE_API_URL;

const CustomerDetails = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState("all");
  const [isStaffFilter, setIsStaffFilter] = useState("all");

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/admin/users`, {
        withCredentials: true,
      });

      const normalized = (res.data.users || res.data).map((u) => ({
        ...u,
        isStaff: u.is_staff,
        isActive: u.is_active,
      }));

      setCustomers(normalized);
    } catch (err) {
      Toastify({
        text: err.response?.data?.message || "Failed to load users",
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
    fetchCustomers();
  }, []);

  const filteredCustomers = customers
    .filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.mobile.includes(search)
    )
    .filter(
      (c) =>
        isActiveFilter === "all" ||
        (isActiveFilter === "yes" ? c.isActive : !c.isActive)
    )
    .filter(
      (c) =>
        isStaffFilter === "all" ||
        (isStaffFilter === "yes" ? c.isStaff : !c.isStaff)
    );

  if (loading) return <div className="text-center py-10">Loading users...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-['Inter'] text-lg">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <Link
            to="/admin/customers/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-md text-base font-medium transition-colors"
          >
            Add User
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by name, email, or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
          />
          <select
            value={isActiveFilter}
            onChange={(e) => setIsActiveFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="yes">Active</option>
            <option value="no">Inactive</option>
          </select>
          <select
            value={isStaffFilter}
            onChange={(e) => setIsStaffFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="yes">Staff</option>
            <option value="no">Non-Staff</option>
          </select>
        </div>

        {/* Customer Table */}
        <div className="border border-gray-200 rounded-md overflow-hidden text-base">
          {filteredCustomers.length > 0 ? (
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-4 border-b text-left">Name</th>
                  <th className="p-4 border-b text-left">Mobile</th>
                  <th className="p-4 border-b text-left">Email</th>
                  <th className="p-4 border-b text-center">Staff</th>
                  <th className="p-4 border-b text-center">Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <Link
                        to={`/admin/customers/${user._id}`}
                        className="text-blue-600 font-medium hover:text-blue-800"
                      >
                        {user.name}
                      </Link>
                    </td>
                    <td className="p-4">{user.mobile}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4 text-center">
                      {user.isStaff ? (
                        <FiCheck className="text-green-600 text-xl" />
                      ) : (
                        <FiX className="text-red-600 text-xl" />
                      )}
                    </td>
                    <td className="p-4 text-center">
                      {user.isActive ? (
                        <FiCheck className="text-green-600 text-xl" />
                      ) : (
                        <FiX className="text-red-600 text-xl" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-lg">No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
