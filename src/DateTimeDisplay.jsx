import React, { useState, useEffect } from 'react';

const DateTimeDisplay = React.forwardRef((props, ref) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="datetime-display" ref={ref}>
      <div className="time">{formatTime(currentDateTime)}</div>
      <div className="date">{formatDate(currentDateTime)}</div>
    </div>
  );
});

export default DateTimeDisplay;
