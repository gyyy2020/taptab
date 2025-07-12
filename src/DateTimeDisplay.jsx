// Import necessary React hooks
import React, { useState, useEffect } from 'react';

// Component to display the current date and time
const DateTimeDisplay = React.forwardRef(({ timeZone }, ref) => {
  // State to hold the current date and time
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  // Effect to update the date and time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Cleanup function to clear the interval
    return () => clearInterval(timer);
  }, []);

  // Function to format the time based on the selected time zone
  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: timeZone }).format(date);
  };

  // Function to format the date based on the selected time zone
  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: timeZone };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  // Render the date and time display
  return (
    <div className="datetime-display" ref={ref}>
      <div className="time">{formatTime(currentDateTime)}</div>
      <div className="date">{formatDate(currentDateTime)}</div>
    </div>
  );
});

export default DateTimeDisplay;