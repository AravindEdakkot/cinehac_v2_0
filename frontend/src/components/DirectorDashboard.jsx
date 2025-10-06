import React, { useState } from "react";
import ProductionDashboard from "./ProductionDashboard.jsx";
import PostProductionTracking from "./PostProductionTracking.jsx"; // Import the self-contained component

// --- Theme & Colors ---
const FONT_FAMILY = "Inter, sans-serif";
const PRIMARY_BG = "#101014";
const ACCENT_COLOR = "rgba(255, 255, 255, 0.15)";
const TEXT_COLOR = "rgba(255, 255, 255, 0.9)";
const SUBTLE_TEXT = "rgba(255, 255, 255, 0.6)";

const DirectorDashboard = () => {
  const [showProduction, setShowProduction] = useState(false);
  const [realProgress, setRealProgress] = useState(0);

  // State and handlers for Post Production are now REMOVED from this component

  const handleProgressUpdate = (progress) => {
    setRealProgress(progress);
  };

  const cardStyle = {
    padding: "2rem",
    borderRadius: "16px",
    background: "rgba(255, 255, 255, 0.02)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(15px)",
    WebkitBackdropFilter: "blur(15px)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  };

  const buttonStyle = {
    padding: "12px 20px",
    borderRadius: "10px",
    background: ACCENT_COLOR,
    color: TEXT_COLOR,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "1rem",
    fontFamily: FONT_FAMILY,
    transition: "0.2s ease-in-out",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: PRIMARY_BG,
        fontFamily: FONT_FAMILY,
        color: TEXT_COLOR,
        padding: "40px",
      }}
    >
      <h1 style={{ fontWeight: 700, fontSize: "2.5rem" }}>Director Dashboard 🎬</h1>
      <p style={{ color: SUBTLE_TEXT, marginBottom: "30px" }}>
        Manage your film workflow from production to post-production.
      </p>

      {/* Overall Progress Bar */}
      <div style={{ ...cardStyle, marginBottom: "30px" }}>
        <h2>Overall Progress</h2>
        <p style={{ color: SUBTLE_TEXT }}>{Math.round(realProgress)}% Complete</p>
        <div style={{ height: "10px", width: "100%", background: "rgba(255,255,255,0.1)", borderRadius: "8px", overflow: "hidden" }}>
          <div style={{ width: `${realProgress}%`, height: "100%", background: "#00cc66", transition: "width 0.4s ease-in-out" }} />
        </div>
      </div>

      {/* Production Section */}
      <div style={{ ...cardStyle, marginBottom: "30px" }}>
        <h2>Production & Preproduction Part</h2>
        <button style={buttonStyle} onClick={() => setShowProduction((prev) => !prev)}>
          {showProduction ? "Hide" : "View"} Production Schedule 📅
        </button>
        {showProduction && (
          <div style={{ marginTop: "30px" }}>
            <ProductionDashboard onProgressUpdate={handleProgressUpdate} />
          </div>
        )}
      </div>

      {/* Add Notes Section */}
      <div style={{ ...cardStyle, marginBottom: "30px" }}>
        <h2>Add Notes</h2>
        <textarea placeholder="Add notes for post-production team..." style={{ width: "100%", minHeight: "100px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: TEXT_COLOR, fontFamily: FONT_FAMILY, padding: "10px" }} />
        <button style={{ ...buttonStyle, marginTop: "10px" }} onClick={() => alert("Notes submitted to post-production team.")}>
          Submit Notes 📤
        </button>
      </div>

      {/* Simply render the component. No props needed. */}
      <PostProductionTracking />
    </div>
  );
};

export default DirectorDashboard;