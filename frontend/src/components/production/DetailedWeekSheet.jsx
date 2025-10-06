// src/components/DetailedWeekSheet.jsx
import React from 'react';
import DayCard from './DayCard';

const DetailedWeekSheet = ({ weekData, onBack, onSelectDay }) => {
  if (!weekData) {
    return <div className="detail-view">Loading...</div>;
  }

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  return (
    <div className="detail-view">
      <button onClick={onBack} className="back-btn">
        &larr; Back to Weekly Overview
      </button>

      <div className="detail-header">
        <h2>Week {weekData.weekNumber} Overview</h2>
        <p>{formatDate(weekData.startDate)} - {formatDate(weekData.endDate)}</p>
      </div>

      <div className="detail-section">
        <h3>Weekly Summary</h3>
         <div className="detail-grid">
            <div className="detail-box"><h4>Total Days</h4><p>{weekData.numberOfDays}</p></div>
            <div className="detail-box"><h4>Total Scenes</h4><p>{weekData.totalScenes}</p></div>
            <div className="detail-box"><h4>Primary Locations</h4><p>{weekData.primaryLocations.join(', ')}</p></div>
        </div>
      </div>
      
      <div className="detail-section">
        <h3>Days in this Week</h3>
        <div className="week-sheet-day-cards">
            {weekData.days.map(day => (
                <DayCard key={day.id} dayData={day} onSelect={onSelectDay} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default DetailedWeekSheet;