import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// --- Theme Colors ---
const FONT_FAMILY = "Inter, sans-serif";
const PRIMARY_BG = "#101014"; // Main dark background
const CARD_BG = "#1a1a1e"; // New darker background for cards
const ACCENT_COLOR = "rgba(255, 255, 255, 0.15)";
const HOVER_COLOR = "rgba(255, 255, 255, 0.3)";
const TEXT_COLOR = "rgba(255, 255, 255, 0.9)";
const SUBTLE_TEXT = "rgba(255, 255, 255, 0.6)";
const SUCCESS_COLOR = "#00cc66";
const WARNING_COLOR = "#ffcc00";
const ACTION_COLOR = "#3399ff";
const EXPENSE_COLOR = "#FF6384";
const CARD_BORDER = "rgba(255, 255, 255, 0.08)"; // Subtle border for separation

// --- Mock Data Initialization ---
const INITIAL_EXPENSES = [
  { id: 1, item: "Camera Gear Rental Extension", amount: 8500, status: "pending" },
  { id: 2, item: "Hedgehog Trainer Fee", amount: 1500, status: "approved" },
  { id: 3, item: "Location Permit - Street 5", amount: 3200, status: "pending" },
  { id: 4, item: "Catering (Week 1)", amount: 7800, status: "approved" },
];

const initialSpent = INITIAL_EXPENSES
  .filter(e => e.status === "approved")
  .reduce((sum, e) => sum + e.amount, 0);

