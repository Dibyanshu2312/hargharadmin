// src/components/AnganvadiDashboard.js
import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useApi";

/* -------------------------------------------------- */
/*  Icons                                             */
/* -------------------------------------------------- */
const icons = {
  dashboard: (
    <svg
      width="24"
      height="24"
      fill="none"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" />
      <rect x="3" y="16" width="7" height="5" />
    </svg>
  ),
  logout: (
    <svg
      width="24"
      height="24"
      fill="none"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

/* -------------------------------------------------- */
/*  Small reusable pieces                             */
/* -------------------------------------------------- */
const SidebarButton = ({ icon, label, onClick, active = false }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      background: active ? "#388e3c" : "transparent",
      border: "none",
      color: "#fff",
      padding: "14px 20px",
      width: "100%",
      fontSize: 16,
      fontWeight: 500,
      cursor: "pointer",
      borderRadius: 10,
      marginBottom: 8,
      transition: "background 0.2s",
    }}
  >
    <span
      style={{
        width: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </span>
    <span>{label}</span>
  </button>
);

const StatCard = ({ label, value, icon, isMobile }) => (
  <div
    style={{
      background: "white",
      borderRadius: 16,
      padding: isMobile ? 16 : 32,
      boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
      minWidth: isMobile ? 140 : 180,
      textAlign: "center",
      flex: "1 1 140px",
      margin: isMobile ? 4 : 8,
    }}
  >
    <div style={{ fontSize: isMobile ? 24 : 32 }}>{icon}</div>
    <div style={{ 
      fontSize: isMobile ? 14 : 18, 
      color: "#666", 
      marginTop: isMobile ? 4 : 8 
    }}>
      {label}
    </div>
    <div
      style={{
        fontSize: isMobile ? 20 : 28,
        fontWeight: "bold",
        color: "#2E7D32",
        marginTop: isMobile ? 4 : 8,
      }}
    >
      {value}
    </div>
  </div>
);

/* -------------------------------------------------- */
/*  Card + Detail Modal                               */
/* -------------------------------------------------- */
const Card = ({ item, onClick, isMobile }) => (
  <div
    onClick={() => onClick(item)}
    style={{
      background: "white",
      borderRadius: 12,
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      padding: isMobile ? 12 : 20,
      margin: isMobile ? 4 : 8,
      minWidth: isMobile ? 150 : 260,
      maxWidth: isMobile ? 180 : 320,
      flex: isMobile ? "1 1 150px" : "1 1 260px",
      display: "flex",
      flexDirection: "column",
      gap: isMobile ? 4 : 8,
      cursor: "pointer",
      transition: "transform 0.2s ease-in-out",
    }}
    onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
    onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
  >
    <div style={{ 
      fontWeight: "bold", 
      fontSize: isMobile ? 14 : 18, 
      color: "#2E7D32" 
    }}>
      {item.aanganwaadi_id}
    </div>
    <div style={{ fontSize: isMobile ? 12 : 14 }}>
      <strong>Name:</strong> {item.name}
    </div>
    <div style={{ fontSize: isMobile ? 12 : 14 }}>
      <strong>Block:</strong> {item.block}
    </div>
    <div style={{ fontSize: isMobile ? 12 : 14 }}>
      <strong>Contact:</strong> {item.contact_number}
    </div>
  </div>
);

const DetailModal = ({ record, onClose, isMobile }) => {
  if (!record) return null;

  // Helper to show each field only if it exists
  const Row = ({ label, value }) =>
    value ? (
      <div style={{ 
        marginBottom: 10,
        fontSize: isMobile ? 14 : 16
      }}>
        <strong>{label}:</strong> {value}
      </div>
    ) : null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: isMobile ? "10px" : "20px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: isMobile ? 16 : 32,
          width: "90%",
          maxWidth: isMobile ? "95%" : "600px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 5px 20px rgba(0,0,0,0.25)",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: isMobile ? 8 : 12,
            right: isMobile ? 12 : 16,
            background: "transparent",
            border: "none",
            fontSize: isMobile ? 24 : 28,
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          &times;
        </button>

        <h2 style={{ 
          marginBottom: 20, 
          color: "#2E7D32",
          fontSize: isMobile ? 18 : 24,
          marginTop: isMobile ? 20 : 0
        }}>
          Anganwadi Details
        </h2>

        <Row label="Anganwadi ID" value={record.aanganwaadi_id} />
        <Row label="Code" value={record.aanganwadi_code} />
        <Row label="Name" value={record.name} />
        <Row label="Role" value={record.role} />
        <Row label="Block" value={record.block} />
        <Row label="Gram" value={record.gram} />
        <Row label="Tehsil" value={record.tehsil} />
        <Row label="Zila" value={record.zila} />
        <Row label="Contact" value={record.contact_number} />
        <Row label="Created At" value={record.created_at} />
        {/* add more fields as needed */}
      </div>
    </div>
  );
};

/* -------------------------------------------------- */
/*  MAIN: AnganvadiDashboard                          */
/* -------------------------------------------------- */
const AnganvadiDashboard = () => {
  console.log("AnganvadiDashboard mounted");

  const navigate = useNavigate();
  const { logout: apiLogout } = useAuth();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ total: 0, uniqueVillages: 0 });
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  /* Fetch JSON data */
  useEffect(() => {
    const fetchAll = async () => {
      console.log("Fetching Anganvadi data…");
      setLoading(true);
      try {
        const res = await fetch("http://165.22.208.62:5000/searchAng");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const rows = await res.json();
        console.log("Fetched rows:", rows.length);
        setRecords(rows);
        setStats({
          total: rows.length,
          uniqueVillages: new Set(rows.map((r) => r.gram || r.zila || "")).size,
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setRecords([]);
        setStats({ total: 0, uniqueVillages: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  /* Search filter */
  const filteredRecords = useMemo(() => {
    if (!searchQuery.trim()) return records;
    const q = searchQuery.toLowerCase();
    return records.filter(
      (r) =>
        (r.aanganwaadi_id || "").toLowerCase().includes(q) ||
        (r.name || "").toLowerCase().includes(q) ||
        (r.contact_number || "").toLowerCase().includes(q)
    );
  }, [records, searchQuery]);

  /* Actions */
  const handleLogout = async () => {
    await apiLogout();
    navigate("/");
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#f5f5f5", 
      display: "flex", 
      flexDirection: isMobile ? "column" : "row" 
    }}>
      {/* Sidebar */}
      <aside
        style={{
          width: isMobile ? "100%" : "260px",
          minHeight: isMobile ? "auto" : "100vh",
          background: "linear-gradient(180deg, #2E7D32, #388e3c)",
          color: "#fff",
          display: "flex",
          flexDirection: isMobile ? "row" : "column",
          padding: isMobile ? "16px" : "32px 0",
          justifyContent: isMobile ? "space-between" : "flex-start",
          alignItems: isMobile ? "center" : "stretch",
          flexWrap: isMobile ? "wrap" : "nowrap",
          boxShadow: "2px 0 12px rgba(44,62,80,0.06)",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            fontSize: isMobile ? "16px" : "24px",
            textAlign: "center",
            marginBottom: isMobile ? "0" : "24px",
            flex: isMobile ? "1" : "none",
          }}
        >
          🌿 Anganvadi Dashboard
        </div>

        {isMobile ? (
          // Mobile layout - horizontal buttons
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/dashboard")}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                color: "#fff",
                padding: "8px 12px",
                fontSize: "12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Student Dashboard
            </button>
            <button
              onClick={handleLogout}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                color: "#fff",
                padding: "8px 12px",
                fontSize: "12px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          // Desktop layout - vertical sidebar
          <>
            <div style={{ padding: "0 20px", marginBottom: 24 }}>
              <label htmlFor="anganvadi-dashboard-select" style={{ 
                color: "#fff", 
                fontSize: 14, 
                marginBottom: 8, 
                display: "block",
                fontWeight: "bold"
              }}>
                Choose Dashboard
              </label>
              <select
                id="anganvadi-dashboard-select"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "student") {
                    navigate("/dashboard");
                  } else if (value === "anganvadi") {
                    navigate("/anganvadi-dashboard");
                  }
                }}
                value="anganvadi"
                style={{ 
                  width: "100%", 
                  padding: 12, 
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  fontSize: 16,
                  backgroundColor: "#fff",
                  color: "#333",
                  cursor: "pointer"
                }}
              >
                <option value="student">Student Dashboard</option>
                <option value="anganvadi">Anganvadi Dashboard</option>
              </select>
            </div>

            <SidebarButton
              icon={icons.dashboard}
              label="Back to Student Dashboard"
              onClick={() => navigate("/dashboard")}
            />

            <div style={{ flex: 1 }} />

            <SidebarButton
              icon={icons.logout}
              label="Logout"
              onClick={handleLogout}
            />
          </>
        )}
      </aside>

      {/* Main */}
      <main style={{ 
        flex: 1, 
        padding: isMobile ? "20px 0" : "40px 0", 
        overflowY: "auto" 
      }}>
        <div style={{ 
          maxWidth: 1200, 
          margin: "0 auto", 
          padding: isMobile ? "0 16px" : "0 32px" 
        }}>
          {/* Dashboard Selector for Mobile */}
          {isMobile && (
            <div style={{ 
              background: "#fff", 
              borderRadius: 12, 
              padding: 16, 
              marginBottom: 20,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
            }}>
              <label htmlFor="mobile-anganvadi-dashboard-select" style={{ 
                color: "#333", 
                fontSize: 14, 
                marginBottom: 8, 
                display: "block",
                fontWeight: "bold"
              }}>
                Choose Dashboard
              </label>
              <select
                id="mobile-anganvadi-dashboard-select"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "student") {
                    navigate("/dashboard");
                  } else if (value === "anganvadi") {
                    navigate("/anganvadi-dashboard");
                  }
                }}
                value="anganvadi"
                style={{ 
                  width: "100%", 
                  padding: 12, 
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  fontSize: 16,
                  backgroundColor: "#fff",
                  color: "#333",
                  outline: "none",
                  cursor: "pointer"
                }}
              >
                <option value="student">Student Dashboard</option>
                <option value="anganvadi">Anganvadi Dashboard</option>
              </select>
            </div>
          )}

          {/* Stats */}
          <div
            style={{
              display: "flex",
              gap: isMobile ? 8 : 16,
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: isMobile ? 20 : 32,
            }}
          >
            <StatCard label="Total Anganwadi" value={stats.total} icon="🏫" isMobile={isMobile} />
            <StatCard
              label="Unique Villages"
              value={stats.uniqueVillages}
              icon="🏡"
              isMobile={isMobile}
            />
          </div>

          {/* Search */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              padding: isMobile ? 16 : 24,
              marginBottom: isMobile ? 20 : 32,
            }}
          >
            <form
              onSubmit={(e) => e.preventDefault()}
              style={{ 
                display: "flex", 
                gap: 12, 
                alignItems: "center",
                flexDirection: isMobile ? "column" : "row"
              }}
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#2E7D32"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ID, Name, or Mobile"
                style={{
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  fontSize: 16,
                  flex: 1,
                  width: isMobile ? "100%" : "auto"
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "12px 28px",
                  borderRadius: 8,
                  background: "#4CAF50",
                  color: "#fff",
                  border: "none",
                  fontSize: 16,
                  fontWeight: 500,
                  width: isMobile ? "100%" : "auto"
                }}
              >
                Search
              </button>
            </form>
          </div>

          {/* Cards Grid */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              padding: isMobile ? 16 : 24,
            }}
          >
            <h2 style={{ marginBottom: isMobile ? 16 : 24 }}>Anganwadi Records</h2>
            {loading ? (
              <div style={{ textAlign: "center", padding: "20px" }}>Loading…</div>
            ) : filteredRecords.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>No matching data.</div>
            ) : (
              <div style={{ 
                display: "flex", 
                flexWrap: "wrap", 
                gap: isMobile ? 8 : 16,
                justifyContent: "flex-start"
              }}>
                {filteredRecords.map((rec, i) => (
                  <Card
                    key={rec.id || i}
                    item={rec}
                    onClick={setSelectedRecord}
                    isMobile={isMobile}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Detail popup */}
      <DetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
        isMobile={isMobile}
      />
    </div>
  );
};

export default AnganvadiDashboard;
