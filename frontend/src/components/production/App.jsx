// src/App.jsx

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { scheduleData as initialScheduleData } from '../../data/scheduleData';
import { mockApiResponse } from '../../data/mockApiResponse'; // For simulation
import { groupDataByWeek } from '../../utils/scheduleUtils';
import DailyView from './DailyView';
import WeeklyView from './WeeklyView';
import CalendarView from './CalendarView';
import DetailedCallSheet from './DetailedCallSheet';
import DetailedWeekSheet from './DetailedWeekSheet';

function App({ onProgressUpdate }) {
  // Your existing state and functions are untouched
  const [schedule, setSchedule] = useState(initialScheduleData.map(day => ({ ...day, status: 'incomplete' })));
  const [view, setView] = useState('daily');
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [selectedWeekNum, setSelectedWeekNum] = useState(null);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const weeklyData = useMemo(() => groupDataByWeek(schedule), [schedule]);

  const generateScheduleWithGemini = async (scriptText) => {
    setIsLoading(true);
    console.log("Preparing to generate schedule with Gemini...");
    const prompt = `
      Analyze the following film script text and generate a production schedule in JSON format.
      The JSON must be an array of day objects. Each object must have the following structure and data types:
      - id: integer
      - day: integer
      - date: string in 'YYYY-MM-DD' format (start from today's date)
      - location: string
      - generalCall: string in 'HH:MM' format
      - firstShot: string in 'HH:MM' format
      - estWrap: string in 'HH:MM' format
      - weather: string
      - sunrise: string in 'HH:MM' format
      - sunset: string in 'HH:MM' format
      - notes: string
      - scenes: array of scene objects, each with { sceneNumber: string, description: string, cast: array of strings, startTime: string 'HH:MM', endTime: string 'HH:MM' }
      - castCalls: array of cast call objects, each with { character: string, actor: 'TBD', status: string ('W', 'SW', or 'H'), hmw: string 'HH:MM', onSet: string 'HH:MM' }
      Infer a logical shooting order. Group scenes by location. Create a realistic schedule for at least the first 2-3 days of shooting based on the script provided. Ensure all fields are filled. For time-based fields, create logical and realistic timings.
    `;
    try {
      const response = await fetch('http://localhost:3001/api/generate-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scriptText }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const newScheduleData = await response.json();
      setIsLoading(false);
      return newScheduleData.map(day => ({ ...day, status: 'pending' }));
    } catch (error) {
      console.error("Error calling backend:", error);
      setIsLoading(false);
      return null;
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const scriptText = e.target.result;
      const newSchedule = await generateScheduleWithGemini(scriptText);
      if (newSchedule) {
        setSchedule(newSchedule);
        setView('daily');
        setCurrentWeekIndex(0);
        setSelectedDayId(null);
        setSelectedWeekNum(null);
      }
    };
    reader.readAsText(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleSelectDay = (dayId) => {
    setSelectedDayId(dayId);
    setSelectedWeekNum(null);
  };

  const handleSelectWeek = (weekNum) => {
    setSelectedWeekNum(weekNum);
    setSelectedDayId(null);
  };
  
  const handleDayStatusChange = (dayId, newStatus) => {
    setSchedule(currentSchedule =>
      currentSchedule.map(day =>
        day.id === dayId ? { ...day, status: newStatus } : day
      )
    );
  };
  

  const handleBack = () => {
    setSelectedDayId(null);
    setSelectedWeekNum(null);
  };

  const handleNextWeek = () => setCurrentWeekIndex(prev => Math.min(prev + 1, weeklyData.length - 1));
  const handlePrevWeek = () => setCurrentWeekIndex(prev => Math.max(prev - 1, 0));

  const selectedDayData = schedule.find(d => d.id === selectedDayId);
  const selectedWeekData = weeklyData.find(w => w.weekNumber === selectedWeekNum);

  const progressPercentage = useMemo(() => {
    const totalDays = schedule.length;
    if (totalDays === 0) return 0;
    const completedDays = schedule.filter(d => d.status === 'completed').length;
    return (completedDays / totalDays) * 100;
  }, [schedule]);

  // This is the only addition. It "reports" the progress up to the parent.
  useEffect(() => {
    if (onProgressUpdate) {
      onProgressUpdate(progressPercentage);
    }
  }, [progressPercentage, onProgressUpdate]);

  const renderContent = () => {
    if (isLoading) {
      return <div className="loading-overlay">Generating schedule with AI... 🤖</div>
    }
    if (selectedDayData) {
      return <DetailedCallSheet dayData={selectedDayData} onBack={handleBack} />;
    }
    if (selectedWeekData) {
      return <DetailedWeekSheet weekData={selectedWeekData} onBack={handleBack} onSelectDay={handleSelectDay} />;
    }
    return (
      <>
        <div className="header">
          <div className="header-top">
            <h1>Production Schedule</h1>
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} accept=".txt,.md" />
            <button className="upload-btn" onClick={triggerFileUpload}>Upload Script</button>
          </div>
          <div className="view-toggles">
            <button className={`toggle-btn ${view === 'daily' ? 'active' : ''}`} onClick={() => setView('daily')}>Daily View</button>
            <button className={`toggle-btn ${view === 'weekly' ? 'active' : ''}`} onClick={() => setView('weekly')}>Weekly View</button>
            <button className={`toggle-btn ${view === 'calendar' ? 'active' : ''}`} onClick={() => setView('calendar')}>Calendar View</button>
          </div>
        </div>
        {view === 'daily' && <DailyView scheduleData={schedule} onSelectDay={handleSelectDay} onStatusChange={handleDayStatusChange} />}
        {view === 'weekly' && <WeeklyView weeklyData={weeklyData} onSelectWeek={handleSelectWeek} />}
        {view === 'calendar' && (
          <CalendarView 
            weekData={weeklyData[currentWeekIndex]}
            onNextWeek={handleNextWeek}
            onPrevWeek={handlePrevWeek}
            isFirstWeek={currentWeekIndex === 0}
            isLastWeek={!weeklyData || currentWeekIndex === weeklyData.length - 1}
          />
        )}
      </>
    );
  };

  return (
    <div className="App">
      {renderContent()}
    </div>
  );
}

export default App;