import React, { useState, useEffect } from "react";

// --- Theme & Colors ---
const FONT_FAMILY = "Inter, sans-serif";
const PRIMARY_BG = "#101014";
const CARD_BG = "#1a1a1e";
const ACCENT_COLOR = "rgba(255, 255, 255, 0.15)";
const TEXT_COLOR = "rgba(255, 255, 255, 0.9)";
const SUBTLE_TEXT = "rgba(255, 255, 255, 0.6)";
const SUCCESS_COLOR = "#00cc66";
const WARNING_COLOR = "#ffcc00";
const ACTION_COLOR = "#3399ff";
const CARD_BORDER = "rgba(255, 255, 255, 0.08)";

// --- Helper Functions ---
const getStatusColor = (status) => {
    switch (status) {
        case 'completed': return SUCCESS_COLOR;
        case 'in-progress': return ACTION_COLOR;
        case 'at-risk': return WARNING_COLOR;
        case 'pending': return SUBTLE_TEXT;
        default: return SUBTLE_TEXT;
    }
};

const inputStyle = {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    outline: "none",
    background: PRIMARY_BG,
    color: TEXT_COLOR,
    fontFamily: FONT_FAMILY,
    fontSize: "0.9rem",
    width: "100%",
    boxSizing: "border-box",
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

// --- Update Form Sub-Component ---
const PostProductionUpdateForm = ({ postProgress, onUpdate }) => {
    const [stage, setStage] = useState(postProgress[0]?.stage || '');
    const [progress, setProgress] = useState(postProgress[0]?.progress || 0);
    const [status, setStatus] = useState(postProgress[0]?.status || 'pending');

    useEffect(() => {
        const selectedStageData = postProgress.find(p => p.stage === stage);
        if (selectedStageData) {
            setProgress(selectedStageData.progress);
            setStatus(selectedStageData.status);
        }
    }, [stage, postProgress]);

    const handleSubmit = e => {
        e.preventDefault();
        if (stage && progress >= 0 && progress <= 100) {
            onUpdate(stage, parseInt(progress), status);
        } else {
            alert("Please select a stage and provide a valid progress value (0-100).");
        }
    };

    const statusOptions = ['pending', 'in-progress', 'at-risk', 'completed'];

    return (
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr auto', gap: '15px', alignItems: 'center', borderTop: `1px solid ${CARD_BORDER}`, marginTop: '20px', paddingTop: '20px' }}>
            <select value={stage} onChange={e => setStage(e.target.value)} style={inputStyle}>
                <option value="" disabled>Select Stage...</option>
                {postProgress.map(p => <option key={p.stage} value={p.stage}>{p.stage}</option>)}
            </select>
            <input type="number" value={progress} onChange={e => setProgress(e.target.value)} style={inputStyle} min="0" max="100" placeholder="Progress %" />
            <select value={status} onChange={e => setStatus(e.target.value)} style={inputStyle}>
                {statusOptions.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
            <button type="submit" style={{ ...buttonStyle(SUCCESS_COLOR), width: 'auto', marginTop: 0 }}>Update</button>
        </form>
    );
};

// --- Main Exported Component ---
const PostProductionTracking = () => {
    // 1. State is now managed INSIDE this component
    const [postProgress, setPostProgress] = useState([
        { stage: "Editing", progress: 70, status: "in-progress" },
        { stage: "Sound Mixing", progress: 40, status: "in-progress" },
        { stage: "Color Grading", progress: 20, status: "pending" },
        { stage: "VFX & Final Review", progress: 0, status: "pending" },
    ]);

    // 2. The update handler is also INSIDE this component
    const handleUpdate = (stageName, newProgress, newStatus) => {
        setPostProgress(prev =>
            prev.map(stage =>
                stage.stage === stageName
                    ? { ...stage, progress: newProgress, status: newStatus }
                    : stage
            )
        );
    };

    const cardStyle = {
        padding: "20px",
        borderRadius: "10px",
        background: CARD_BG,
        border: `1px solid ${CARD_BORDER}`,
    };

    return (
        <div style={{ ...cardStyle, marginBottom: "40px" }}>
            <h2 style={{ marginBottom: "20px" }}>Post-Production Tracking 🎞️</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
                {postProgress.map((stage) => (
                    <div key={stage.stage} style={{ padding: "15px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", borderLeft: `5px solid ${getStatusColor(stage.status)}` }}>
                        <p style={{ margin: "0 0 10px 0", color: TEXT_COLOR, fontWeight: 600 }}>
                            {stage.stage}
                            <span style={{ float: "right", fontWeight: 700, color: getStatusColor(stage.status) }}>
                                {stage.progress}%
                            </span>
                        </p>
                        <div style={{ height: "6px", background: ACCENT_COLOR, borderRadius: "3px" }}>
                            <div style={{ width: `${stage.progress}%`, height: "100%", background: getStatusColor(stage.status), borderRadius: "3px", transition: "width 0.5s ease-in-out" }} />
                        </div>
                        <span style={{ fontSize: "0.85rem", color: SUBTLE_TEXT, marginTop: "8px", display: "block" }}>
                            Status: {stage.status.replace("-", " ").toUpperCase()}
                        </span>
                    </div>
                ))}
            </div>
            {/* 3. The component uses its own state and handler */}
            <PostProductionUpdateForm postProgress={postProgress} onUpdate={handleUpdate} />
        </div>
    );
};

export default PostProductionTracking;