import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_URL}/api/admin/orders`, { withCredentials: true });
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Helper function to check date range
  const isWithinDateRange = (createdAt) => {
    const today = new Date();
    const orderDate = new Date(createdAt);
    if (dateFilter === "today") {
      return orderDate.toISOString().split("T")[0] === today.toISOString().split("T")[0];
    } else if (dateFilter === "past7days") {
      const past7Days = new Date(today);
      past7Days.setDate(today.getDate() - 7);
      return orderDate >= past7Days && orderDate <= today;
    } else if (dateFilter === "past1month") {
      const past1Month = new Date(today);
      past1Month.setMonth(today.getMonth() - 1);
      return orderDate >= past1Month && orderDate <= today;
    }
    return true; // "all"
  };

  // Filtered orders
  const filteredOrders = orders
    .filter(
      (o) =>
        o.full_name.toLowerCase().includes(search.toLowerCase()) ||
        o.code.toLowerCase().includes(search.toLowerCase())
    )
.filter(
  (o) =>
    statusFilter === "all" ||
    o.status?.toLowerCase() === statusFilter.toLowerCase()
)

    .filter(
      (o) =>
        paymentFilter === "all" ||
        (paymentFilter === "paid" ? o.is_paid : !o.is_paid)
    )
    .filter((o) => isWithinDateRange(o.createdAt));

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Payment status color
  const getPaymentColor = (isPaid) => {
    return isPaid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter'] text-lg">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Orders</h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            {filteredOrders.length} orders
          </span>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search by order code or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-4 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
            />
          </div>
          <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="past7days">Past 7 Days</option>
            <option value="past1month">Past 1 Month</option>
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option value="all">All Payment Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="border border-gray-200 rounded-md overflow-hidden text-base">
          {filteredOrders.length > 0 ? (
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 text-gray-600 text-left text-sm">
                <tr>
                  <th className="p-4">Order Code</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Payment Status</th>
                  <th className="p-4">Expected Delivery</th>
                  <th className="p-4">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-bold text-blue-600 cursor-pointer hover:underline" onClick={() => navigate(`/admin/orders/${order._id}`)}>
                      {order.code}
                    </td>
                    <td className="p-4">{order.full_name}</td>
                    <td className="p-4">{order.phone}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      ₹{(
                        order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) +
                        (order.shipping || 0)
                      ).toLocaleString("en-IN")}
                    </td>
                    <td className="p-4">{order.payment_method}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${getPaymentColor(order.is_paid)}`}>
                        {order.is_paid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                   <td className="p-4">
  {order.createdAt
    ? new Date(new Date(order.createdAt).setDate(new Date(order.createdAt).getDate() + 7)).toLocaleDateString("en-IN")
    : "-"}
</td>

                    <td className="p-4">{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-lg">No orders found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
