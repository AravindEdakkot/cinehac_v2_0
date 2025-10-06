// src/components/DayCard.jsx
import React from 'react';

// Style object for visual feedback on the card's border
const statusStyles = {
  completed: { borderLeft: '5px solid var(--accent-green)' },
  incomplete: { borderLeft: '5px solid var(--accent-orange)' },
  pending: {},
};

const DayCard = ({ dayData, onSelect, onStatusChange }) => {
  // This handler now includes the logic to toggle the status off.
  const handleStatusClick = (e, clickedStatus) => {
    e.stopPropagation(); 
        let newStatus;
    if (dayData.status === clickedStatus) {
      // This is the "toggle off" case
      if (clickedStatus === 'complete') {
        newStatus = 'incomplete'; // Your new rule: Toggling off 'Complete' goes to 'Incomplete'
      } else {
        newStatus = 'pending'; // Toggling off 'Incomplete' still resets
      }
    } else {
      // This is the "toggle on" case
      newStatus = clickedStatus;
    }
    
    onStatusChange(dayData.id, newStatus);
  };

  return (
    <div 
      className="day-card" 
      onClick={() => onSelect(dayData.id)} 
      style={statusStyles[dayData.status]}
    >
      <div className="card-header">
        <h3>Day {dayData.day}</h3>
        <span>{new Date(dayData.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
      </div>
      <div className="card-info">
        <p><strong>Location:</strong> {dayData.location}</p>
        <p><strong>Scenes:</strong> <span className="info-badge">{dayData.scenes.length}</span></p>
        <p><strong>Est. Wrap:</strong> {dayData.estWrap}</p>
      </div>
      
      {/* The JSX for the buttons remains the same */}
      <div className="status-toggle">
        <button 
          className={`toggle-option ${dayData.status === 'completed' ? 'active' : ''}`}
          onClick={(e) => handleStatusClick(e, 'completed')}
        >
          Complete
        </button>
        <button 
          className={`toggle-option ${dayData.status === 'incomplete' ? 'active' : ''}`}
          onClick={(e) => handleStatusClick(e, 'incomplete')}
        >
          Incomplete
        </button>
      </div>
    </div>
  );
};

export default DayCard;