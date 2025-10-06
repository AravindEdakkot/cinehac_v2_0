import React, { useState } from "react";
import { motion } from "framer-motion";

const FinancialRecord = () => {
  const [formData, setFormData] = useState({
    accountCode: "",
    vendor: "",
    department: "",
    description: "",
    phase: "",
    paymentMethod: "",
    date: "",
    amount: "",
  });

  const [records, setRecords] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setRecords([...records, formData]);
    setFormData({
      accountCode: "",
      vendor: "",
      department: "",
      description: "",
      phase: "",
      paymentMethod: "",
      date: "",
      amount: "",
    });
  };

  return (
    <div
      style={{
        backgroundImage:
          "url('https://images.stockcake.com/public/4/a/b/4ab93018-6b28-4ef5-bf76-870b7f113442_large/cinematic-crew-silhouettes-stockcake.jpg')",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        padding: "40px",
        fontFamily: "Georgia, serif",
        color: "white",
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        style={{ marginBottom: "20px" }}
      >
        🎬 Financial Record Management
      </motion.h1>

      {/* Expense Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderRadius: "20px",
          padding: "30px",
          width: "450px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <input
          type="text"
          name="vendor"
          placeholder="Vendor/Payee"
          value={formData.vendor}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          type="text"
          name="department"
          placeholder="Department (e.g., Art Dept.)"
          value={formData.department}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <textarea
          name="description"
          placeholder="Description/Notes"
          value={formData.description}
          onChange={handleChange}
          required
          style={{ ...inputStyle, height: "80px", resize: "none" }}
        ></textarea>

        <select
          name="phase"
          value={formData.phase}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="">Phase of Production</option>
          <option value="Pre-Production">Pre-Production</option>
          <option value="Production">Production</option>
          <option value="Post-Production">Post-Production</option>
        </select>

        <select
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="">Method of Payment</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Petty Cash">Petty Cash</option>
          <option value="Wire Transfer">Wire Transfer</option>
          <option value="Bank Transfer">Bank Transfer</option>
        </select>

        {/* Date Picker */}
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        {/* Amount */}
        <input
          type="number"
          name="amount"
          placeholder="Amount (₹)"
          value={formData.amount}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <button
          type="submit"
          style={{
            background: "rgba(255, 255, 255, 0.25)",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "12px",
            cursor: "pointer",
            fontFamily: "Georgia, serif",
            fontWeight: "bold",
            transition: "0.3s",
          }}
          onMouseOver={(e) =>
            (e.target.style.background = "rgba(255, 255, 255, 0.4)")
          }
          onMouseOut={(e) =>
            (e.target.style.background = "rgba(255, 255, 255, 0.25)")
          }
        >
          Add Expense
        </button>
      </motion.form>

      {/* Expense Records Table */}
      {records.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{
            marginTop: "40px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "15px",
            padding: "20px",
            width: "90%",
            maxWidth: "900px",
            overflowX: "auto",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "10px" }}>
            Expense Records
          </h2>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              color: "white",
              fontFamily: "Georgia, serif",
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Vendor</th>
                <th style={thStyle}>Department</th>
                <th style={thStyle}>Phase</th>
                <th style={thStyle}>Payment</th>
                <th style={thStyle}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={index}>
                  <td style={tdStyle}>{record.date}</td>
                  <td style={tdStyle}>{record.vendor}</td>
                  <td style={tdStyle}>{record.department}</td>
                  <td style={tdStyle}>{record.phase}</td>
                  <td style={tdStyle}>{record.paymentMethod}</td>
                  <td style={tdStyle}>₹{record.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
};

// Styles
const inputStyle = {
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  outline: "none",
  background: "rgba(255, 255, 255, 0.15)",
  color: "white",
  fontFamily: "Georgia, serif",
};

const thStyle = {
  textAlign: "left",
  borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
  padding: "8px",
};

const tdStyle = {
  padding: "8px",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
};

export default FinancialRecord;
