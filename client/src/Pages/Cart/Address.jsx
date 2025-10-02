import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Toastify from "toastify-js";
import "./Address.css";

const API_URL = import.meta.env.VITE_API_URL;

const Address = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { cartItems = [], subtotal = 0, shipping = 0, total = 0, productId, quantity } = location.state || {};

  const [formData, setFormData] = useState({
    pincode: "",
    city: "",
    state: "",
    address: "",
    phone: "", // Added phone field
  });

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/user`, { withCredentials: true });
        setFormData({
          pincode: res.data.pincode || "",
          city: res.data.city || "",
          state: res.data.state || "",
          address: res.data.address || "",
          phone: res.data.mobile || "", // Prefill phone
        });
      } catch (err) {
        console.error("Failed to fetch user address", err);
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

    if (![formData.pincode, formData.city, formData.state, formData.address, formData.phone].every(f => f && f.trim())) {
      Toastify({
        text: "Please fill all address fields, including phone number",
        duration: 2000,
        gravity: "bottom",
        position: "center",
        backgroundColor: "#dc2626",
      }).showToast();
      return;
    }

    // Validate phone number (e.g., 10 digits)
    if (!/^[0-9]{10}$/.test(formData.phone)) {
      Toastify({
        text: "Please enter a valid 10-digit phone number",
        duration: 2000,
        gravity: "bottom",
        position: "center",
        backgroundColor: "#dc2626",
      }).showToast();
      return;
    }

    try {
      await axios.put(`${API_URL}/api/user/address`, formData, { withCredentials: true });

      Toastify({
        text: "Address saved successfully ✅",
        duration: 2000,
        gravity: "bottom",
        position: "center",
        backgroundColor: "#16a34a",
      }).showToast();

      navigate("/revieworder", {
        state: {
          cartItems,
          subtotal,
          shipping,
          total,
          productId,
          quantity,
          address: {
            name: formData.name || "",
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
          },
        },
      });
    } catch (err) {
      Toastify({
        text: err.response?.data?.message || "Failed to save address",
        duration: 2000,
        gravity: "bottom",
        position: "center",
        backgroundColor: "#dc2626",
      }).showToast();
    }
  };

  return (
    <div className="checkout-wrapper">
      <main className="checkout-page">
        <h1>Indiaculture<br />Checkout - Delivery Address</h1>

        <section className="card address-card">
          <h2>Delivery Address</h2>
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
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="text"
                pattern="[0-9]{10}"
                placeholder="e.g. 9876543210"
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="address">Full Address</label>
              <textarea
                id="address"
                name="address"
                placeholder="House no., building, street, locality"
                required
                value={formData.address}
                onChange={handleChange}
              ></textarea>
            </div>

            <button type="submit" className="save-btn">Save & Continue</button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Address;