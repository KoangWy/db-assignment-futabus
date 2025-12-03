import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Kiểm tra xem đã đăng nhập chưa mỗi khi Header được load
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      try {
        setUser(JSON.parse(loggedInUser));
      } catch (e) {
        console.error("Lỗi đọc dữ liệu user", e);
      }
    }
  }, []);

  const handleLogout = () => {
    // Xóa thông tin user khỏi bộ nhớ trình duyệt
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login'); // Chuyển về trang login
  };

  return (
    <nav className="header">
      {/* Bấm vào logo để về Trang chủ */}
      <div className="header-logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
        FUTABUS
      </div>
      <ul className="header-nav">
        <li onClick={() => navigate('/')}>Homepage</li>
        <li onClick={() => navigate('/schedule')}>Schedule</li>
        <li onClick={() => navigate('/lookup')}>Lookup</li>
      </ul>
      
      {user ? (
        // Nếu đã đăng nhập -> Hiện tên + Nút Logout
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', color: '#f26522' }}>
            Hi, {user.name}
          </span>
          <button 
            className="login-button" 
            onClick={handleLogout}
            style={{ backgroundColor: '#666', fontSize: '14px' }}
          >
            Logout
          </button>
        </div>
      ) : (
        // Nếu chưa đăng nhập -> Hiện nút Login
        <button className="login-button" onClick={() => navigate('/login')}>
          Login
        </button>
      )}
    </nav>
  );
};

export default Header;