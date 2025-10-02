import React, { useEffect, useState } from "react";
import axios from "axios";
import Chart from "chart.js/auto";

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, totalCustomers: 0 });
  const [topProducts, setTopProducts] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salesChart, setSalesChart] = useState(null);
  const [categoryChart, setCategoryChart] = useState(null);
  const [salesTarget, setSalesTarget] = useState('50000');

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/admin/dashboard`, { withCredentials: true });
      const data = res.data;

      setTopProducts(data.topProducts);
      setSalesByCategory(data.salesByCategory);
      setRecentOrders(data.recentOrders);

      // Monthly stats for current month
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      let monthlySalesAmount = 0;
      let monthlyOrders = 0;
      let monthlyCustomers = new Set();

      data.recentOrders.forEach(order => {
        const d = new Date(order.createdAt);
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          monthlyOrders++;
          monthlyCustomers.add(order.user.name || "N/A");
          const total = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
          if (order.is_paid) monthlySalesAmount += total;
        }
      });

      setStats({
        totalSales: monthlySalesAmount,
        totalOrders: monthlyOrders,
        totalCustomers: monthlyCustomers.size,
      });

      // Monthly Sales chart
      const months = [];
      const monthlyMap = {};
      for (let i = 0; i < 12; i++) {
        const d = new Date(currentYear, i, 1);
        const monthName = d.toLocaleString("default", { month: "short" });
        months.push(monthName);
        monthlyMap[monthName] = 0;
      }

      data.recentOrders.forEach(order => {
        if (!order.is_paid) return;
        const d = new Date(order.createdAt);
        if (d.getFullYear() !== currentYear) return;
        const month = d.toLocaleString("default", { month: "short" });
        const total = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0) + order.shipping;
        monthlyMap[month] += total;
      });

      setMonthlySales(months.map(month => ({ month, total: monthlyMap[month] })));
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const drawSalesChart = () => {
    if (!monthlySales.length) return;
    const ctx = document.getElementById("salesLineChart");
    if (!ctx) return;
    if (salesChart) salesChart.destroy();

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: monthlySales.map(m => m.month),
        datasets: [
          {
            label: "Monthly Sales",
            data: monthlySales.map(m => m.total),
            backgroundColor: "rgba(82,121,111,0.2)",
            borderColor: "#52796f",
            fill: true,
            tension: 0.3,
            pointRadius: 5,
            pointBackgroundColor: "#52796f",
          },
          salesTarget > 0
            ? {
                label: "Sales Target",
                data: monthlySales.map(() => salesTarget),
                borderColor: "red",
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0,
              }
            : null,
        ].filter(Boolean),
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false} },
        scales: { x: { grid: { display: false } }, y: { beginAtZero: true } },
      },
    });

    setSalesChart(chart);
  };

  const drawCategoryChart = () => {
    if (!salesByCategory.length) return;
    const ctx = document.getElementById("categoryBarChart");
    if (!ctx) return;
    if (categoryChart) categoryChart.destroy();

    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: salesByCategory.map(c => c.name),
        datasets: [
          {
            label: "Sales by Category",
            data: salesByCategory.map(c => c.totalSales),
            backgroundColor: ["#2a9d8f", "#e76f51", "#264653", "#f4a261", "#52796f"],
            borderRadius: 6,
            maxBarThickness: 45,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { x: { grid: { display: false } }, y: { beginAtZero: true } },
      },
    });

    setCategoryChart(chart);
  };

  useEffect(() => {
    if (!loading) {
      drawSalesChart();
      drawCategoryChart();
    }
  }, [monthlySales, salesByCategory, salesTarget, loading]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <main className="p-8 overflow-y-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        {/* <input type="search" placeholder="Search orders, products..." className="border rounded-full px-4 py-2 w-72 focus:outline-none focus:border-[#52796f]" /> */}
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <h3 className="text-[#52796f] font-semibold mb-2">Sales</h3>
          <p className="text-3xl font-bold text-gray-800">₹{stats.totalSales}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <h3 className="text-[#52796f] font-semibold mb-2">Orders</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 text-center">
          <h3 className="text-[#52796f] font-semibold mb-2">Customers</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.totalCustomers}</p>
        </div>
      </section>

      {/* Sales Target
      <section className="mb-5 flex items-center gap-4">
        <input
          type="number"
          placeholder="Set Sales Target"
          className="border rounded px-2 py-2 w-30 focus:outline-none focus:border-[#52796f]"
          value={salesTarget}
          onChange={(e) => setSalesTarget(Number(e.target.value))}
        />
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-2 py-2 rounded-md"
          onClick={() => drawSalesChart()}
        >
          Apply Target
        </button>
      </section> */}

      {/* Charts */}
      <section className="flex gap-8 mb-10 flex-wrap">
        <div className="flex-1 min-w-[400px] bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Sales Over Time (12 Months)</h2>
          <canvas id="salesLineChart"></canvas>
        </div>
        <div className="flex-1 min-w-[400px] bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Sales by Category</h2>
          <canvas id="categoryBarChart"></canvas>
        </div>
      </section>

      {/* Recent Orders & Top Products */}
      <section className="flex gap-8 flex-wrap">
        {/* Recent Orders */}
        <div className="flex-1 min-w-[400px] bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Orders</h2>
          <table className="w-full border-collapse">
            <thead className="bg-[#52796f] text-white">
              <tr>
                <th className="px-4 py-2 text-left">Order ID</th>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => {
                const total = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0) + order.shipping;
                return (
                  <tr key={order._id} className="hover:bg-gray-100">
                    <td className="px-4 py-2">#{order.code}</td>
                    <td className="px-4 py-2">{order.user.name || "N/A"}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${
                        order.status.toLowerCase() === "pending" ? "bg-yellow-500" :
                        order.status.toLowerCase() === "shipped" ? "bg-teal-600" :
                        order.status.toLowerCase() === "delivered" ? "bg-gray-800" :
                        order.status.toLowerCase() === "cancelled" ? "bg-red-600" : "bg-gray-500"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">₹{total}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Top Products */}
        <div className="flex-1 min-w-[400px] bg-white p-6 rounded-xl shadow-md mt-10">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 ">Top Products</h2>
          <ul>
            {topProducts.map(p => (
              <li key={p._id} className="flex justify-between border-b capitalize border-gray-200 py-2 font-semibold text-[#52796f]">
                <span>{p.name}</span>
                <span>{p.sold} sold</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
