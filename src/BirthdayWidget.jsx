// Import necessary React hooks and CSS for styling
import React, { useState, useEffect, useRef } from 'react';
import './BirthdayWidget.css';

// Component to display a birthday widget
const BirthdayWidget = ({ onClick, onDragStart }) => {
  // State variables for birthday, days since birthday, and input visibility
  const [birthday, setBirthday] = useState(null);
  const [days, setDays] = useState(0);
  const [isInputVisible, setIsInputVisible] = useState(false); // New state for input visibility
  const dateInputRef = useRef(null);

  // Load birthday from local storage on component mount
  useEffect(() => {
    const savedBirthday = localStorage.getItem('birthday');
    if (savedBirthday) {
      setBirthday(savedBirthday);
    }
  }, []);

  // Calculate the number of days since the birthday whenever the birthday changes
  useEffect(() => {
    if (birthday) {
      const birthDate = new Date(birthday);
      const today = new Date();
      // Set both to midnight to count full days
      birthDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      const diffTime = Math.abs(today - birthDate);
      // Add 1 to include the birthday itself as the first day
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setDays(diffDays);
      localStorage.setItem('birthday', birthday);
    }
  }, [birthday]);

  // Handle clicks on the widget to show the input field
  const handleWidgetClick = (e) => {
    if (onClick) {
      onClick(e);
    }
    if (!e.defaultPrevented) {
      setIsInputVisible(true);
      // Use a timeout to ensure the input is rendered before focusing
      setTimeout(() => {
        if (dateInputRef.current) {
          dateInputRef.current.focus();
        }
      }, 0);
    }
  };

  // Handle changes to the date input field
  const handleDateChange = (e) => {
    const newBirthdayString = e.target.value;
    // Simple validation for YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(newBirthdayString)) {
      const parsedDate = new Date(newBirthdayString);
      // Check if the parsed date is valid and matches the input string (to avoid issues with invalid dates like Feb 30)
      if (!isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === newBirthdayString) {
        setBirthday(newBirthdayString);
        setIsInputVisible(false); // Hide input after successful entry
      } else {
        setBirthday(null); // Invalid date
      }
    } else if (newBirthdayString === '') {
      setBirthday(null); // Allow clearing the input
    }
  };

  // Hide the input field when it loses focus
  const handleInputBlur = () => {
    setIsInputVisible(false);
  };

  // Render the birthday widget
  return (
    <div className="birthday-widget" onClick={handleWidgetClick} onDragStart={onDragStart}>
      {isInputVisible ? (
        // Render the input field if it is visible
        <input
          type="text"
          ref={dateInputRef}
          onChange={handleDateChange}
          onBlur={handleInputBlur}
          className="birthday-input-visible"
          placeholder="YYYY-MM-DD"
          defaultValue={birthday || ''}
        />
      ) : birthday ? (
        // Render the birthday information if a birthday is set
        <div className="birthday-content">
          <span className="days-text">You have been on this world for</span>
          <span className="days-number">{days.toLocaleString()}</span>
          <span className="days-text">days.</span>
        </div>
      ) : (
        // Render a prompt to set the birthday if it is not set
        <div className="birthday-prompt">
          <span>Click to set your birthday (YYYY-MM-DD)</span>
        </div>
      )}
    </div>
  );
};

export default BirthdayWidget;