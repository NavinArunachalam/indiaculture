import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const API_URL = import.meta.env.VITE_API_URL;

const ManageOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/admin/orders`, { withCredentials: true });
      setOrders(res.data.orders || []);
    } catch (err) {
      Toastify({
        text: err.response?.data?.message || "Failed to fetch orders",
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
    fetchOrders();
  }, []);

  // Update status
  const handleStatusChange = async (id, newStatus) => {
    try {
      const formattedStatus = newStatus.charAt(0).toUpperCase() + newStatus.slice(1).toLowerCase();
      const res = await axios.put(
        `${API_URL}/api/orders/${id}`,
        { status: formattedStatus },
        { withCredentials: true }
      );

      const updatedOrder = res.data.order;
      setOrders((prev) => prev.map((o) => (o._id === id ? updatedOrder : o)));

      Toastify({
        text: "Order status updated",
        duration: 2000,
        gravity: "bottom",
        position: "center",
        backgroundColor: "#16a34a",
      }).showToast();
    } catch (err) {
      Toastify({
        text: err.response?.data?.message || "Failed to update status",
        duration: 2000,
        gravity: "bottom",
        position: "center",
        backgroundColor: "#dc2626",
      }).showToast();
    }
  };

  // Toggle payment
  const togglePayment = async (id) => {
    try {
      const order = orders.find((o) => o._id === id);
      if (!order) return;

      const res = await axios.put(
        `${API_URL}/api/orders/${id}`,
        { is_paid: !order.is_paid },
        { withCredentials: true }
      );

      const updatedOrder = res.data.order;
      setOrders((prev) => prev.map((o) => (o._id === id ? updatedOrder : o)));

      Toastify({
        text: `Payment marked as ${updatedOrder.is_paid ? "Paid" : "Unpaid"}`,
        duration: 2000,
        gravity: "bottom",
        position: "center",
        backgroundColor: "#16a34a",
      }).showToast();
    } catch (err) {
      Toastify({
        text: err.response?.data?.message || "Failed to update payment",
        duration: 2000,
        gravity: "bottom",
        position: "center",
        backgroundColor: "#dc2626",
      }).showToast();
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <div className="text-center py-10">Loading orders...</div>;
  if (!orders.length) return <div className="text-center py-10 text-red-500">No orders found.</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">Manage Orders</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-left text-sm">
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Address</th>
                <th className="p-3">Status</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Shipping</th>
                <th className="p-3">Total</th>
                <th className="p-3">Items</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-50 transition">
                  <td
                    className="p-3 font-bold text-blue-600 cursor-pointer hover:underline"
                    onClick={() => navigate(`/admin/orders/${order._id}`)}
                  >
                    {order.code || order._id}
                  </td>

                  <td className="p-3">{order.user?.name || order.full_name}</td>
                  <td className="p-3">{order.user?.mobile || order.phone}</td>
                  <td className="p-3">{order.address}</td>

                  <td className="p-3">
                    <select
                      value={order.status.toLowerCase()}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`border p-1 rounded text-xs font-semibold ${getStatusColor(order.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => togglePayment(order._id)}
                      className={`px-3 py-1 rounded text-xs font-semibold ${
                        order.is_paid ? "bg-green-500 text-white" : "bg-red-500 text-white"
                      }`}
                    >
                      {order.is_paid ? "Paid" : "Unpaid"}
                    </button>
                  </td>

                  <td className="p-3 font-medium">
                    ₹{(order.shipping || 0).toLocaleString("en-IN")}
                  </td>

                  <td className="p-3 font-medium">
                    ₹{(
                      order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) +
                      (order.shipping || 0)
                    ).toLocaleString("en-IN")}
                  </td>

                  <td className="p-3 text-left">
                    <ul className="list-disc ml-4">
                      {order.items.map((item) => (
                        <li key={item._id}>
                          {item.product?.name || item.name} - {item.quantity || item.qty} x ₹{item.price}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;
