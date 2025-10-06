// src/components/DailyView.jsx
import React from 'react';
import DayCard from './DayCard';

const DailyView = ({ scheduleData, onSelectDay, onStatusChange }) => {
  return (
    <div className="scroll-container">
      {scheduleData.map(day => (
        <DayCard 
          key={day.id} 
          dayData={day} 
          onSelect={onSelectDay} 
          onStatusChange={onStatusChange} 
        />
      ))}
    </div>
  );
};

export default DailyView;