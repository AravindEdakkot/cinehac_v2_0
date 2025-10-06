// src/components/CalendarView.jsx
import React from 'react';

// Helper function to convert "HH:MM" time to a grid row number
// Assumes the grid starts at 6 AM (row 2) and has hourly slots.
const timeToGridRow = (timeStr) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  const totalHours = hours + minutes / 60;
  // Our grid starts at 6 AM. Row 1 is header.
  // 06:00 -> row 2, 07:00 -> row 3, etc.
  return (totalHours - 6) * 2 + 2; // Multiply by 2 for half-hour increments
};


const CalendarView = ({ weekData, onPrevWeek, onNextWeek, isFirstWeek, isLastWeek }) => {
  if (!weekData) {
    return <div className="detail-view">No data for this week.</div>;
  }

  // Generate time slots from 6 AM to 10 PM
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = i + 6;
    return `${hour.toString().padStart(2, '0')}:00`;
  });
  
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { day: 'numeric', month: 'short'});

  return (
    <div className="calendar-view-container">
      <div className="calendar-header">
        <h2>Weekly Calendar: Week {weekData.weekNumber}</h2>
        <div className="calendar-nav">
          <button onClick={onPrevWeek} disabled={isFirstWeek} className="back-btn">&larr; Prev</button>
          <button onClick={onNextWeek} disabled={isLastWeek} className="back-btn">Next &rarr;</button>
        </div>
      </div>
      <div className="calendar-grid">
        <div className="time-axis">
          <div className="day-header-cell"></div> {/* Spacer */}
          {timeSlots.map(time => (
            <React.Fragment key={time}>
              <div className="time-slot">{time}</div>
              <div className="time-slot half-hour"></div>
            </React.Fragment>
          ))}
        </div>

        {weekData.days.map(day => (
          <div key={day.id} className="day-column">
             <div className="day-header-cell">
               <strong>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</strong>
               <span>{formatDate(day.date)}</span>
             </div>
            {/* Grid lines */}
            {timeSlots.map(time => (
               <React.Fragment key={`${day.id}-${time}`}>
                <div className="grid-row"></div>
                <div className="grid-row half-hour"></div>
               </React.Fragment>
            ))}
            {/* Scene Blocks */}
            {day.scenes.map(scene => {
              const startRow = timeToGridRow(scene.startTime);
              const endRow = timeToGridRow(scene.endTime);
              if (startRow === 0 || endRow === 0) return null; // Don't render if times are missing

              const isLunch = scene.description.toLowerCase().includes('lunch');

              return (
                <div
                  key={scene.sceneNumber}
                  className={`scene-block ${isLunch ? 'lunch-block' : ''}`}
                  style={{
                    gridRowStart: startRow,
                    gridRowEnd: endRow,
                  }}
                  title={`Scene ${scene.sceneNumber} (${scene.startTime} - ${scene.endTime})`}
                >
                  <p className="scene-block-title">
                    {isLunch ? 'LUNCH' : `Sc. ${scene.sceneNumber}`}
                  </p>
                  <p className="scene-block-desc">{!isLunch && scene.description}</p>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;