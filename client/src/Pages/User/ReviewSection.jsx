import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ReviewSection.css";

const ReviewSection = ({ productId = null, currentUser, fetchReviews }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch reviews from API
  const loadReviews = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/reviews`, {
        params: productId ? { productId } : {},
      });
      setReviews(res.data.data || []);
      if (fetchReviews) fetchReviews(); // optional parent refresh
    } catch (err) {
      console.error("Error loading reviews:", err);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  // Filter to get only the logged-in user's review
  const userReview = reviews.find((r) => r.user?._id === currentUser?._id);

  useEffect(() => {
    if (userReview) {
      setRating(userReview.rating);
      setMessage(userReview.comment || userReview.message);
    } else {
      setRating(0);
      setMessage("");
    }
  }, [userReview]);

  // Submit or update review
  const handleSubmit = async () => {
    if (!rating || !message.trim()) {
      alert("Please give rating and message!");
      return;
    }

    try {
      if (userReview) {
        // Update review
        await axios.put(
          productId ? `${API_URL}/api/reviews/product` : `${API_URL}/api/reviews/general`,
          productId
            ? { productId, rating, comment: message }
            : { rating, comment: message },
          { withCredentials: true }
        );
      } else {
        // Create new review
        await axios.post(
          productId ? `${API_URL}/api/reviews/product` : `${API_URL}/api/reviews/general`,
          productId
            ? { productId, rating, comment: message }
            : { rating, comment: message },
          { withCredentials: true }
        );
      }
      loadReviews();
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting review");
    }
  };

  // Delete review
  const handleDelete = async () => {
    if (!userReview) return;

    try {
      await axios.delete(`${API_URL}/api/reviews`, {
        params: { reviewId: userReview._id },
        withCredentials: true,
      });
      setRating(0);
      setMessage("");
      loadReviews();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting review");
    }
  };

  return (
    <div className="review-section">
      <h4 className="review-heading">YOUR REVIEW</h4>

      {/* Display only the logged-in user's review */}
      {userReview ? (
        <div className="review-list">
          <div className="review-item">
            <div className="review-header">
              <span className="review-name">{userReview.user?.name || userReview.name}</span>
              <span className="review-rating">
                {"★".repeat(userReview.rating) + "☆".repeat(5 - userReview.rating)}
              </span>
            </div>
            <p className="review-message">{userReview.comment || userReview.message}</p>
          </div>
        </div>
      ) : (
        <p className="no-reviews">You haven't submitted a review yet.</p>
      )}

      {/* Review Form */}
      <div className="review-form">
        {userReview ? (
          <div className="user-review-actions">
            <p>You already submitted a review.</p>
            <button className="submit-btn" onClick={handleSubmit}>
              Update Review
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              Delete Review
            </button>
          </div>
        ) : (
          <>
            <div className="form-group">
              <label>Your rating</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${rating >= star ? "filled" : ""}`}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <textarea
                className="form-control"
                rows="5"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your review..."
              ></textarea>
            </div>

            <button className="submit-btn" onClick={handleSubmit}>
              Submit Review
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;