import React, { useState } from 'react';

const TimeZoneSelector = ({ onSelectTimeZone }) => {
  const timezones = [
    { name: 'Local Time', iana: Intl.DateTimeFormat().resolvedOptions().timeZone },
    { name: 'New York', iana: 'America/New_York' },
    { name: 'London', iana: 'Europe/London' },
    { name: 'Tokyo', iana: 'Asia/Tokyo' },
    { name: 'Sydney', iana: 'Australia/Sydney' },
    { name: 'Shanghai', iana: 'Asia/Shanghai' },
    { name: 'Paris', iana: 'Europe/Paris' },
    { name: 'Berlin', iana: 'Europe/Berlin' },
    { name: 'Dubai', iana: 'Asia/Dubai' },
    { name: 'Moscow', iana: 'Europe/Moscow' },
    { name: 'Singapore', iana: 'Asia/Singapore' },
    { name: 'Hong Kong', iana: 'Asia/Hong_Kong' },
    { name: 'Los Angeles', iana: 'America/Los_Angeles' },
    { name: 'Chicago', iana: 'America/Chicago' },
    { name: 'Denver', iana: 'America/Denver' },
    { name: 'Vancouver', iana: 'America/Vancouver' },
    { name: 'Rio de Janeiro', iana: 'America/Sao_Paulo' },
    { name: 'Cairo', iana: 'Africa/Cairo' },
    { name: 'Johannesburg', iana: 'Africa/Johannesburg' },
    { name: 'Mumbai', iana: 'Asia/Kolkata' },
    { name: 'Beijing', iana: 'Asia/Shanghai' }, // Re-using Shanghai for Beijing as they share the same timezone
    { name: 'Mexico City', iana: 'America/Mexico_City' },
    { name: 'Buenos Aires', iana: 'America/Buenos_Aires' },
    { name: 'Rome', iana: 'Europe/Rome' },
    { name: 'Madrid', iana: 'Europe/Madrid' },
    { name: 'Dublin', iana: 'Europe/Dublin' },
    { name: 'Seoul', iana: 'Asia/Seoul' },
    { name: 'Bangkok', iana: 'Asia/Bangkok' },
    { name: 'Jakarta', iana: 'Asia/Jakarta' },
    { name: 'Auckland', iana: 'Pacific/Auckland' },
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
