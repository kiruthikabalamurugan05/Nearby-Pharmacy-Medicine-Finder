import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  Eye,
  EyeOff,
  Store
} from "lucide-react";
import "./Register.css";

const API_URL = "http://localhost:5000";

function Register() {
  const navigate = useNavigate();

  const [role, setRole] = useState("customer");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    city: "",
    licence: null
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      if (role === "customer") {
        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            location: formData.city
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }

        setMessage("Customer account created successfully!");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }

      if (role === "pharmacy") {
        if (!formData.licence) {
          setError("Please upload your pharmacy licence.");
          setLoading(false);
          return;
        }

        const dataToSend = new FormData();

        dataToSend.append("name", formData.name);
        dataToSend.append("email", formData.email);
        dataToSend.append("phone", formData.phone);
        dataToSend.append("password", formData.password);
        dataToSend.append("city", formData.city);
        dataToSend.append("licence", formData.licence);

        const response = await fetch(
          `${API_URL}/api/auth/pharmacy/register`,
          {
            method: "POST",
            body: dataToSend
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Registration failed");
        }

        setMessage(
          "Pharmacy registration submitted. Please wait for Admin approval."
        );

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      {/* NAVBAR */}
      <nav className="register-navbar">

        <div className="brand">
          <div className="brand-icon">
            +
          </div>

          <span>
            Nearby <strong>Pharmacy Finder</strong>
          </span>
        </div>

        <div className="nav-links">
          <button onClick={() => navigate("/")}>Home</button>
          <button>Pharmacies</button>
          <button>About Us</button>

          <button
            className="login-nav-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>

      </nav>

      {/* CENTER REGISTER CARD */}
      <main className="register-main">

        <div className="register-card">

          <div className="register-icon">
            <User size={27} />
          </div>

          <h1>Create your account</h1>

          {/* ROLE */}
          <div className="role-section">

            <label>Account type</label>

            <div className="role-options">

              <button
                type="button"
                className={`role-btn ${
                  role === "customer" ? "selected" : ""
                }`}
                onClick={() => setRole("customer")}
              >
                <User size={19} />
                Customer
              </button>

              <button
                type="button"
                className={`role-btn ${
                  role === "pharmacy" ? "selected" : ""
                }`}
                onClick={() => setRole("pharmacy")}
              >
                <Store size={19} />
                Pharmacy
              </button>

            </div>

          </div>

          <form onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="input-group">

              <label>Full name</label>

              <div className="input-wrapper">
                <User size={18} />

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            {/* EMAIL */}
            <div className="input-group">

              <label>Email address</label>

              <div className="input-wrapper">
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

            {/* PHONE */}
            <div className="input-group">

              <label>Phone number</label>

              <div className="input-wrapper">
                <Phone size={18} />

                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            {/* PASSWORD */}
            <div className="input-group">

              <label>Password</label>

              <div className="input-wrapper">

                <Lock size={18} />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
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

            {/* LOCATION */}
            <div className="input-group">

              <label>City / Location</label>

              <div className="input-wrapper">
                <MapPin size={18} />

                <input
                  type="text"
                  name="city"
                  placeholder="Enter your city or location"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            {/* LICENCE */}
            {role === "pharmacy" && (
              <div className="input-group">

                <label>Pharmacy Licence</label>

                <div className="input-wrapper file-input">

                  <Store size={18} />

                  <input
                    type="file"
                    name="licence"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleChange}
                    required
                  />

                </div>

                <small>
                  PDF, JPG or PNG • Maximum 5 MB
                </small>

              </div>
            )}

            {/* MESSAGE */}
            {message && (
              <div className="success-message">
                {message}
              </div>
            )}

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              className="create-account-btn"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create account →"}
            </button>

          </form>

          <p className="login-text">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")}>
              Login
            </button>
          </p>

        </div>

      </main>

    </div>
  );
}

export default Register;