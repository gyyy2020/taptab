import React, { useState, useEffect } from 'react';

const DateTimeDisplay = React.forwardRef(({ timeZone }, ref) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: timeZone }).format(date);
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: timeZone };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  return (
    <div className="datetime-display" ref={ref}>
      <div className="time">{formatTime(currentDateTime)}</div>
      <div className="date">{formatDate(currentDateTime)}</div>
    </div>
  );
});

export default DateTimeDisplay;