const ProducerDashboard = () => {
  // --- State ---
  const [targetBudget, setTargetBudget] = useState(150000);

  const [budgetData, setBudgetData] = useState([
    { name: "Target", amount: 150000 },
    { name: "Spent", amount: initialSpent },
  ]);

  const [script, setScript] = useState("");
  const [breakdown, setBreakdown] = useState({ estimatedBudget: 125000, totalScenes: 45 });
  const [schedule, setSchedule] = useState([
    { day: 1, location: "Studio A", scenes: [1, 2, 3] },
    { day: 2, location: "Street 5", scenes: [4, 5] },
  ]);
  const [callSheet, setCallSheet] = useState([
    { day: 1, callTime: "07:00", location: "Studio A" },
    { day: 2, callTime: "06:30", location: "Street 5" },
  ]);
  const [approvals, setApprovals] = useState(INITIAL_EXPENSES);
  const [postProgress, setPostProgress] = useState([
    { stage: "Editing", progress: 75, status: 'on-track' },
    { stage: "Sound Mixing", progress: 40, status: 'on-track' },
    { stage: "VFX", progress: 25, status: 'at-risk' },
    { stage: "Color Grading", progress: 10, status: 'at-risk' },
  ]);
  const [taskData] = useState([
    { department: "Art", progress: 85 },
    { department: "Camera", progress: 65 },
    { department: "VFX", progress: 10 },
  ]);
  const [sceneData] = useState([
    { day: "Day 1", completed: 3 },
    { day: "Day 2", completed: 2 },
    { day: "Day 3", completed: 4 },
    { day: "Day 4", completed: 3 },
    { day: "Day 5", completed: 6 },
  ]);

  // --- Helpers ---
  const formatCurrency = (value) => value ? `$${value.toLocaleString()}` : "$0";

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return SUCCESS_COLOR;
      case 'on-track':
        return ACTION_COLOR;
      case 'at-risk':
        return WARNING_COLOR;
      case 'pending':
        return SUBTLE_TEXT;
      default:
        return SUBTLE_TEXT;
    }
  };

  const cardStyle = {
    padding: "20px",
    borderRadius: "10px",
    background: CARD_BG,
    border: `1px solid ${CARD_BORDER}`,
  };

  const graphContainerStyle = {
    padding: "20px",
    borderRadius: "10px",
    background: PRIMARY_BG,
    border: "none",
  };

  // --- DYNAMIC PERCENTAGE CALCULATIONS ---
  const totalBudget = budgetData.find(b => b.name === 'Target')?.amount || 0;
  const totalSpent = budgetData.find(b => b.name === 'Spent')?.amount || 0;
  const remainingBudget = totalBudget - totalSpent;

  const budgetPercent = totalBudget > 0
    ? Math.round((totalSpent / totalBudget) * 100)
    : 0;

  const totalScenes = breakdown.totalScenes;
  const scenesCompleted = sceneData.reduce((sum, day) => sum + day.completed, 0);
  const progressPercent = totalScenes > 0
    ? Math.round((scenesCompleted / totalScenes) * 100)
    : 0;

  // --- Derived State for Expense Breakdown Chart ---
  const expenseBreakdownData = approvals.map(expense => ({
    item: expense.item,
    amount: expense.amount,
  })).sort((a, b) => b.amount - a.amount);

  // --- Handlers ---
  const handleSetBudget = () => {
    if (!targetBudget) return alert("Enter a target budget");
    setBudgetData([
      { name: "Target", amount: targetBudget },
      { name: "Spent", amount: budgetData.find(d => d.name === 'Spent').amount },
    ]);
    alert(`Target budget set to ${formatCurrency(targetBudget)}!`);
  };

  const handleApproval = (id) => {
    const expenseToApprove = approvals.find(item => item.id === id);
    if (!expenseToApprove || expenseToApprove.status === 'approved') return;

    setApprovals((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "approved" } : item))
    );

    setBudgetData(prevData => {
      const spentEntry = prevData.find(d => d.name === 'Spent');
      const newSpent = spentEntry.amount + expenseToApprove.amount;
      return prevData.map(d =>
        d.name === 'Spent' ? { ...d, amount: newSpent } : d
      );
    });
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: PRIMARY_BG, fontFamily: FONT_FAMILY, color: TEXT_COLOR, padding: "40px" }}>
      <h1 style={{ fontWeight: 700, fontSize: "2.5rem", marginBottom: "40px" }}>Producer Dashboard 🎬</h1>

      {/* --- OVERALL PROJECT PROGRESS VITALS --- */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ margin: "0 0 20px 0", fontWeight: 600, fontSize: "1.8rem", color: TEXT_COLOR }}>
          Overall Project Progress Vitals
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {/* Budget Spent Status Card */}
          <div style={cardStyle}>
            <p style={{ margin: 0, color: SUBTLE_TEXT }}>Budget Spent</p>
            <h3 style={{ fontSize: "2rem", margin: "5px 0", color: EXPENSE_COLOR }}>
              {formatCurrency(totalSpent)}
            </h3>
            <p style={{ margin: 0, fontSize: "0.9rem", color: SUBTLE_TEXT }}>
              of {formatCurrency(totalBudget)} total
            </p>
            <div
              style={{
                height: "8px",
                background: PRIMARY_BG,
                borderRadius: "4px",
                marginTop: "15px",
              }}
            >
              <div
                style={{
                  width: `${budgetPercent}%`,
                  height: "100%",
                  background: budgetPercent > 70 ? WARNING_COLOR : EXPENSE_COLOR,
                  borderRadius: "4px",
                  transition: "width 0.5s ease-in-out",
                }}
              />
            </div>
            <span
              style={{
                fontSize: "0.8rem",
                color: SUBTLE_TEXT,
                float: "right",
                marginTop: "5px",
                fontWeight: 600,
              }}
            >
              <span style={{ color: budgetPercent > 70 ? WARNING_COLOR : TEXT_COLOR }}>{budgetPercent}%</span> Used
            </span>
          </div>

          {/* Remaining Budget Status Card */}
          <div style={cardStyle}>
            <p style={{ margin: 0, color: SUBTLE_TEXT }}>Budget Remaining</p>
            <h3 style={{ fontSize: "2rem", margin: "5px 0", color: remainingBudget < 0 ? EXPENSE_COLOR : SUCCESS_COLOR }}>
              {formatCurrency(remainingBudget)}
            </h3>
            <p style={{ margin: 0, fontSize: "0.9rem", color: SUBTLE_TEXT }}>
              {remainingBudget >= 0 ? 'Remaining' : 'Over Budget'}
            </p>
            <div
              style={{
                height: "8px",
                background: PRIMARY_BG,
                borderRadius: "4px",
                marginTop: "15px",
              }}
            >
              <div
                style={{
                  width: `${Math.max(0, 100 - budgetPercent)}%`,
                  height: "100%",
                  background: remainingBudget < 0 ? WARNING_COLOR : SUCCESS_COLOR,
                  borderRadius: "4px",
                  transition: "width 0.5s ease-in-out",
                }}
              />
            </div>
            <span
              style={{
                fontSize: "0.8rem",
                color: SUBTLE_TEXT,
                float: "right",
                marginTop: "5px",
                fontWeight: 600,
              }}
            >
              <span style={{ color: TEXT_COLOR }}>{Math.max(0, 100 - budgetPercent)}%</span> Left
            </span>
          </div>

          {/* Scene Completion Status Card */}
          <div style={cardStyle}>
            <p style={{ margin: 0, color: SUBTLE_TEXT }}>Scene Completion</p>
            <h3 style={{ fontSize: "2rem", margin: "5px 0", color: ACTION_COLOR }}>
              {scenesCompleted}
            </h3>
            <p style={{ margin: 0, fontSize: "0.9rem", color: SUBTLE_TEXT }}>
              of {totalScenes} scenes shot
            </p>
            <div
              style={{
                height: "8px",
                background: PRIMARY_BG,
                borderRadius: "4px",
                marginTop: "15px",
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  background: ACTION_COLOR,
                  borderRadius: "4px",
                  transition: "width 0.5s ease-in-out",
                }}
              />
            </div>
            <span
              style={{
                fontSize: "0.8rem",
                color: SUBTLE_TEXT,
                float: "right",
                marginTop: "5px",
                fontWeight: 600,
              }}
            >
              <span style={{ color: TEXT_COLOR }}>{progressPercent}%</span> Complete
            </span>
          </div>
        </div>
      </div>

      {/* --- Target Budget --- */}
      <div style={{ ...cardStyle, marginBottom: "40px" }}>
        <h2 style={{ fontSize: "1.8rem", marginBottom: "15px" }}>Set Target Budget 💰</h2>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
          <input
            type="number"
            value={targetBudget}
            onChange={(e) => setTargetBudget(Number(e.target.value))}
            placeholder="Enter target budget"
            style={{ padding: "10px", borderRadius: "8px", border: "none", marginRight: "10px", minWidth: '200px', color: PRIMARY_BG }}
          />
          <button
            onClick={handleSetBudget}
            style={{ padding: "10px 20px", borderRadius: "8px", border: "none", background: SUCCESS_COLOR, color: PRIMARY_BG, cursor: 'pointer', fontWeight: 600 }}
          >
            Set Budget
          </button>
        </div>
        <p style={{ fontSize: "1.4rem", fontWeight: 500, color: WARNING_COLOR }}>
          Target Budget Set Is: <span style={{ color: TEXT_COLOR, fontWeight: 700 }}>{formatCurrency(totalBudget)}</span>
        </p>
      </div>

      {/* --- Schedule & Call Sheet (combined) --- */}
      {(schedule.length > 0 || callSheet.length > 0) && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "40px" }}>
          {schedule.length > 0 && (
            <div style={cardStyle}>
              <h2>Shooting Schedule 🎥</h2>
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                {schedule.map((day, idx) => (
                  <li key={idx} style={{ marginBottom: '5px', color: SUBTLE_TEXT }}>
                    <span style={{ color: TEXT_COLOR }}>Day {day.day}</span> — {day.location} (Scenes: {day.scenes.join(", ")})
                  </li>
                ))}
              </ul>
            </div>
          )}
          {callSheet.length > 0 && (
            <div style={cardStyle}>
              <h2>Call Sheet ⏰</h2>
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                {callSheet.map((sheet, idx) => (
                  <li key={idx} style={{ marginBottom: '5px', color: SUBTLE_TEXT }}>
                    <span style={{ color: TEXT_COLOR }}>Day {sheet.day}</span> — Call Time: {sheet.callTime} — Location: {sheet.location}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* --- Approvals --- */}
      <div style={{ marginBottom: "40px" }}>
        <h2>Budget Approvals 📝</h2>
        {approvals.map((item) => (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: 'center', padding: '10px', borderRadius: '5px', background: item.status === "approved" ? CARD_BG : HOVER_COLOR, marginBottom: "10px", opacity: item.status === "approved" ? 0.9 : 1, border: item.status === "approved" ? `1px solid ${CARD_BORDER}` : 'none' }}>
            <span>
              <span style={{ fontWeight: 600 }}>{item.item}</span> — <span style={{ color: WARNING_COLOR }}>{formatCurrency(item.amount)}</span>
            </span>
            {item.status === "pending" ? (
              <button onClick={() => handleApproval(item.id)} style={{ padding: "5px 10px", borderRadius: "5px", border: "none", background: WARNING_COLOR, color: PRIMARY_BG, cursor: 'pointer', fontWeight: 600 }}>
                Approve
              </button>
            ) : (
              <span style={{ color: SUCCESS_COLOR, fontWeight: 600 }}>Approved ✅</span>
            )}
          </div>
        ))}
      </div>

      {/* --- Post Production (NEW SECTION) --- */}
      <div style={{ ...cardStyle, marginBottom: "40px" }}>
        <h2 style={{ marginBottom: "20px" }}>Post-Production Tracking 🎞️</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {postProgress.map((stage) => (
            <div
              key={stage.stage}
              style={{
                padding: "15px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.05)",
                borderLeft: `5px solid ${getStatusColor(stage.status)}`,
              }}
            >
              <p
                style={{
                  margin: "0 0 10px 0",
                  color: TEXT_COLOR,
                  fontWeight: 600,
                }}
              >
                {stage.stage}
                <span
                  style={{
                    float: "right",
                    fontWeight: 700,
                    color: getStatusColor(stage.status),
                  }}
                >
                  {stage.progress}%
                </span>
              </p>
              <div
                style={{
                  height: "6px",
                  background: ACCENT_COLOR,
                  borderRadius: "3px",
                }}
              >
                <div
                  style={{
                    width: `${stage.progress}%`,
                    height: "100%",
                    background: getStatusColor(stage.status),
                    borderRadius: "3px",
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: "0.85rem",
                  color: SUBTLE_TEXT,
                  marginTop: "8px",
                  display: "block",
                }}
              >
                Status: {stage.status.replace("-", " ").toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* --- Charts --- */}
      <div style={{ marginBottom: "40px" }}>
        <h2>Project Analytics 📊</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {/* Expense Breakdown Chart */}
          {expenseBreakdownData.length > 0 && (
            <div style={graphContainerStyle}>
              <h3>Expense Breakdown</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={expenseBreakdownData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={SUBTLE_TEXT} />
                  <XAxis
                    type="number"
                    stroke={SUBTLE_TEXT}
                    tickFormatter={(value) => `$${value / 1000}k`}
                    axisLine={false}
                  />
                  <YAxis
                    dataKey="item"
                    type="category"
                    stroke={SUBTLE_TEXT}
                    tick={{ fill: SUBTLE_TEXT, fontSize: 12 }}
                    width={100}
                  />
                  <Tooltip formatter={(value) => [formatCurrency(value), 'Total Amount']} />
                  <Bar dataKey="amount" fill={EXPENSE_COLOR} animationDuration={1000} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Budget vs Spent */}
          <div style={graphContainerStyle}>
            <h3>Budget vs Spent</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" stroke={SUBTLE_TEXT} />
                <XAxis dataKey="name" stroke={SUBTLE_TEXT} />
                <YAxis stroke={SUBTLE_TEXT} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip formatter={(value) => [formatCurrency(value), 'Amount']} />
                <Bar dataKey="amount" fill={ACTION_COLOR} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Task Progress by Dept. */}
          <div style={graphContainerStyle}>
            <h3>Task Progress by Dept.</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={taskData}>
                <CartesianGrid strokeDasharray="3 3" stroke={SUBTLE_TEXT} />
                <XAxis dataKey="department" stroke={SUBTLE_TEXT} />
                <YAxis stroke={SUBTLE_TEXT} tickFormatter={(value) => `${value}%`} />
                <Tooltip />
                <Bar dataKey="progress" fill={WARNING_COLOR} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Scene Completion */}
          <div style={graphContainerStyle}>
            <h3>Scene Completion</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={sceneData}>
                <CartesianGrid strokeDasharray="3 3" stroke={SUBTLE_TEXT} />
                <XAxis dataKey="day" stroke={SUBTLE_TEXT} />
                <YAxis stroke={SUBTLE_TEXT} />
                <Tooltip />
                <Line type="monotone" dataKey="completed" stroke={SUCCESS_COLOR} strokeWidth={3} animationDuration={1000} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerDashboard;