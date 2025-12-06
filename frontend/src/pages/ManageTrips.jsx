import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import RouteTable from '../components/tables/RouteTable';
import TripTable from '../components/tables/TripTable';
import { RouteDetailModal, TripDetailModal } from '../components/modals/DetailModals';

const ManageTrips = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('routes'); // 'routes' or 'trips'
  
  // Modal states
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    // Kiểm tra user có phải staff không
    const loggedInUser = localStorage.getItem('user');
    if (!loggedInUser) {
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(loggedInUser);
      
      // Kiểm tra role - chỉ staff mới được truy cập
      if (userData.role !== 'STAFF') {
        alert('Bạn không có quyền truy cập trang này!');
        navigate('/');
        return;
      }
      
      setUser(userData);
    } catch (e) {
      console.error("Lỗi đọc dữ liệu user", e);
      localStorage.removeItem('user');
      navigate('/login');
    }
  }, [navigate]);

  // Route handlers
  const handleRouteAdd = () => {
    alert('Add route functionality - To be implemented with form modal');
  };

  const handleRouteEdit = (route) => {
    alert(`Edit route ${route.route_id} - To be implemented with form modal`);
  };

  const handleRouteDelete = (route) => {
    if (window.confirm(`Are you sure you want to delete route #${route.route_id}?`)) {
      alert(`Delete route ${route.route_id} - To be implemented with API call`);
    }
  };

  const handleRouteViewDetail = (route) => {
    setSelectedRoute(route);
  };

  // Trip handlers
  const handleTripAdd = () => {
    alert('Add trip functionality - To be implemented with form modal');
  };

  const handleTripEdit = (trip) => {
    alert(`Edit trip ${trip.trip_id} - To be implemented with form modal`);
  };

  const handleTripDelete = (trip) => {
    if (window.confirm(`Are you sure you want to cancel trip #${trip.trip_id}?`)) {
      alert(`Cancel trip ${trip.trip_id} - To be implemented with API call`);
    }
  };

  const handleTripViewDetail = (trip) => {
    setSelectedTrip(trip);
  };

  if (!user) {
    return null; // Hoặc loading spinner
  }

  return (
    <div>
      <Header />
      <div className="page-container" style={{ minHeight: '70vh', padding: '40px 20px' }}>
        <div className="container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '30px'
          }}>
            <h1 style={{ 
              color: 'var(--futa-orange)', 
              margin: 0,
              fontSize: '2rem',
              fontWeight: 'bold'
            }}>
              Manage Routes & Trips
            </h1>
            <p style={{ color: '#666', margin: 0 }}>
              Welcome, <strong>{user?.name}</strong>!
            </p>
          </div>

          {/* Tab Navigation */}
          <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '30px',
            borderBottom: '2px solid #e0e0e0'
          }}>
            <button
              onClick={() => setActiveTab('routes')}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: 'transparent',
                color: activeTab === 'routes' ? 'var(--futa-orange)' : '#666',
                fontWeight: activeTab === 'routes' ? 'bold' : 'normal',
                fontSize: '16px',
                cursor: 'pointer',
                borderBottom: activeTab === 'routes' ? '3px solid var(--futa-orange)' : 'none',
                marginBottom: '-2px',
                transition: 'all 0.3s'
              }}
            >
              Routes
            </button>
            <button
              onClick={() => setActiveTab('trips')}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: 'transparent',
                color: activeTab === 'trips' ? 'var(--futa-orange)' : '#666',
                fontWeight: activeTab === 'trips' ? 'bold' : 'normal',
                fontSize: '16px',
                cursor: 'pointer',
                borderBottom: activeTab === 'trips' ? '3px solid var(--futa-orange)' : 'none',
                marginBottom: '-2px',
                transition: 'all 0.3s'
              }}
            >
              Trips
            </button>
          </div>

          {/* Content Area */}
          <div>
            {activeTab === 'routes' && (
              <RouteTable
                onAdd={handleRouteAdd}
                onEdit={handleRouteEdit}
                onDelete={handleRouteDelete}
                onViewDetail={handleRouteViewDetail}
              />
            )}

            {activeTab === 'trips' && (
              <TripTable
                onAdd={handleTripAdd}
                onEdit={handleTripEdit}
                onDelete={handleTripDelete}
                onViewDetail={handleTripViewDetail}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {selectedRoute && (
        <RouteDetailModal
          route={selectedRoute}
          onClose={() => setSelectedRoute(null)}
        />
      )}

      {selectedTrip && (
        <TripDetailModal
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default ManageTrips;
