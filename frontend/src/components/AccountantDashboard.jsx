import React, { useState } from "react";
// Import for Chart/Dashboard
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// --- EXTERNAL LIBRARY IMPOR

// --- EXTERNAL LIBRARY IMPORTS for Export ---
// FIX: Change to a named import (or destructuring import)
import { jsPDF } from "jspdf"; 
import html2canvas from "html2canvas";
import * as XLSX from "xlsx/xlsx.mjs";
import { saveAs } from 'file-saver';

// ... (rest of the component)

// --- Constants ---
const FONT_FAMILY = "Inter, sans-serif";
const PRIMARY_BG = "#101014";
const ACCENT_COLOR = "rgba(255, 255, 255, 0.15)";
const HOVER_COLOR = "rgba(255, 255, 255, 0.3)";
const TEXT_COLOR = "rgba(255, 255, 255, 0.9)";
const SUBTLE_TEXT = "rgba(255, 255, 255, 0.6)";
const ACTION_COLOR = "#3399ff";
const SUCCESS_COLOR = "#00cc66";
const WARNING_COLOR = "#ffcc00";

// Helper for formatting currency to INR (Indian Rupee)
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0, 
        maximumFractionDigits: 2,
    }).format(amount);
};

// --- Mock Data (Amounts now represent INR) ---
const initialExpenses = [
  { id: 101, category: "Props", description: "Hedgehog in a cage purchase", amount: 1500, paid: true, phase: "Production", vendor: "Local Supplier" }, 
  { id: 102, category: "Crew", description: "DP Weekly Pay", amount: 65000, paid: true, phase: "Production", vendor: "John Doe" }, 
  { id: 103, category: "Location", description: "Street 5 Permit Fee", amount: 32000, paid: false, phase: "Pre-Production", vendor: "City Licensing Dept." }, 
  { id: 104, category: "VFX", description: "Initial VFX Bid Deposit", amount: 150000, paid: true, phase: "Post-Production", vendor: "Digital FX House" },
  { id: 105, category: "Crew", description: "Casting Director Fee", amount: 40000, paid: false, phase: "Pre-Production", vendor: "Talent Scout Agency" },
];
const mockBudgetPhase = [
  { phase: "Pre-Production", budgeted: 2000000, spent: 72000, status: "green" }, 
  { phase: "Production", budgeted: 10000000, spent: 4050000, status: "yellow" }, 
  { phase: "Post-Production", budgeted: 3000000, spent: 378000, status: "green" }, 
];
const mockBudget = {
  totalBudget: 15000000, 
  spent: 4500000,
  remaining: 10500000,
  deviation: 220000,
};
// --- Main Component ---
const AccountantDashboard = () => {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [newExpense, setNewExpense] = useState({ category: "Crew", description: "", amount: "", phase: "Production" });
  
  // NEW STATE for Invoice Generation
  const [selectedUnpaidId, setSelectedUnpaidId] = useState("");
  const [invoiceData, setInvoiceData] = useState(null); // Null means no invoice displayed
  
  // --- Styles (Omitted for brevity, they are the same) ---
  const cardStyle = {
    padding: "2rem",
    borderRadius: "16px",
    background: "rgba(255, 255, 255, 0.02)",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(15px)",
    WebkitBackdropFilter: "blur(15px)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
  };
  const inputStyle = {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    outline: "none",
    background: "rgba(255, 255, 255, 0.05)",
    color: TEXT_COLOR,
    fontFamily: FONT_FAMILY,
    fontSize: "0.9rem",
    boxSizing: "border-box",
  };
  const buttonStyle = (isPrimary) => ({
    padding: "10px 15px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.9rem",
    fontFamily: FONT_FAMILY,
    transition: "0.2s ease-in-out",
    color: isPrimary ? PRIMARY_BG : TEXT_COLOR,
    background: isPrimary ? ACTION_COLOR : ACCENT_COLOR,
  });
  const getPhaseColor = (status) => {
    switch (status) {
      case "green": return SUCCESS_COLOR;
      case "yellow": return WARNING_COLOR;
      case "red": return "#ff4444";
      default: return SUBTLE_TEXT;
    }
  };
  // --- Handlers ---
  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({ ...prev, [name]: value }));
  };
  const handleAddExpense = () => {
    if (newExpense.description && newExpense.amount > 0) {
      const newEntry = {
        id: Date.now(),
        category: newExpense.category,
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        paid: false,
        phase: newExpense.phase,
        // Mock vendor name for new expense to allow invoice generation
        vendor: `Vendor ${Math.floor(Math.random() * 100)}` 
      };
      setExpenses([newEntry, ...expenses]);
      setNewExpense({ category: "Crew", description: "", amount: "", phase: "Production" });
    }
  };
  const togglePaidStatus = (id) => {
    setExpenses(prev =>
      prev.map(exp => exp.id === id ? { ...exp, paid: !exp.paid } : exp)
    );
  };
  
  const handleGenerateInvoice = () => {
    const expense = expenses.find(e => e.id === parseInt(selectedUnpaidId));
    if (!expense) return alert("Please select a valid unpaid expense.");

    const today = new Date().toLocaleDateString();
    
    setInvoiceData({
      invoiceNumber: `INV-${expense.id}-${Math.floor(Math.random() * 1000)}`,
      date: today,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 7 days from now
      vendor: expense.vendor || expense.category + " Services",
      client: "CineHack Productions",
      items: [
        { 
          description: expense.description, 
          phase: expense.phase, 
          amount: expense.amount 
        }
      ],
      total: expense.amount,
      notes: "Payment due within 7 days of invoice date."
    });
  };

  /**
   * ACTUAL PDF EXPORT: Uses html2canvas and jspdf to convert the entire dashboard to a PDF.
   * NOTE: For a clean report, you would typically target a specific, clean report area.
   */
  const handleExportPDF = () => {
    const input = document.getElementById('accountant-dashboard');
    if (!input) return alert("Error: Could not find dashboard element for PDF generation.");

    html2canvas(input, {
        scale: 2, // Improve quality
        backgroundColor: PRIMARY_BG, // Set background color for the image
    }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; 
        const pageHeight = 295;  
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`Budget_vs_Actual_Report_${new Date().toLocaleDateString().replace(/\//g, '-')}.pdf`);
    });
  };

  /**
   * ACTUAL EXCEL EXPORT: Uses SheetJS (xlsx) to convert expense data to a workbook and download it.
   */
  const handleExportExcel = () => {
    const ledgerData = expenses.map(exp => ({
      ID: exp.id,
      Phase: exp.phase,
      Category: exp.category,
      Description: exp.description,
      Amount_INR: exp.amount, // Use raw number for Excel for calculations
      Paid_Status: exp.paid ? 'Paid' : 'Pending',
      Vendor: exp.vendor || 'N/A',
    }));

    // Convert data array to worksheet
    const ws = XLSX.utils.json_to_sheet(ledgerData);

    // Create a new workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Expense Ledger");

    // Write the workbook and trigger the download using file-saver
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    
    saveAs(blob, `Expense_Ledger_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`);
  };


  const totalUnpaid = expenses.filter(e => !e.paid).reduce((sum, e) => sum + e.amount, 0);
  const unpaidExpenses = expenses.filter(e => !e.paid && e.vendor);

  // --- Chart Data ---
  const chartData = mockBudgetPhase.map(phase => ({
    phase: phase.phase,
    Budgeted: phase.budgeted,
    Spent: phase.spent,
  }));
  // --- Render ---
  return (
    // Add an ID to the main container for PDF capture
    <div id="accountant-dashboard" style={{ minHeight: "100vh", backgroundColor: PRIMARY_BG, fontFamily: FONT_FAMILY, color: TEXT_COLOR, padding: "40px" }}>
      
      {/* Header */}
      <h1 style={{ fontWeight: 700, fontSize: "2.5rem", marginBottom: "10px" }}>Accountant Console 💵</h1>
      <p style={{ color: SUBTLE_TEXT, marginBottom: "40px" }}>
        Manage expenses, track actual spending against budget, and generate reports.
      </p>
      
      {/* Financial Overview & Expense Entry */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "30px", marginBottom: "40px" }}>
        <div style={cardStyle}>
          <h2 style={{ margin: "0 0 20px 0", fontWeight: 600, fontSize: "1.5rem" }}>Current Financial Vitals</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div style={{ padding: "10px", background: ACCENT_COLOR, borderRadius: "8px" }}>
              <p style={{ margin: 0, color: SUBTLE_TEXT }}>Total Remaining Budget</p>
              <h3 style={{ margin: "5px 0 0 0", color: SUCCESS_COLOR, fontSize: "1.8rem" }}>
                {formatCurrency(mockBudget.remaining)}
              </h3>
            </div>
            <div style={{ padding: "10px", background: ACCENT_COLOR, borderRadius: "8px" }}>
              <p style={{ margin: 0, color: SUBTLE_TEXT }}>Unpaid Invoices</p>
              <h3 style={{ margin: "5px 0 0 0", color: WARNING_COLOR, fontSize: "1.8rem" }}>
                {formatCurrency(totalUnpaid)}
              </h3>
            </div>
            <p style={{ color: WARNING_COLOR, fontSize: "0.9rem", marginTop: "10px" }}>
              ! Tracking {formatCurrency(mockBudget.deviation)} over budget in **Crew Overtime** category.
            </p>
          </div>
        </div>
        <div style={cardStyle}>
          <h2 style={{ margin: "0 0 20px 0", fontWeight: 600, fontSize: "1.5rem" }}>Quick Expense Entry</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
              <select name="category" value={newExpense.category} onChange={handleExpenseChange} style={inputStyle}>
                {['Crew', 'Location', 'Props', 'VFX', 'Equipment'].map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <select name="phase" value={newExpense.phase} onChange={handleExpenseChange} style={inputStyle}>
                {['Pre-Production', 'Production', 'Post-Production'].map(ph => <option key={ph} value={ph}>{ph}</option>)}
              </select>
              <input type="number" name="amount" placeholder="Amount (₹)" value={newExpense.amount} onChange={handleExpenseChange} style={inputStyle} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "15px" }}>
              <input type="text" name="description" placeholder="Description (e.g., Catering Lunch)" value={newExpense.description} onChange={handleExpenseChange} style={inputStyle} />
              <button style={{ ...buttonStyle(true), width: "100%" }} onClick={handleAddExpense}>Log Expense</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Invoice Generation & Display */}
      <div style={{ display: "grid", gridTemplateColumns: invoiceData ? "1fr 1fr" : "1fr", gap: "30px", marginBottom: "40px" }}>
        {/* Invoice Control Card */}
        <div style={cardStyle}>
            <h2 style={{ margin: "0 0 20px 0", fontWeight: 600, fontSize: "1.5rem", color: ACTION_COLOR }}>Generate Invoice 🧾</h2>
            <p style={{ color: SUBTLE_TEXT, marginBottom: "15px" }}>Select an unpaid expense to generate a formatted invoice for the vendor.</p>
            <div style={{ display: "flex", gap: "15px" }}>
                <select 
                    value={selectedUnpaidId} 
                    onChange={(e) => { setSelectedUnpaidId(e.target.value); setInvoiceData(null); }} 
                    style={{ ...inputStyle, flexGrow: 1 }}
                >
                    <option value="" disabled>Select Unpaid Expense...</option>
                    {unpaidExpenses.map(item => (
                        <option key={item.id} value={item.id}>
                            {item.description} - {formatCurrency(item.amount)}
                        </option>
                    ))}
                </select>
                <button 
                    style={buttonStyle(true)} 
                    onClick={handleGenerateInvoice}
                    disabled={!selectedUnpaidId}
                >
                    Generate Invoice
                </button>
            </div>
            {unpaidExpenses.length === 0 && <p style={{ color: SUCCESS_COLOR, marginTop: '15px' }}>All tracked expenses are marked paid.</p>}
        </div>

        {/* Invoice Display Card */}
        {invoiceData && (
            <div style={{ ...cardStyle, border: `2px solid ${ACTION_COLOR}` }}>
                <h2 style={{ margin: "0 0 10px 0", fontSize: "1.8rem", color: ACTION_COLOR }}>INVOICE</h2>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", borderBottom: `1px solid ${ACCENT_COLOR}` }}>
                    <p style={{ margin: "0", fontSize: "1rem" }}>**Invoice #:** {invoiceData.invoiceNumber}</p>
                    <p style={{ margin: "0", fontSize: "1rem" }}>**Date:** {invoiceData.date}</p>
                    <p style={{ margin: "0", fontSize: "1rem", color: WARNING_COLOR }}>**Due:** {invoiceData.dueDate}</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                    <div>
                        <p style={{ margin: "0", color: SUBTLE_TEXT, fontWeight: 500 }}>Billed To:</p>
                        <p style={{ margin: "5px 0 0 0", fontWeight: 600 }}>{invoiceData.client}</p>
                        <p style={{ margin: "0", fontSize: "0.9rem", color: SUBTLE_TEXT }}>123 Studio Drive, Hollywood, CA</p>
                    </div>
                    <div>
                        <p style={{ margin: "0", color: SUBTLE_TEXT, fontWeight: 500 }}>Billed By (Vendor):</p>
                        <p style={{ margin: "5px 0 0 0", fontWeight: 600, color: WARNING_COLOR }}>{invoiceData.vendor}</p>
                        <p style={{ margin: "0", fontSize: "0.9rem", color: SUBTLE_TEXT }}>Vendor Address on file...</p>
                    </div>
                </div>

                <div style={{ marginTop: "15px", padding: "15px", background: ACCENT_COLOR, borderRadius: "8px" }}>
                    <h4 style={{ margin: "0 0 10px 0", borderBottom: `1px solid ${SUBTLE_TEXT}`, paddingBottom: "5px" }}>Item Details</h4>
                    {invoiceData.items.map((item, index) => (
                        <div key={index} style={{ display: "flex", justifyContent: "space-between", fontSize: "1.1rem" }}>
                            <span>{item.description} ({item.phase})</span>
                            <span style={{ fontWeight: 700 }}>{formatCurrency(item.amount)}</span>
                        </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.4rem", marginTop: "15px", paddingTop: "10px", borderTop: `2px solid ${TEXT_COLOR}` }}>
                        <span>TOTAL DUE</span>
                        <span style={{ fontWeight: 700, color: WARNING_COLOR }}>{formatCurrency(invoiceData.total)}</span>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Phase Budget Tracking */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ margin: "0 0 20px 0", fontWeight: 600, fontSize: "1.8rem" }}>Budget Tracking by Production Phase 📈</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {mockBudgetPhase.map(data => {
            const percentSpent = Math.round((data.spent / data.budgeted) * 100);
            const statusColor = getPhaseColor(data.status);
            return (
              <div key={data.phase} style={cardStyle}>
                <h3 style={{ margin: "0 0 10px 0", fontSize: "1.4rem", color: TEXT_COLOR }}>{data.phase}</h3>
                <p style={{ margin: "0 0 5px 0", color: SUBTLE_TEXT, fontSize: "0.9rem" }}>Budgeted: {formatCurrency(data.budgeted)}</p>
                <p style={{ margin: "0 0 15px 0", color: statusColor, fontWeight: 600 }}>
                  Spent: {formatCurrency(data.spent)} ({percentSpent}%)
                </p>
                <div style={{ height: "8px", background: ACCENT_COLOR, borderRadius: "4px" }}>
                  <div style={{ width: `${percentSpent}%`, height: "100%", background: statusColor, borderRadius: "4px" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Expense & Payment List */}
      <div style={{ marginBottom: "40px" }}>
        <h2 style={{ margin: "0 0 20px 0", fontWeight: 600, fontSize: "1.8rem" }}>Expense & Payment Tracking</h2>
        <div style={{ ...cardStyle, padding: "1.5rem" }}>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 2fr 100px 100px",
            gap: "20px", paddingBottom: "10px", borderBottom: `2px solid ${ACCENT_COLOR}`,
            marginBottom: "15px", color: SUBTLE_TEXT, fontWeight: 500, fontSize: "0.9rem",
          }}>
            <span>Phase</span>
            <span>Category</span>
            <span>Description</span>
            <span style={{ textAlign: "right" }}>Amount</span>
            <span style={{ textAlign: "center" }}>Status</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {expenses.map(item => (
              <div key={item.id} style={{
                display: "grid", gridTemplateColumns: "1fr 1fr 2fr 100px 100px",
                gap: "20px", alignItems: "center", padding: "8px 0", borderBottom: `1px dashed ${ACCENT_COLOR}`,
              }}>
                <span style={{ fontWeight: 500, color: SUBTLE_TEXT }}>{item.phase}</span>
                <span style={{ fontWeight: 600, color: ACTION_COLOR }}>{item.category}</span>
                <span style={{ color: TEXT_COLOR }}>{item.description}</span>
                <span style={{ textAlign: "right" }}>{formatCurrency(item.amount)}</span>
                <div style={{ textAlign: "center" }}>
                  <button
                    onClick={() => togglePaidStatus(item.id)}
                    style={{
                      ...buttonStyle(true),
                      background: item.paid ? SUCCESS_COLOR : WARNING_COLOR,
                      color: item.paid ? PRIMARY_BG : TEXT_COLOR,
                      padding: "5px 10px",
                      width: "80px",
                    }}
                  >
                    {item.paid ? "Paid ✅" : "Pending"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Budget vs Actual Chart & Report Export (UPDATED SECTION) */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px" }}>
        <div style={{ ...cardStyle, minHeight: "300px" }}>
          <h2 style={{ margin: "0 0 15px 0", fontWeight: 600, fontSize: "1.5rem" }}>Budget vs. Actual Spend Chart</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={ACCENT_COLOR} strokeDasharray="5 5" />
              <XAxis dataKey="phase" stroke={SUBTLE_TEXT} />
              <YAxis 
                stroke={SUBTLE_TEXT} 
                tickFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
              />
              <Tooltip formatter={(value) => [formatCurrency(value), 'Amount']} />
              <Legend />
              <Line type="monotone" dataKey="Budgeted" stroke={ACTION_COLOR} strokeWidth={2} />
              <Line type="monotone" dataKey="Spent" stroke={SUCCESS_COLOR} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={cardStyle}>
          <h2 style={{ margin: "0 0 20px 0", fontWeight: 600, fontSize: "1.5rem" }}>Generate Financial Reports</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <button style={buttonStyle(true)} onClick={handleExportPDF}>
              Export Budget Report (PDF) 📄
            </button>
            <button style={{ ...buttonStyle(true), background: SUCCESS_COLOR }} onClick={handleExportExcel}>
              Export Expense Ledger (Excel) 💾
            </button>
            <p style={{ color: SUBTLE_TEXT, fontSize: "0.8rem", marginTop: "10px" }}>
              Reports generated based on data up to: {new Date().toLocaleDateString()}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountantDashboard;