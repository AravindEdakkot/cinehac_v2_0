import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import '../src/components/production/App.css';
// Import pages
import LoadingPage from "./components/LoadingPage.jsx";
import HeroSection from "./components/HeroSection.jsx";
import AccountantDashboard from "./components/AccountantDashboard.jsx";
import DirectorDashboard from "./components/DirectorDashboard.jsx";
import ProducerDashboard from "./components/ProducerDashboard.jsx";
import ProductionManagerDashboard from "./components/ProductionManagerDashboard.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Landing / Loading */}
        <Route path="/" element={<LoadingPage />} />
        <Route path="/" element={<LoadingPage />} />

        {/* Dashboards for different roles */}
        <Route path="/accountant" element={<AccountantDashboard />} />
        <Route path="/director" element={<DirectorDashboard />} />
        <Route path="/producer" element={<ProducerDashboard />} />
        <Route path="/manager" element={<ProductionManagerDashboard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
