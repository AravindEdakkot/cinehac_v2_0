// src/components/ProductionDashboard.jsx

import React from "react";
import App from "./production/App.jsx"; 

const ProductionDashboard = ({ onProgressUpdate }) => {
  return (
    <div>
      <App onProgressUpdate={onProgressUpdate} />
    </div>
  );
};

export default ProductionDashboard;