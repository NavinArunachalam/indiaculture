import React, { useState } from "react";
import { CSSTransition } from "react-transition-group";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [showRegister, setShowRegister] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({}); // Field-specific errors
  const navigate = useNavigate();

  const handleToggle = (e) => {
    e.preventDefault();
    setErrors({});
    setShowRegister((prev) => !prev);
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
    setPhone(value);
  };

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Client-side validation
  const validateForm = (isRegister) => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    else if (!validateEmail(email)) newErrors.email = "Please enter a valid email address";
    if (!password) newErrors.password = "Password is required";
    else if (isRegister && password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (isRegister && !name) newErrors.name = "Full name is required";
    if (isRegister && phone && !/^[0-9]{10}$/.test(phone)) newErrors.phone = "Phone number must be 10 digits";
    return newErrors;
  };

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    const formErrors = validateForm(false);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/login`,
        { email, password },
        { withCredentials: true }
      );
      navigate("/");
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        const errorMessages = Object.values(errors).map((e) => e.message);
        setErrors({ api: errorMessages.join(" | ") });
      } else {
        setErrors({ api: err.response?.data?.message || "Login failed. Please check your credentials." });
      }
    }
  };

  // Register
  const handleRegister = async (e) => {
    e.preventDefault();
    const formErrors = validateForm(true);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    try {
   await axios.post(
        `${API_URL}/api/register`,
        { name, email, password, mobile: phone },
        { withCredentials: true }
      );
      navigate("/");
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        const newErrors = {};
        Object.values(errors).forEach((e) => {
          if (e.path === "email") newErrors.email = e.message.includes("unique") ? "This email is already registered" : e.message;
          else if (e.path === "password") newErrors.password = e.message;
          else if (e.path === "name") newErrors.name = e.message;
          else if (e.path === "mobile") newErrors.phone = e.message;
          else newErrors.api = e.message;
        });
        setErrors(newErrors);
      } else {
        setErrors({ api: err.response?.data?.message || "Registration failed. Please try again." });
      }
    }
  };

  return (
    <div>
      <div className="header">
        <h1>Welcome to Indiaculture</h1>
        <p>Discover natural beauty & skincare products made for you</p>
      </div>

      <div className="login-page">
        <div className="form">
          {errors.api && <p className="message-api text-red-500">{errors.api}</p>}

          {/* Login Form */}
          <CSSTransition in={!showRegister} timeout={300} classNames="fade" unmountOnExit>
            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-describedby="email-error"
                />
                {errors.email && (
                  <p className="error-message text-red-500 text-sm" id="email-error">{errors.email}</p>
                )}
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-describedby="password-error"
                />
                {errors.password && (
                  <p className="error-message text-red-500 text-sm" id="password-error">{errors.password}</p>
                )}
              </div>
              <button type="submit">Login</button>
              <p className="message">
                Not registered?{" "}
                <a href="#" onClick={handleToggle}>
                  Create an account
                </a>
              </p>
            </form>
          </CSSTransition>

          {/* Register Form */}
          <CSSTransition in={showRegister} timeout={300} classNames="fade" unmountOnExit>
            <form className="register-form" onSubmit={handleRegister}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-describedby="name-error"
                />
                {errors.name && (
                  <p className="error-message text-red-500" id="name-error">{errors.name}</p>
                )}
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-describedby="password-error"
                />
                {errors.password && (
                  <p className="error-message text-red-500" id="password-error">{errors.password}</p>
                )}
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-describedby="email-error"
                />
                {errors.email && (
                  <p className="error-message text-red-500" id="email-error">{errors.email}</p>
                )}
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={handlePhoneChange}
                  aria-describedby="phone-error"
                />
                {errors.phone && (
                  <p className="error-message text-red-500" id="phone-error">{errors.phone}</p>
                )}
              </div>
              <button type="submit">Create Account</button>
              <p className="message">
                Already registered?{" "}
                <a href="#" onClick={handleToggle}>
                  Sign In
                </a>
              </p>
            </form>
          </CSSTransition>
        </div>
      </div>
    </div>
  );
};

export default Login;