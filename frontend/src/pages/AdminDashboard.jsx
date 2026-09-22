import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Store,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  LogOut,
  RefreshCw
} from "lucide-react";

import "./AdminDashboard.css";

const API_URL = "http://localhost:5000";

export default function AdminDashboard() {

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalPharmacies: 0,
    activePharmacies: 0,
    pendingPharmacies: 0,
    totalMedicines: 0
  });

  const [pendingPharmacies, setPendingPharmacies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ================= LOAD DATA =================

  const loadDashboard = async () => {

    try {

      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      // Admin statistics
      const statsResponse = await fetch(
        `${API_URL}/api/admin/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (statsResponse.status === 401 ||
          statsResponse.status === 403) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      const statsData = await statsResponse.json();

      if (!statsResponse.ok) {
        throw new Error(
          statsData.message || "Failed to load statistics"
        );
      }

      setStats(statsData);


      // Pending pharmacies
      const pharmacyResponse = await fetch(
        `${API_URL}/api/admin/pharmacies/pending`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const pharmacyData = await pharmacyResponse.json();

      if (!pharmacyResponse.ok) {
        throw new Error(
          pharmacyData.message ||
          "Failed to load pharmacy requests"
        );
      }

      setPendingPharmacies(pharmacyData);

    } catch (error) {

      console.error(error);

      setMessage(error.message);

    } finally {

      setLoading(false);

    }
  };


  // ================= LOAD ON PAGE OPEN =================

  useEffect(() => {
    loadDashboard();
  }, []);


  // ================= APPROVE / REJECT =================

  const verifyPharmacy = async (id, status) => {

    try {

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/admin/pharmacies/${id}/verify`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            status
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Failed to update pharmacy"
        );
      }

      setMessage(
        status === "approved"
          ? "Pharmacy approved successfully."
          : "Pharmacy rejected successfully."
      );

      // Reload dashboard
      loadDashboard();

    } catch (error) {

      setMessage(error.message);

    }
  };


  // ================= LOGOUT =================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

  };


  return (

    <div className="admin-page">

      {/* ================= NAVBAR ================= */}

      <header className="admin-navbar">

        <div className="admin-brand">

          <div className="admin-logo">
            +
          </div>

          <div>
            <strong>
              Nearby Pharmacy Finder
            </strong>

            <span>
              Admin Panel
            </span>
          </div>

        </div>


        <div className="admin-nav-right">

          <span className="admin-name">
            Administrator
          </span>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>

      </header>


      {/* ================= MAIN ================= */}

      <main className="admin-main">

        <div className="admin-heading">

          <div>

            <p className="admin-label">
              ADMINISTRATION
            </p>

            <h1>
              Dashboard
            </h1>

            <p>
              Manage pharmacies and monitor your platform.
            </p>

          </div>


          <button
            className="refresh-button"
            onClick={loadDashboard}
          >
            <RefreshCw size={17} />
            Refresh
          </button>

        </div>


        {/* ================= MESSAGE ================= */}

        {message && (

          <div className="admin-message">
            {message}
          </div>

        )}


        {/* ================= STATS ================= */}

        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon customers">
              <Users size={23} />
            </div>

            <div>
              <span>Total Customers</span>
              <strong>{stats.totalCustomers}</strong>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon pharmacies">
              <Store size={23} />
            </div>

            <div>
              <span>Total Pharmacies</span>
              <strong>{stats.totalPharmacies}</strong>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon approved">
              <CheckCircle size={23} />
            </div>

            <div>
              <span>Approved Pharmacies</span>
              <strong>{stats.activePharmacies}</strong>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon pending">
              <Clock size={23} />
            </div>

            <div>
              <span>Pending Requests</span>
              <strong>{stats.pendingPharmacies}</strong>
            </div>

          </div>

        </section>


        {/* ================= PHARMACY REQUESTS ================= */}

        <section className="requests-section">

          <div className="section-header">

            <div>

              <h2>
                Pharmacy Registration Requests
              </h2>

              <p>
                Review pharmacies waiting for approval.
              </p>

            </div>

            <div className="pending-count">
              {pendingPharmacies.length} Pending
            </div>

          </div>


          {loading ? (

            <div className="empty-state">
              Loading pharmacy requests...
            </div>

          ) : pendingPharmacies.length === 0 ? (

            <div className="empty-state">

              <CheckCircle size={40} />

              <h3>
                No pending requests
              </h3>

              <p>
                There are currently no pharmacies waiting for approval.
              </p>

            </div>

          ) : (

            <div className="pharmacy-list">

              {pendingPharmacies.map((pharmacy) => (

                <div
                  className="pharmacy-request"
                  key={pharmacy._id}
                >

                  <div className="pharmacy-info">

                    <div className="pharmacy-icon">
                      <Store size={25} />
                    </div>

                    <div>

                      <h3>
                        {pharmacy.name}
                      </h3>

                      <p>
                        Owner:{" "}
                        {pharmacy.owner?.name || "N/A"}
                      </p>

                      <p>
                        Email:{" "}
                        {pharmacy.owner?.email || "N/A"}
                      </p>

                      <p>
                        Phone:{" "}
                        {pharmacy.phone || "N/A"}
                      </p>

                      <p>
                        Address:{" "}
                        {pharmacy.address || "N/A"}
                      </p>
 <div className="license-preview">

  <p className="license-title">
    Pharmacy Licence
  </p>

  <iframe
    src={`http://localhost:5000/uploads/${pharmacy.licenseDocument}`}
    title="Pharmacy Licence"
    className="license-frame"
  />

  <a
    href={`http://localhost:5000/uploads/${pharmacy.licenseDocument}`}
    target="_blank"
    rel="noopener noreferrer"
    className="view-license-link"
  >
    Open Licence in New Tab
  </a>

</div>

                    </div>

                  </div>


                  <div className="pharmacy-actions">

                    <span className="pending-badge">
                      Pending
                    </span>

                    <button
                      className="approve-button"
                      onClick={() =>
                        verifyPharmacy(
                          pharmacy._id,
                          "approved"
                        )
                      }
                    >
                      <CheckCircle size={17} />
                      Approve
                    </button>

                    <button
                      className="reject-button"
                      onClick={() =>
                        verifyPharmacy(
                          pharmacy._id,
                          "rejected"
                        )
                      }
                    >
                      <XCircle size={17} />
                      Reject
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* ================= SECURITY ================= */}

        <div className="admin-security">

          <ShieldCheck size={18} />

          <span>
            Admin-only area. Pharmacy registrations require verification before becoming active.
          </span>

        </div>

      </main>

    </div>
  );
}