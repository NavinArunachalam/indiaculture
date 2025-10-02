import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Toastify from "toastify-js";

const Products = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [bestsellFilter, setBestsellFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(`${API_URL}/api/products`, { withCredentials: true }),
          axios.get(`${API_URL}/api/categories`, { withCredentials: true }),
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => selectedCategory === "all" || p.category.name === selectedCategory)
    .filter(p => bestsellFilter === "all" || (bestsellFilter === "yes" ? p.is_bestsell : !p.is_bestsell))
    .filter(p => statusFilter === "all" || p.is_active === (statusFilter === "Active"));

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p._id));
    }
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // DELETE selected products
  const handleDeleteSelected = async () => {
    if (!selectedIds.length) return alert("No products selected");

    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} product(s)?`)) return;

    try {
      await Promise.all(selectedIds.map(id =>
        axios.delete(`${API_URL}/api/products/${id}`, { withCredentials: true })
      ));

      // Remove deleted products from state
      setProducts(products.filter(p => !selectedIds.includes(p._id)));
      setSelectedIds([]);
      alert("Selected products deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete selected products.");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading products...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-['Inter'] text-lg">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Products</h1>
          <Link
            to="/admin/products/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-md text-base font-medium transition-colors flex items-center"
          >
            <i className="fas fa-plus mr-2"></i> Add Product
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          <select
            value={bestsellFilter}
            onChange={(e) => setBestsellFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Products</option>
            <option value="yes">Bestsell</option>
            <option value="no">Non-Bestsell</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Select All + Delete */}
        <div className="flex items-center justify-between mb-4 text-base">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
              onChange={toggleSelectAll}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 font-medium text-gray-700">Select All</span>
          </div>
          <button
            onClick={handleDeleteSelected}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium ${
              selectedIds.length
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!selectedIds.length}
          >
            <i className="fas fa-trash"></i> Delete Selected
          </button>
        </div>

        {/* Product Table */}
        <div className="border border-gray-200 rounded-md overflow-hidden text-base">
          {filteredProducts.length > 0 ? (
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-4 border-b text-left">Select</th>
                  <th className="p-4 border-b text-left">Image</th>
                  <th className="p-4 border-b text-left">Name</th>
                  <th className="p-4 border-b text-left">Category</th>
                  <th className="p-4 border-b text-left">Price</th>
                  <th className="p-4 border-b text-left">Stock</th>
                  <th className="p-4 border-b text-left">Bestsell</th>
                  <th className="p-4 border-b text-left">Status</th>
                  <th className="p-4 border-b text-left">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map(product => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(product._id)}
                        onChange={() => toggleSelect(product._id)}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="p-4">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].url}
                          className="w-16 h-16 object-cover rounded-md border border-gray-200"
                        />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </td>
                    <td className="p-4">
                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        className="text-blue-600 font-medium hover:text-blue-800"
                      >
                        {product.name}
                      </Link>
                    </td>
                    <td className="p-4">{product.category.name}</td>
                    <td className="p-4">₹{product.new_price}</td>
                    <td className="p-4">{product.stock}</td>
                    <td className="p-4">{product.is_bestsell ? "Yes" : "No"}</td>
                    <td className="p-4">{product.is_active ? "Active" : "Inactive"}</td>
                    <td className="p-4">{new Date(product.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center">
              <i className="fas fa-box-open text-gray-300 text-5xl mb-2"></i>
              <p className="text-gray-500 text-lg">{error || "No products found"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;