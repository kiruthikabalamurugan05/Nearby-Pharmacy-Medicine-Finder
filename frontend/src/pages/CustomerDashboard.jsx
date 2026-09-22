import React, { useState } from "react";
import { Search, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./CustomerDashboard.css";

function CustomerDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [search, setSearch] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!search.trim()) return;

    console.log("Searching for:", search);

    // Medicine search will be connected later
  };

  return (
    <div className="customer-dashboard">

      {/* NAVBAR */}
      <header className="customer-navbar">

        <div className="customer-brand">
          <div className="brand-logo">+</div>
          <span>Nearby Pharmacy Finder</span>
        </div>

        <div className="customer-nav-right">
          <span className="customer-name">
            {user?.name || "Customer"}
          </span>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

      </header>


      {/* MAIN CONTENT */}
      <main className="customer-main">

        <div className="welcome-section">

          <h1>
            Welcome back, {user?.name || "Customer"}!
          </h1>

          <p>
            What medicine are you looking for today?
          </p>

        </div>


        {/* SEARCH BOX */}
        <form
          className="medicine-search"
          onSubmit={handleSearch}
        >

          <Search size={20} />

          <input
            type="text"
            placeholder="Search for a medicine..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button type="submit">
            Search
          </button>

        </form>

      </main>

    </div>
  );
}

export default CustomerDashboard;