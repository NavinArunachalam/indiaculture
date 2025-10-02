import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Toastify from "toastify-js";

const API_URL = import.meta.env.VITE_API_URL;

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch reviews
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/reviews`, { withCredentials: true });
      setReviews(res.data.data || res.data.reviews || []);
    } catch (err) {
      Toastify({
        text: err.response?.data?.message || "Failed to fetch reviews",
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
    fetchReviews();
  }, []);

  // Filters
  const filteredReviews = reviews
    .filter(
      r =>
        r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        r.user?.email?.toLowerCase().includes(search.toLowerCase())
    )
    .filter(r => ratingFilter === "all" || r.rating === parseInt(ratingFilter))
    .filter(
      r =>
        !dateFilter ||
        new Date(r.createdAt).toISOString().split("T")[0] === dateFilter
    );

  // Select functions
  const toggleSelect = (id) => {
    setSelectedIds(selectedIds.includes(id)
      ? selectedIds.filter(sid => sid !== id)
      : [...selectedIds, id]);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredReviews.length) setSelectedIds([]);
    else setSelectedIds(filteredReviews.map(r => r._id));
  };

  // Delete selected
  const handleDeleteSelected = async () => {
    if (!selectedIds.length) return alert("No reviews selected");
    if (!window.confirm(`Delete ${selectedIds.length} review(s)?`)) return;

    try {
      await axios.delete(`${API_URL}/api/reviews/bulk-delete`, {
        data: { ids: selectedIds },
        withCredentials: true,
      });

      setReviews(reviews.filter(r => !selectedIds.includes(r._id)));
      setSelectedIds([]);
      Toastify({
        text: "Reviews deleted successfully",
        duration: 2500,
        gravity: "bottom",
        position: "center",
        backgroundColor: "#16a34a",
      }).showToast();
    } catch (err) {
      Toastify({
        text: err.response?.data?.message || "Failed to delete reviews",
        duration: 2500,
        gravity: "bottom",
        position: "center",
        backgroundColor: "#dc2626",
      }).showToast();
    }
  };

  // Date format
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) return <div className="text-center py-10">Loading reviews...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-['Inter'] text-lg">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Customer Reviews</h1>
          <div className="flex space-x-3">
            <Link
              to="/admin/reviews/add"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-md text-base font-medium transition-colors"
            >
              Add Review
            </Link>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              {filteredReviews.length} reviews
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by user name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-grow px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-base"
          />
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Ratings</option>
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating} Star{rating > 1 ? "s" : ""}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Select All + Delete */}
        <div className="flex items-center justify-between mb-4 text-base">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={selectedIds.length === filteredReviews.length && filteredReviews.length > 0}
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
            Delete Selected
          </button>
        </div>

        {/* Reviews Table */}
        <div className="border border-gray-200 rounded-md overflow-hidden text-base">
          {filteredReviews.length > 0 ? (
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="p-4 border-b text-left">Select</th>
                  <th className="p-4 border-b text-left">User</th>
                  <th className="p-4 border-b text-left">Product</th>
                  <th className="p-4 border-b text-left">Rating</th>
                  <th className="p-4 border-b text-left">Review</th>
                  <th className="p-4 border-b text-left">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(review._id)}
                        onChange={() => toggleSelect(review._id)}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="p-4">
                      {review.user?.name || "Unknown User"}
                      <p className="text-sm text-gray-500">{review.user?.email || "No email"}</p>
                    </td>
                    <td className="p-4">{review.product?.name || "General Review"}</td>
                    <td className="p-4 text-yellow-500">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(5 - review.rating)}
                    </td>
                    <td className="p-4 text-sm text-gray-600">{review.comment || "No comment"}</td>
                    <td className="p-4 text-sm">{formatDate(review.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-8 text-center text-gray-500 text-lg">No reviews found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerReviews;
