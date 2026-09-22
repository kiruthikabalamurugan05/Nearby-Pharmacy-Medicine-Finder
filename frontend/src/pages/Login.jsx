import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck
} from "lucide-react";
import "./Login.css";

const API_URL = "http://localhost:5000";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save login information
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Role-based navigation
      if (data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (data.user.role === "pharmacy") {
        navigate("/pharmacy-dashboard");
      } else if (data.user.role === "customer") {
        navigate("/customer-dashboard");
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* NAVBAR */}
      <nav className="login-navbar">

        <div className="login-brand">

          <div className="login-brand-icon">
            +
          </div>

          <span>
            Nearby <strong>Pharmacy Finder</strong>
          </span>

        </div>

        <div className="login-nav-links">

          <button onClick={() => navigate("/")}>
            Home
          </button>

          <button>
            Pharmacies
          </button>

          <button>
            About Us
          </button>

          <button
            className="register-nav-btn"
            onClick={() => navigate("/register")}
          >
            Register
          </button>

        </div>

      </nav>

      {/* CENTER LOGIN */}
      <main className="login-main">

        <div className="login-card">

          {/* ICON */}
          <div className="login-icon">
            <User size={27} />
          </div>

          {/* TITLE */}
          <h1>Welcome back</h1>

          <p className="login-subtitle">
            Login to your Nearby Pharmacy Finder account
          </p>

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div className="login-input-group">

              <label>
                Email address
              </label>

              <div className="login-input-wrapper">

                <Mail size={18} />

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            {/* PASSWORD */}
            <div className="login-input-group">

              <label>
                Password
              </label>

              <div className="login-input-wrapper">

                <Lock size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>

            </div>

            {/* ERROR */}
            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="login-submit-btn"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login →"}
            </button>

          </form>

          {/* CREATE ACCOUNT */}
          <p className="create-account-text">

            Don't have an account?{" "}

            <button
              onClick={() => navigate("/register")}
            >
              Create account
            </button>

          </p>

          {/* SECURITY */}
          <div className="login-security">

            <ShieldCheck size={16} />

            <span>
              Your login information is securely protected.
            </span>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Login;