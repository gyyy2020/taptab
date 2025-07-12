// Import necessary React hooks
import React, { useState, useEffect } from 'react';

// Component for selecting a time zone
const TimeZoneSelector = ({ onSelectTimeZone }) => {
  // List of available time zones
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

  // State for the selected time zone, initialized from local storage or the default time zone
  const [selectedTimeZone, setSelectedTimeZone] = useState(() => {
    const savedTimeZone = localStorage.getItem('selectedTimeZone');
    return savedTimeZone || timezones[0].iana;
  });

  // Effect to save the selected time zone to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedTimeZone', selectedTimeZone);
  }, [selectedTimeZone]);

  // Handle changes to the time zone selection
  const handleChange = (event) => {
    const selectedIana = event.target.value;
    setSelectedTimeZone(selectedIana);
    onSelectTimeZone(selectedIana);
  };

  // Render the time zone selector dropdown
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