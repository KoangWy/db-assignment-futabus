import React, { useState } from 'react';
import '../../App.css';
import { FiMapPin, FiCalendar, FiRepeat } from 'react-icons/fi';

const SearchForm = () => {
  // Sau này dữ liệu này sẽ lấy từ API (bảng station)
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');

  const handleSwap = () => {
    setDeparture(destination);
    setDestination(departure);
  };

  return (
    <div className="search-widget">
      <form className="search-form" onSubmit={(e) => e.preventDefault()}>
        <div className="input-wrapper">
          <FiMapPin className="input-icon" />
          <div className="input-group">
            <label>From</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Select departure point"
              value={departure}
              onChange={(e) => setDeparture(e.target.value)}
            />
          </div>
        </div>

        <button
          type="button"
          className="swap-btn"
          onClick={handleSwap}
          aria-label="Swap departure and destination"
        >
          <FiRepeat />
        </button>

        <div className="input-wrapper">
          <FiMapPin className="input-icon" />
          <div className="input-group">
            <label>To</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Select destination" 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
        </div>

        <div className="input-wrapper">
          <FiCalendar className="input-icon" />
          <div className="input-group">
            <label>Departure Date</label>
            <input 
              type="date" 
              className="input-field"
            />
          </div>
        </div>

        <button type="submit" className="search-btn">
          Search Trips
        </button>
      </form>
    </div>
  );
};

export default SearchForm;