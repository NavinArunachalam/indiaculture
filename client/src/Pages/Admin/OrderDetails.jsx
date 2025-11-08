import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Toastify from "toastify-js";

const API_URL = import.meta.env.VITE_API_URL;

const OrderDetails = ({ isAdminPage = true }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const endpoint = `${API_URL}/api/admin/orders/${id}`;
        const res = await axios.get(endpoint, { withCredentials: true });
        setOrder(res.data.order || res.data);
      } catch (err) {
        Toastify({
          text: err.response?.data?.message || "Failed to load order",
          duration: 2500,
          gravity: "bottom",
          position: "center",
          backgroundColor: "#dc2626",
        }).showToast();
        navigate("/admin/orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, navigate]);

  // Status change
  const handleStatusChange = async (e) => {
    try {
      const newStatus = e.target.value;
      await axios.put(`${API_URL}/api/orders/${id}`, { status: newStatus }, { withCredentials: true });
      setOrder({ ...order, status: newStatus });
      Toastify({ text: "Order status updated", duration: 2000, gravity: "bottom", position: "center", backgroundColor: "#16a34a" }).showToast();
    } catch (err) {
      Toastify({ text: err.response?.data?.message || "Failed to update status", duration: 2000, gravity: "bottom", position: "center", backgroundColor: "#dc2626" }).showToast();
    }
  };

  // Payment toggle
  const togglePayment = async () => {
    try {
      const updatedPayment = !order.is_paid;
      await axios.put(`${API_URL}/api/orders/${id}`, { is_paid: updatedPayment }, { withCredentials: true });
      setOrder({ ...order, is_paid: updatedPayment });
      Toastify({ text: `Payment marked as ${updatedPayment ? "Paid" : "Unpaid"}`, duration: 2000, gravity: "bottom", position: "center", backgroundColor: "#16a34a" }).showToast();
    } catch (err) {
      Toastify({ text: err.response?.data?.message || "Failed to update payment", duration: 2000, gravity: "bottom", position: "center", backgroundColor: "#dc2626" }).showToast();
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentColor = (isPaid) => (isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800");

  if (loading) return <div className="text-center py-10">Loading order details...</div>;
  if (!order) return <div className="text-center py-10 text-red-500">Order not found</div>;

  // Calculate subtotal
  const subtotal = order.items.reduce(
    (sum, item) => sum + (item.price || item.product?.new_price) * (item.quantity || item.qty),
    0
  );
  const total = subtotal + (order.shipping || 0);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-['Inter'] text-lg">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">
            Order Details - {order.code || order.order_code}
          </h2>
         
        </div>

        {/* Status + Payment */}
        <div className="flex flex-col sm:flex-row gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
            <select
              value={order.status}
              onChange={handleStatusChange}
              className={`w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base font-semibold focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${getStatusColor(order.status)}`}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Payment Status</label>
            <button onClick={togglePayment} className={`w-full px-4 py-3 rounded-md text-base font-semibold ${getPaymentColor(order.is_paid)}`}>
              {order.is_paid ? "Paid" : "Unpaid"}
            </button>
          </div>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <input type="text" value={order.full_name} readOnly className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base" />
          <input type="text" value={order.phone} readOnly className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base" />
          <textarea value={order.address} readOnly className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base md:col-span-2" />
          <input type="text" value={order.city} readOnly className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base" />
          <input type="text" value={order.state} readOnly className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base" />
          <input type="text" value={order.pincode} readOnly className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base" />
        </div>

        {/* Order Items */}
        <div>
          <h3 className="text-lg font-bold text-gray-700 mb-3">Order Items</h3>
          <div className="border border-gray-200 rounded-md overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 text-gray-600 text-left text-sm">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {order.items.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-4">{item.product?.name || item.name}</td>
                    <td className="p-4">{item.quantity || item.qty}</td>
                    <td className="p-4">₹{(item.price || item.product?.new_price).toLocaleString("en-IN")}</td>
                    <td className="p-4">₹{((item.price || item.product?.new_price) * (item.quantity || item.qty)).toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-4 text-right">
            <p className="text-base font-semibold text-gray-800">Shipping: ₹{(order.shipping || 0).toLocaleString("en-IN")}</p>
            <p className="mt-1 text-lg font-bold text-gray-900">Total: ₹{total.toLocaleString("en-IN")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
