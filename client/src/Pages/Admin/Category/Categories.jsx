import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL; // your API base URL

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/categories`, { withCredentials: true });
        setCategories(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filteredCategories = categories
    .filter(cat => cat.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCategories.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCategories.map(cat => cat._id));
    }
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedIds.length) return alert("No categories selected");
    if (!window.confirm("Delete selected categories?")) return;
    try {
      await Promise.all(selectedIds.map(id => axios.delete(`${API_URL}/api/categories/${id}`, { withCredentials: true })));
      alert("Deleted selected categories!");
      setCategories(categories.filter(cat => !selectedIds.includes(cat._id)));
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
      alert("Failed to delete categories");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading categories...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-['Inter'] text-lg">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
          <Link
            to="/admin/categories/add"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-md text-base font-medium transition-colors flex items-center"
          >
            <i className="fas fa-plus mr-2"></i> Add Category
          </Link>
        </div>

        {/* Search + Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
            />
          </div>
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="flex items-center justify-center gap-2 px-5 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <i className={`fas fa-sort-alpha-${sortAsc ? "down" : "up"}`}></i>
            {sortAsc ? "A → Z" : "Z → A"}
          </button>
        </div>

        {/* Select All + Delete */}
        <div className="flex items-center justify-between mb-4 text-base">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedIds.length === filteredCategories.length && filteredCategories.length > 0}
              onChange={toggleSelectAll}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 font-medium text-gray-700">Select All</span>
          </div>
          <button
            onClick={handleDeleteSelected}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium ${
              selectedIds.length ? "bg-red-600 hover:bg-red-700 text-white" : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!selectedIds.length}
          >
            <i className="fas fa-trash"></i> Delete Selected
          </button>
        </div>

        {/* Category List */}
        <div className="border border-gray-200 rounded-md overflow-hidden text-base">
          {filteredCategories.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredCategories.map(cat => (
                <li key={cat._id} className="hover:bg-gray-50">
                  <div className="flex items-center px-4 py-4">
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(cat._id)}
                        onChange={() => toggleSelect(cat._id)}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 flex-grow">
                      <Link
                        to={`/admin/categories/edit/${cat._id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {cat.name}
                      </Link>
                    </div>
                    <div className="flex items-center">
                      <Link
                        to={`/admin/categories/edit/${cat._id}`}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <i className="fas fa-pencil-alt"></i>
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-8 text-center">
              <i className="fas fa-folder-open text-gray-300 text-5xl mb-2"></i>
              <p className="text-gray-500 text-lg">No categories found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
