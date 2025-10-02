import React, { useEffect, useState } from "react";
import axios from "axios";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const API_URL = import.meta.env.VITE_API_URL;

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/orders/user`, {
          withCredentials: true,
        });

        if (res.data.success && Array.isArray(res.data.orders)) {
          setOrders(res.data.orders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        Toastify({
          text: error.response?.data?.message || "Failed to fetch orders",
          duration: 2000,
          gravity: "bottom",
          position: "center",
          backgroundColor: "#dc2626",
        }).showToast();
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p className="text-center py-6">Loading orders...</p>;
  if (orders.length === 0) return <p className="text-center py-6">No orders found.</p>;

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <h2 className="text-3xl font-semibold text-green-800 text-center mb-4">My Orders</h2>

        {orders.map((order) => {
          const itemsTotal = order.items?.reduce(
            (sum, item) =>
              sum +
              ((item.product?.new_price || item.product?.price || 0) * item.quantity),
            0
          );

          const total = itemsTotal + (order.shipping || 0);

          const expectedDelivery = new Date(
            new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000
          );

          return (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow p-4 flex flex-col gap-4"
            >
              {/* Order Header */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Order ID: {order.code}</p>
                  <p className="text-sm text-gray-600">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Expected Delivery: {expectedDelivery.toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 text-sm rounded-full font-medium ${
                    statusColors[order.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Products List */}
              <div className="space-y-3">
                {order.items?.map((item) => (
                  <div key={item._id} className="flex items-center gap-4">
                    <img
                      src={
                        item.product?.images?.[0]?.url || "/placeholder.png"
                      }
                      alt={item.product?.name || "Unknown Product"}
                      className="w-20 h-20 rounded-md object-cover"
                    />
                    <div>
                      <h3 className="text-gray-800 font-medium">
                        {item.product?.name || "Unknown Product"}
                      </h3>
                      <p className="text-sm text-gray-700">
                        Qty: {item.quantity} | Price: ₹
                        {item.product?.new_price || item.product?.price || "N/A"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="flex flex-col items-end mt-3 text-right">
                <p className="text-sm text-gray-700">Items Total: ₹{itemsTotal.toFixed(2)}</p>
                <p className="text-sm text-gray-700">Shipping: ₹{(order.shipping || 0).toFixed(2)}</p>
                <p className="font-semibold text-gray-700">Grand Total: ₹{total.toFixed(2)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderPage;