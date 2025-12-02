import React, { useState, useMemo, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { stationOptions, tripData } from '../data/mockTrips'; // Ensure the path stays correct
import { FiNavigation } from 'react-icons/fi'; // Icons
import '../App.css';

export default function SchedulePage() {
    const defaultStation = stationOptions[0]?.station_id ?? '';
    const [stations] = useState(stationOptions);
    const [searchParams, setSearchParams] = useState({
        station_id: defaultStation,
        date: new Date().toISOString().split('T')[0]
    });
    
    // Store search results
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Filter state
    const [filters, setFilters] = useState({
        vehicleType: 'all',
        sortBy: 'time',
    });

    // Mock search handler
    const performSearch = (stationId) => {
        if (!stationId) return;
        setLoading(true);
        setHasSearched(true);
        
        // Simulate a short network delay (500ms)
        setTimeout(() => {
            const filtered = tripData.filter((trip) => trip.station_id == stationId);
            setTrips(filtered);
            setLoading(false);
        }, 500);
    };

    // Run initial search when the page loads
    useEffect(() => {
        if (defaultStation) {
            performSearch(defaultStation);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        performSearch(searchParams.station_id);
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(val));
    };

    // Filtering and sorting logic memoized for performance
    const filteredTrips = useMemo(() => {
        let result = [...trips];

        if (filters.vehicleType !== 'all') {
            result = result.filter((trip) => trip.vehicle_type === filters.vehicleType);
        }

        if (filters.sortBy === 'price') {
            result.sort((a, b) => (a.price || 0) - (b.price || 0));
        } else {
            // Default sorting by departure time
            result.sort((a, b) => (a.time_start || '').localeCompare(b.time_start || ''));
        }

        return result;
    }, [trips, filters]);

    return (
        <>
            <Header />
            <div className="schedule-page">
                {/* 1. SEARCH BAR & FILTERS (Sticky Header) */}
                <div className="schedule-header">
                    <div className="container schedule-controls">
                        {/* Compact search form */}
                        <form onSubmit={handleSearch} className="mini-search-form">
                            <div className="control-group">
                                <label>Departure</label>
                                <select 
                                    value={searchParams.station_id}
                                    onChange={(e) => setSearchParams({...searchParams, station_id: e.target.value})}
                                >
                                    {stations.map(st => (
                                        <option key={st.station_id} value={st.station_id}>
                                            {st.city} - {st.station_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="control-group">
                                <label>Travel date</label>
                                <input 
                                    type="date" 
                                    value={searchParams.date}
                                    onChange={(e) => setSearchParams({...searchParams, date: e.target.value})}
                                />
                            </div>
                            <button type="submit" className="btn-search-small">Search trips</button>
                        </form>

                        {/* Quick filters */}
                        <div className="filters-inline">
                            <span>Filter:</span>
                            <select
                                value={filters.vehicleType}
                                onChange={(e) => setFilters({ ...filters, vehicleType: e.target.value })}
                            >
                                <option value="all">All vehicle types</option>
                                <option value="Sleeper">Sleeper</option>
                                <option value="Seater">Seater</option>
                                <option value="Limousine">Limousine</option>
                            </select>

                            <select
                                value={filters.sortBy}
                                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                            >
                                <option value="time">Earliest departure</option>
                                <option value="price">Lowest fare</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* 2. RESULT LIST */}
                <div className="container results-body">
                    <div className="results-status">
                        {loading ? (
                            <p>Loading data...</p>
                        ) : (
                            <p>Found <strong>{filteredTrips.length}</strong> matching trips</p>
                        )}
                    </div>

                    <div className="trip-list-grid">
                        {filteredTrips.map((trip) => {
                            const available = trip.available_seats ?? 0;
                            return (
                                <div key={trip.trip_id} className="trip-item-card">
                                    {/* Column 1: Operator information & timing */}
                                    <div className="card-left">
                                        <div className="trip-time-box">
                                            <div className="time-point">
                                                <span className="hour">{trip.time_start}</span>
                                                <span className="place">{trip.station_name}</span>
                                            </div>
                                            <div className="duration-line">
                                                <span className="dot-start"></span>
                                                <span className="line"></span>
                                                <span className="duration-text">{trip.duration}</span>
                                                <span className="dot-end"></span>
                                                <FiNavigation className="nav-icon"/>
                                            </div>
                                            <div className="time-point">
                                                <span className="hour">{trip.time_end}</span>
                                                <span className="place">{trip.route_name}</span>
                                            </div>
                                        </div>
                                        <div className="trip-vendor-info">
                                            <span className="badge-bus">{trip.vehicle_type}</span>
                                            <span className="vendor-name">{trip.brand_name}</span>
                                        </div>
                                    </div>

                                    {/* Column 2: Price & CTA */}
                                    <div className="card-right">
                                        <div className="price-tag">
                                            {formatCurrency(trip.price)}
                                        </div>
                                        <div className="seat-status">
                                            {available} seats left
                                        </div>
                                        <button className="btn-choose">Choose trip</button>
                                    </div>
                                </div>
                            );
                        })}

                        {!loading && filteredTrips.length === 0 && (
                            <div className="empty-state">
                                <p>No matching trips were found. Please pick another date.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}