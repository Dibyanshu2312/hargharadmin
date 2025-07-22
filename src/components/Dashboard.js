import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useApi"; // Assuming this hook provides logout functionality
import AnganwadiAdd from "./Anganwadiadd"; // Assuming this component handles the registration form

// Icons using SVG for better scalability and customization
const icons = {
  register: (
    <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19v-6M9 16h6" />
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21a8.38 8.38 0 0 1 13 0" />
    </svg>
  ),
  logout: (
    <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

// Reusable Button Component for the Sidebar
const SidebarButton = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      background: "transparent",
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
    <span style={{ width: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</span>
    <span>{label}</span>
  </button>
);

// Student Card Component
const StudentCard = ({ student, onClick, isMobile }) => (
  <div
    onClick={() => onClick(student)}
    style={{
      background: "#fff",
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
      transition: "transform 0.2s",
    }}
    onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
    onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
  >
    <div style={{ 
      fontWeight: "bold", 
      fontSize: isMobile ? 14 : 18, 
      color: "#2E7D32" 
    }}>
      {student.childName || student.name || "N/A"}
    </div>
    <div style={{ fontSize: isMobile ? 12 : 14 }}>
      {student.parentName || student.guardian_name || student.father_name || "-"}
    </div>
    <div style={{ fontSize: isMobile ? 12 : 14 }}>
      {student.mobileNumber || student.username || "-"}
    </div>
    <div style={{ fontSize: isMobile ? 12 : 14 }}>
      {student.village || student.address || "-"}
    </div>
    <div style={{ fontSize: isMobile ? 12 : 14 }}>
      Plant Distributed: {student.plantDistributed ? "Yes" : "No"}
    </div>
    {student.registrationDate && (
      <div style={{ fontSize: isMobile ? 12 : 14 }}>
        <strong>Registered:</strong> {student.registrationDate}
      </div>
    )}
  </div>
);

// Statistic Card Component
const StatCard = ({ label, value, icon, isMobile }) => (
  <div
    style={{
      background: "#fff",
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
    <div style={{ 
      fontSize: isMobile ? 20 : 28, 
      fontWeight: "bold", 
      color: "#2E7D32", 
      marginTop: isMobile ? 4 : 8 
    }}>
      {value}
    </div>
  </div>
);

// Registration Modal Component
const RegisterModal = ({ open, onClose, isMobile }) => {
  if (!open) return null;
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
          maxWidth: isMobile ? "95%" : "800px",
          maxHeight: "95vh",
          overflowY: "auto",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close registration form"
          style={{
            position: "absolute",
            top: isMobile ? 8 : 12,
            right: isMobile ? 12 : 16,
            border: "none",
            background: "transparent",
            fontSize: isMobile ? 24 : 28,
            cursor: "pointer",
          }}
        >
          &times;
        </button>
        <AnganwadiAdd />
      </div>
    </div>
  );
};

// Student Detail Modal Component
const StudentDetailModal = ({ student, onClose, isMobile }) => {
  if (!student) return null;
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
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close student details"
          style={{
            position: "absolute",
            top: isMobile ? 8 : 12,
            right: isMobile ? 12 : 16,
            border: "none",
            background: "transparent",
            fontSize: isMobile ? 24 : 28,
            cursor: "pointer",
          }}
        >
          &times;
        </button>
        <h2 style={{ 
          marginBottom: 16, 
          fontSize: isMobile ? 18 : 24,
          marginTop: isMobile ? 20 : 0
        }}>
          Student Details
        </h2>
        {Object.entries(student).map(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            return (
              <div key={key} style={{ 
                marginBottom: '8px',
                fontSize: isMobile ? 14 : 16
              }}>
                <strong>{formattedKey}:</strong> {String(value)}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const navigate = useNavigate();
  const { logout: apiLogout } = useAuth(); // Destructuring logout from useAuth hook

  const [allStudents, setAllStudents] = useState([]);
  const [stats, setStats] = useState({ total: 0, uniqueVillages: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
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



  // Function to fetch student data
  const fetchAllStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("http://165.22.208.62:5000/data");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const html = await res.text();

      // Check if DOMParser is available
      if (typeof window.DOMParser === 'undefined') {
        console.error("DOMParser is not supported in this environment.");
        return;
      }

      const doc = new window.DOMParser().parseFromString(html, "text/html");
      const table = doc.querySelector("table");

      if (!table) {
        console.warn("No table found in the fetched HTML data.");
        setAllStudents([]); // Ensure students array is cleared if no table
        setStats({ total: 0, uniqueVillages: 0 });
        return;
      }

      const cols = [...table.querySelectorAll("th")].map((th) => th.textContent.trim());
      const rows = [...table.querySelectorAll("tbody tr")].map((tr) => {
        const obj = {};
        const tds = [...tr.querySelectorAll("td")];
        cols.forEach((col, i) => {
          // Corrected: Removed the erroneous backslash before [i]
          obj[(col || `column${i}`).trim()] = (tds.length > i ? tds[i].textContent.trim() : '');
        });
        return obj;
      });

      // Filter out incomplete records
      const cleanedRows = rows.filter((student) => {
        const hasName = student.name?.trim() || student.childName?.trim();
        const hasContact = student.mobileNumber?.trim() || student.username?.trim();
        return hasName && hasContact;
      });

      setAllStudents(cleanedRows);
      setStats({
        total: cleanedRows.length,
        uniqueVillages: new Set(cleanedRows.map((s) => s.village || s.address).filter(Boolean)).size, // Filter out empty strings
      });
    } catch (err) {
      console.error("Error fetching or parsing student data:", err);
      // Optionally show an error message to the user
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is created once

  // Fetch data on component mount
  useEffect(() => {
    fetchAllStudents();
  }, [fetchAllStudents]); // Depend on fetchAllStudents (which is useCallback memoized)

  // Memoized filtering of students based on search query
  const filteredStudents = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return allStudents.filter(
      (s) =>
        (s.childName || s.name || "").toLowerCase().includes(q) ||
        (s.mobileNumber || s.username || "").toLowerCase().includes(q)
    );
  }, [allStudents, searchQuery]);

  // Handle user logout
  const handleLogout = useCallback(async () => {
    try {
      await apiLogout(); // Call the logout function from your auth hook
      navigate("/"); // Redirect to the home/login page
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle logout error, e.g., show a notification
    }
  }, [apiLogout, navigate]);

  // Handle dashboard selection change
  const handleDashboardSelect = useCallback((e) => {
    const value = e.target.value;
    console.log('Dashboard selection:', value); // Debug log
    if (value === "student") {
      navigate("/dashboard");
    } else if (value === "anganvadi") {
      navigate("/anganvadi-dashboard");
    }
  }, [navigate]);

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
          background: "linear-gradient(180deg,#2E7D32,#388e3c)",
          color: "#fff",
          display: "flex",
          flexDirection: isMobile ? "row" : "column",
          padding: isMobile ? "16px" : "32px 0",
          justifyContent: isMobile ? "space-between" : "flex-start",
          alignItems: isMobile ? "center" : "stretch",
          flexWrap: isMobile ? "wrap" : "nowrap",
        }}
      >
        <div style={{ 
          fontWeight: "bold", 
          fontSize: isMobile ? "18px" : "24px", 
          textAlign: "center", 
          marginBottom: isMobile ? "0" : "24px",
          flex: isMobile ? "1" : "none"
        }}>
          🌳 हर घर मुंगा
        </div>
        
        {isMobile ? (
          // Mobile layout - horizontal buttons
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              onClick={() => setShowRegisterModal(true)}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                color: "#fff",
                padding: "8px 12px",
                fontSize: "14px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Register
            </button>
            <button
              onClick={handleLogout}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                color: "#fff",
                padding: "8px 12px",
                fontSize: "14px",
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
              <label htmlFor="dashboard-select" style={{ 
                color: "#fff", 
                fontSize: 14, 
                marginBottom: 8, 
                display: "block",
                fontWeight: "bold"
              }}>
                Choose Dashboard
              </label>
              <select
                id="dashboard-select"
                onChange={handleDashboardSelect}
                value="student"
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
            <SidebarButton icon={icons.register} label="Register" onClick={() => setShowRegisterModal(true)} />
            <div style={{ flex: 1 }} />
            <SidebarButton icon={icons.logout} label="Logout" onClick={handleLogout} />
          </>
        )}
      </aside>

      {/* Main Content Area */}
      <main style={{ 
        flex: 1, 
        padding: isMobile ? "20px 0" : "40px 0", 
        overflowY: "auto", 
        background: "#f5f5f5" 
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
              <label htmlFor="mobile-dashboard-select" style={{ 
                color: "#333", 
                fontSize: 14, 
                marginBottom: 8, 
                display: "block",
                fontWeight: "bold"
              }}>
                Choose Dashboard
              </label>
              <select
                id="mobile-dashboard-select"
                onChange={handleDashboardSelect}
                value="student"
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

          {/* Stat Cards */}
          <div style={{ 
            display: "flex", 
            gap: isMobile ? 8 : 16, 
            flexWrap: "wrap", 
            justifyContent: "center", 
            marginBottom: isMobile ? 20 : 32 
          }}>
            <StatCard label="Total Students" value={stats.total} icon="👨‍🎓" isMobile={isMobile} />
            <StatCard label="Unique Villages" value={stats.uniqueVillages} icon="🏡" isMobile={isMobile} />
          </div>

          {/* Search Bar */}
          <div style={{ 
            background: "#fff", 
            borderRadius: 16, 
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)", 
            padding: isMobile ? 16 : 24, 
            marginBottom: isMobile ? 20 : 32 
          }}>
            <form onSubmit={(e) => e.preventDefault()} style={{ 
              display: "flex", 
              gap: 12, 
              alignItems: "center",
              flexDirection: isMobile ? "column" : "row"
            }}>
              <svg width="24" height="24" fill="none" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or mobile number"
                style={{ 
                  padding: 12, 
                  borderRadius: 8, 
                  border: "1px solid #ccc", 
                  fontSize: 16, 
                  flex: 1,
                  width: isMobile ? "100%" : "auto"
                }}
                aria-label="Search students"
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
                  width: isMobile ? "100%" : "auto"
                }}
              >
                Search
              </button>
            </form>
          </div>

          {/* Registered Students Section */}
          <div style={{ 
            background: "#fff", 
            borderRadius: 16, 
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)", 
            padding: isMobile ? 16 : 24 
          }}>
            <h2 style={{ marginBottom: isMobile ? 16 : 24 }}>Registered Students</h2>
            {loading ? (
              <div style={{ textAlign: "center", padding: "20px" }}>Loading student data...</div>
            ) : filteredStudents.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>No matching student data found.</div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: isMobile ? 8 : 16,
                  justifyContent: "flex-start",
                }}
              >
                {filteredStudents.map((s, i) => (
                  <StudentCard 
                    key={s.id || s.childName + s.mobileNumber + i} 
                    student={s} 
                    onClick={setSelectedStudent} 
                    isMobile={isMobile}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <RegisterModal open={showRegisterModal} onClose={() => setShowRegisterModal(false)} isMobile={isMobile} />
      <StudentDetailModal student={selectedStudent} onClose={() => setSelectedStudent(null)} isMobile={isMobile} />
    </div>
  );
};

export default Dashboard;