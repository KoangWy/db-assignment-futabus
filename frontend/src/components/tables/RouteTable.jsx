import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiEye, FiPlus } from 'react-icons/fi';

const RouteTable = ({ onAdd, onEdit, onDelete, onViewDetail }) => {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterOperator, setFilterOperator] = useState('all');

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://127.0.0.1:5000/api/routes');
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch routes');
            }
            
            setRoutes(data.data || []);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (timeString) => {
        if (!timeString) return 'N/A';
        const parts = timeString.split(':');
        const hours = parseInt(parts[0]);
        const minutes = parseInt(parts[1]);
        if (minutes === 0) return `${hours}h`;
        return `${hours}h ${minutes}m`;
    };

    const filteredRoutes = routes.filter(route => {
        const matchesSearch = 
            route.departure_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
            route.arrival_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
            route.departure_station.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesOperator = filterOperator === 'all' || route.operator_id === filterOperator;
        
        return matchesSearch && matchesOperator;
    });

    const uniqueOperators = [...new Set(routes.map(r => r.operator_id))];

    if (loading) {
        return (
            <div className="table-loading">
                <p>Loading routes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="table-error">
                <p>Error loading routes: {error}</p>
                <button onClick={fetchRoutes} className="login-button">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="route-table-container">
            <div className="table-toolbar route-table-toolbar">
                <h2 className="table-title">Route Management</h2>
                
                <div className="table-filters route-filters">
                    <input
                        type="text"
                        placeholder="Search by city or station..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="table-input"
                    />
                </div>

                <button 
                    onClick={() => onAdd && onAdd()}
                    className="login-button table-add-btn"
                >
                    <FiPlus /> Add Route
                </button>
            </div>

            <div className="table-card">
                <div className="table-scroll">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th className="table-header">Route ID</th>
                                <th className="table-header">Departure</th>
                                <th className="table-header">Arrival</th>
                                <th className="table-header">Distance</th>
                                <th className="table-header">Duration</th>
                                <th className="table-header">Operator</th>
                                <th className="table-header">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRoutes.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="table-empty">No routes found</td>
                                </tr>
                            ) : (
                                filteredRoutes.map(route => (
                                    <tr key={route.route_id} className="table-row">
                                        <td className="table-cell">
                                            <strong>#{route.route_id}</strong>
                                        </td>
                                        <td className="table-cell">
                                            <div className="cell-stack">
                                                <div className="cell-strong">{route.departure_city}</div>
                                                <div className="cell-sub">{route.departure_station}</div>
                                            </div>
                                        </td>
                                        <td className="table-cell">
                                            <div className="cell-stack">
                                                <div className="cell-strong">{route.arrival_city}</div>
                                                <div className="cell-sub">{route.arrival_station}</div>
                                            </div>
                                        </td>
                                        <td className="table-cell">{route.distance} km</td>
                                        <td className="table-cell">{formatDuration(route.default_duration_time)}</td>
                                        <td className="table-cell">
                                            <span className="operator-pill">{route.operator_name}</span>
                                        </td>
                                        <td className="table-cell">
                                            <div className="table-actions">
                                                <button
                                                    onClick={() => onViewDetail && onViewDetail(route)}
                                                    className="icon-button action-view"
                                                    title="View Details"
                                                >
                                                    <FiEye />
                                                </button>
                                                <button
                                                    onClick={() => onEdit && onEdit(route)}
                                                    className="icon-button action-edit"
                                                    title="Edit"
                                                >
                                                    <FiEdit2 />
                                                </button>
                                                <button
                                                    onClick={() => onDelete && onDelete(route)}
                                                    className="icon-button action-delete"
                                                    title="Delete"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="table-meta">
                Showing {filteredRoutes.length} of {routes.length} routes
            </div>
        </div>
    );
};

export default RouteTable;
