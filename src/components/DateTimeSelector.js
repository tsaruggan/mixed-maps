import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import styles from "@/styles/Home.module.css";

const options = ['Leave now', 'Depart at', 'Arrive by'];

const DateTimeSelector = ({ selectedOption, selectedDate, onOptionChange, onDateChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionChange = (option) => {
    if (option === 'Leave now') {
      setDropdownOpen(false); // Collapse only if Leave now is clicked
    }
    onOptionChange(option);
  };

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    try {
      onDateChange(newDate);
    } catch (error) {
      console.error('Error setting date:', error);
      const fallbackDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      onDateChange(fallbackDate);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const getCurrentDateISO = () => {
    const currentDate = new Date();
    const timezoneOffset = currentDate.getTimezoneOffset() * 60000;
    const localISOTime = new Date(currentDate.getTime() - timezoneOffset).toISOString().slice(0, 16);
    return localISOTime;
  };

  const getMaxDateISO = () => {
    const date = new Date();
    const maxFutureDays = 30;
    date.setDate(date.getDate() + maxFutureDays);
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
    return localISOTime;
  };

  const stringDisplay = () => {
    const display = String(selectedOption); 
  
    if (selectedOption === "Leave now") {
      return display;
    } else {
      const formattedDateTime = formatDateTime(selectedDate);
      return display + " " + formattedDateTime;
    }
  };
  
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      const currentDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      onDateChange(currentDate);
      return formatDateTime(currentDate);
    }

    const options = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };

    const dateOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };

    const timeFormatter = new Intl.DateTimeFormat('en-US', options);
    const dateFormatter = new Intl.DateTimeFormat('en-US', dateOptions);

    const timeString = timeFormatter.format(date);
    const dateStringFormatted = dateFormatter.format(date);

    return `${timeString} – ${dateStringFormatted}`;
  };

  return (
    <div className={styles.dateTimePickerContainer} ref={dropdownRef}>
      <button
        className={styles.dateTimePickerDropdownToggle}
        type="button"
        aria-haspopup="true"
        aria-expanded={dropdownOpen ? 'true' : 'false'}
        onClick={toggleDropdown}
      >
        <span className={styles.dateTimePickerIconContainer}>
          <span className={styles.dateTimePickerText}>{stringDisplay()}</span>
          <span className={styles.dateTimePickerIcon}>
            {dropdownOpen ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
          </span>
        </span>
      </button>
      {dropdownOpen && (
        <div className={styles.dateTimePickerDropdownMenu} aria-labelledby="dropdownMenuButton">
          {options.map((option) => (
            <button
              key={option}
              className={styles.dateTimePickerDropdownItem}
              onClick={() => handleOptionChange(option)}
            >
              {option}
            </button>
          ))}
          {(selectedOption === 'Arrive by' || selectedOption === 'Depart at') && (
            <input
              aria-label="Date and time"
              type="datetime-local"
              value={selectedDate}
              onChange={handleDateChange}
              className={styles.dateTimePickerInput}
              min={getCurrentDateISO()}
              max={getMaxDateISO()}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default DateTimeSelector;
