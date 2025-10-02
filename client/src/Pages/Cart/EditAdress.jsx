import React, { useState, useEffect } from "react";
import axios from "axios";
import Toastify from "toastify-js";
import { useNavigate } from "react-router-dom";
import "./Address.css";

const API_URL = import.meta.env.VITE_API_URL;

const Address = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pincode: "",
    city: "",
    state: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch existing address dynamically
  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/user`, { withCredentials: true });
        setFormData({
          pincode: res.data.pincode || "",
          city: res.data.city || "",
          state: res.data.state || "",
          address: res.data.address || "",
        });
      } catch (err) {
        console.error("Failed to fetch user address", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserAddress();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${API_URL}/api/user/address`, formData, { withCredentials: true });

      Toastify({
        text: "Address updated successfully ✅",
        duration: 2000,
        gravity: "bottom",
        position: "center",
        backgroundColor: "#16a34a",
      }).showToast();
      navigate("/profile"); // redirect after saving
    } catch (err) {
      Toastify({
        text: err.response?.data?.message || "Failed to update address",
        duration: 2000,
        gravity: "bottom",
        position: "center",
        backgroundColor: "#dc2626",
      }).showToast();
    }
  };

  if (loading) return <p className="text-center py-6">Loading address...</p>;

  return (
    <div className="checkout-wrapper">
      <main className="checkout-page">
        <h1>Edit- Delivery Address</h1>

        <section className="card address-card">
          <h2>Edit Delivery Address</h2>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="form-field">
                <label htmlFor="pincode">Pincode</label>
                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  pattern="[0-9]{6}"
                  placeholder="e.g. 560001"
                  required
                  value={formData.pincode}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label htmlFor="city">City/District</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="City or district"
                  required
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label htmlFor="state">State</label>
                <select
                  id="state"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                >
       <option value="">-- Select State --</option>
    <option value="Andhra Pradesh">Andhra Pradesh</option>
    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
    <option value="Assam">Assam</option>
    <option value="Bihar">Bihar</option>
    <option value="Chhattisgarh">Chhattisgarh</option>
    <option value="Goa">Goa</option>
    <option value="Gujarat">Gujarat</option>
    <option value="Haryana">Haryana</option>
    <option value="Himachal Pradesh">Himachal Pradesh</option>
    <option value="Jharkhand">Jharkhand</option>
    <option value="Karnataka">Karnataka</option>
    <option value="Kerala">Kerala</option>
    <option value="Madhya Pradesh">Madhya Pradesh</option>
    <option value="Maharashtra">Maharashtra</option>
    <option value="Manipur">Manipur</option>
    <option value="Meghalaya">Meghalaya</option>
    <option value="Mizoram">Mizoram</option>
    <option value="Nagaland">Nagaland</option>
    <option value="Odisha">Odisha</option>
    <option value="Punjab">Punjab</option>
    <option value="Rajasthan">Rajasthan</option>
    <option value="Sikkim">Sikkim</option>
    <option value="Tamil Nadu">Tamil Nadu</option>
    <option value="Telangana">Telangana</option>
    <option value="Tripura">Tripura</option>
    <option value="Uttar Pradesh">Uttar Pradesh</option>
    <option value="Uttarakhand">Uttarakhand</option>
    <option value="West Bengal">West Bengal</option>

    {/* Union Territories */}
    <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
    <option value="Chandigarh">Chandigarh</option>
    <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
    <option value="Delhi">Delhi</option>
    <option value="Jammu and Kashmir">Jammu and Kashmir</option>
    <option value="Ladakh">Ladakh</option>
    <option value="Lakshadweep">Lakshadweep</option>
    <option value="Puducherry">Puducherry</option>
  </select>
               
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="address">Full address</label>
              <textarea
                id="address"
                name="address"
                placeholder="House no., building, street, locality"
                required
                value={formData.address}
                onChange={handleChange}
              ></textarea>
            </div>

            <button type="submit" className="save-btn">
              Save Address
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Address;
