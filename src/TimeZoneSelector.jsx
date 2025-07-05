import React, { useState } from 'react';

const TimeZoneSelector = () => {
  const [selectedTimeZone, setSelectedTimeZone] = useState('Local Time');

  const timezones = [
    'Local Time',
    'New York',
    'London',
    'Tokyo',
    'Sydney',
    'Shanghai',
  ];

  const handleChange = (event) => {
    setSelectedTimeZone(event.target.value);
  };

  return (
    <div className="timezone-selector">
      <select value={selectedTimeZone} onChange={handleChange}>
        {timezones.map((zone) => (
          <option key={zone} value={zone}>
            {zone}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimeZoneSelector;
