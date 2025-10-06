import React, { useState } from "react";
import ProductionDashboard from "./ProductionDashboard.jsx";
import PostProductionTracking from "./PostProductionTracking.jsx"; // Import the new component

// --- Theme & Colors ---
const FONT_FAMILY = "Inter, sans-serif";
const PRIMARY_BG = "#101014";
const CARD_BG = "#1a1a1e";
const TEXT_COLOR = "rgba(255, 255, 255, 0.9)";
const SUBTLE_TEXT = "rgba(255, 255, 255, 0.6)";
const SUCCESS_COLOR = "#00cc66";
const WARNING_COLOR = "#ffcc00";
const ACTION_COLOR = "#3399ff";
const DANGER_COLOR = "#FF6384";
const CARD_BORDER = "rgba(255, 255, 255, 0.08)";

const ProductionManagerDashboard = () => {
  // --- STATE ---
  const [postProgress, setPostProgress] = useState([
    { stage: "Editing", progress: 75, status: 'in-progress' },
    { stage: "Sound Mixing", progress: 40, status: 'in-progress' },
    { stage: "Color Grading", progress: 10, status: 'pending' },
    { stage: "VFX & Final Review", progress: 25, status: 'at-risk' },
  ]);

  const [schedule, setSchedule] = useState([
    { id: 'S1.T4', scene: "Hedgehog in a cage - Close up", director: "Jane Doe", location: "Studio 2, Set A", status: "complete", shotProgress: 100, prediction: 'on-schedule', requiredResource: 'ARRI Alexa Mini' },
    { id: 'S1.T5', scene: "The Director's breakdown", director: "Jane Doe", location: "Studio 1, Office Set", status: "in-progress", shotProgress: 75, prediction: 'low-risk', requiredResource: 'Sound Mixer: Zoom F8' },
    { id: 'S2.T1', scene: "Chase sequence start", director: "John Smith", location: "Backlot, Street 5", status: "in-progress", shotProgress: 30, prediction: 'high-risk', requiredResource: 'Lighting: Aputure 600D' },
    { id: 'S2.T2', scene: "Warehouse shootout", director: "John Smith", location: "New Location: Warehouse", status: "pending", shotProgress: 0, prediction: 'med-risk', requiredResource: 'ARRI Alexa Mini' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showProduction, setShowProduction] = useState(false);

  // --- MOCK DATA ---
  const crew = ["Jane Doe", "John Smith", "Alex Chen (DP)", "Ben Willis (Sound)"];
  const locations = ["Studio 2, Set A", "Studio 1, Office Set", "Backlot, Street 5", "New Location: Warehouse", "Rooftop Set"];
  const resourceData = [
    { item: "Camera: ARRI Alexa Mini", quantity: 3, available: 1, dailyCost: 1500 },
    { item: "Sound Mixer: Zoom F8", quantity: 2, available: 2, dailyCost: 300 },
    { item: "Lighting: Aputure 600D", quantity: 6, available: 4, dailyCost: 150 },
  ];

  // --- STYLES ---
  const cardStyle = {
    padding: "20px",
    borderRadius: "10px",
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
  };

  const buttonStyle = (color = ACTION_COLOR) => ({
    padding: "10px 20px",
    borderRadius: "8px",
    background: color,
    color: PRIMARY_BG,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontFamily: FONT_FAMILY,
    textAlign: "center",
    width: "100%",
    marginTop: '10px'
  });

  // --- HELPERS ---
  const getPredictionColor = prediction => {
    switch (prediction) {
      case 'high-risk': return DANGER_COLOR;
      case 'med-risk': return WARNING_COLOR;
      case 'low-risk': return SUCCESS_COLOR;
      default: return ACTION_COLOR;
    }
  };

  const formatPrediction = prediction => {
    return prediction.replace('-', ' ').toUpperCase();
  };

  // --- HANDLERS ---
  const handlePostProgressUpdate = (stageName, newProgress, newStatus) => {
    setPostProgress(prev => prev.map(stage => stage.stage === stageName ? { ...stage, progress: newProgress, status: newStatus } : stage));
  };

  const handleDynamicReschedule = () => {
    // ... (logic remains the same)
  };

  const handleAddScene = (newScene) => {
    setSchedule(prev => [...prev, newScene]);
    setIsModalOpen(false);
  };

  // --- SUB-COMPONENTS (Only AddSceneForm remains here) ---
  const AddSceneForm = ({ onAddScene, onClose }) => {
    // ... (logic remains the same)
  };
  
  return (
    <div style={{ minHeight: "100vh", background: PRIMARY_BG, fontFamily: FONT_FAMILY, color: TEXT_COLOR, padding: "40px" }}>
      {isModalOpen && <AddSceneForm onAddScene={handleAddScene} onClose={() => setIsModalOpen(false)} />}
      
      <h1 style={{ fontWeight: 700, fontSize: "2.5rem", marginBottom: "10px" }}>
        Production Manager Console 🛠️
      </h1>
      <p style={{ color: SUBTLE_TEXT, marginBottom: "40px" }}>Daily operations, scheduling, and resource management.</p>

      {/* --- Dashboard Grids --- */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px", marginBottom: "40px" }}>
        <div style={cardStyle}>
          <h2 style={{ marginBottom: "20px" }}>Daily Operations</h2>
          <button style={buttonStyle(ACTION_COLOR)} onClick={() => setIsModalOpen(true)}>+ Add New Scene</button>
          <button style={buttonStyle(WARNING_COLOR)} onClick={handleDynamicReschedule}>Dynamic Reschedule 🔄</button>
        </div>

        <div style={cardStyle}>
          <h2 style={{ marginBottom: "15px" }}>Equipment & Resources</h2>
          {resourceData.map((res, index) => (
            <div key={index} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${CARD_BORDER}` }}>
              <span>{res.item}</span>
              <span style={{ color: res.available > 0 ? SUCCESS_COLOR : DANGER_COLOR, fontWeight: 600 }}>{res.available} / {res.quantity} Available</span>
            </div>
          ))}
        </div>

        <div style={cardStyle}>
          <h2 style={{ marginBottom: "15px" }}>AI Overrun Prediction 🧠</h2>
          {schedule.filter(s => s.status !== 'complete').map(s => (
            <div key={s.id} style={{ padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', borderLeft: `4px solid ${getPredictionColor(s.prediction)}`, marginBottom: "10px" }}>
              <p style={{ margin: 0, fontWeight: 600, color: getPredictionColor(s.prediction) }}>
                {s.id}: {formatPrediction(s.prediction)}
              </p>
              <span style={{ fontSize: '0.8rem', color: SUBTLE_TEXT }}>{s.scene}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...cardStyle, marginBottom: "30px" }}>
        <h2>Production Schedule </h2>
        <button style={buttonStyle()} onClick={() => setShowProduction(prev => !prev)}>
          {showProduction ? "Hide" : "View"} Production Dashboard
        </button>
        {showProduction && <div style={{ marginTop: "30px" }}> <ProductionDashboard /></div>}
      </div>

      {/* Use the new, reusable component */}
      <PostProductionTracking 
        postProgress={postProgress} 
        onUpdate={handlePostProgressUpdate} 
      />
    </div>
  );
};

export default ProductionManagerDashboard;