import React, { useState } from 'react';

const TimeZoneSelector = ({ onSelectTimeZone }) => {
  const timezones = [
    { name: 'Local Time', iana: Intl.DateTimeFormat().resolvedOptions().timeZone },
    { name: 'New York', iana: 'America/New_York' },
    { name: 'London', iana: 'Europe/London' },
    { name: 'Tokyo', iana: 'Asia/Tokyo' },
    { name: 'Sydney', iana: 'Australia/Sydney' },
    { name: 'Shanghai', iana: 'Asia/Shanghai' },
  ];

  const [selectedTimeZone, setSelectedTimeZone] = useState(timezones[0].iana);

  const handleChange = (event) => {
    const selectedIana = event.target.value;
    setSelectedTimeZone(selectedIana);
    onSelectTimeZone(selectedIana);
  };

  return (
    <div className="timezone-selector">
      <select value={selectedTimeZone} onChange={handleChange}>
        {timezones.map((zone) => (
          <option key={zone.iana} value={zone.iana}>
            {zone.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimeZoneSelector;
