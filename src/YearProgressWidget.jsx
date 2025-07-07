import React, { useState, useEffect } from 'react';
import './YearProgressWidget.css';

const YearProgressWidget = ({ w, h }) => {
  const [weekNumber, setWeekNumber] = useState(0);
  const [dayNumber, setDayNumber] = useState(0);

  const widgetClass = w >= h ? 'year-progress-widget-horizontal' : 'year-progress-widget-vertical';

  const calculateProgress = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const diff = now - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculate day number
    const currentDayNumber = Math.floor(diff / oneDay) + 1;
    setDayNumber(currentDayNumber);

    // Calculate week number (ISO week date system)
    const date = new Date(now.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year. If it's before Jan 4, then it belongs to the previous year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    const week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    const currentWeekNumber = 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    setWeekNumber(currentWeekNumber);
  };

  useEffect(() => {
    calculateProgress();
    const timerId = setInterval(calculateProgress, 60 * 60 * 1000); // Update every hour
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className={`year-progress-widget ${widgetClass}`}>
      <div className="progress-item">
        <span className="progress-label">Week:</span>
        <span className="progress-value">{weekNumber}</span>
      </div>
      <div className="progress-item">
        <span className="progress-label">Day:</span>
        <span className="progress-value">{dayNumber}</span>
      </div>
    </div>
  );
};

export default YearProgressWidget;
