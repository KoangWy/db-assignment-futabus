import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <nav className="header">
      {/* Bấm vào logo để về Trang chủ */}
      <div className="header-logo" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
        {/* dùng text làm logo */}
        FUTABUS
      </div>
      <ul className="header-nav">
        <li onClick={() => navigate('/')}>Homepage</li>
        <li onClick={() => navigate('/schedule')}>Schedule</li>
        <li onClick={() => navigate('/lookup')}>Lookup</li>
      </ul>
      {/* Nút đăng nhập chuyển hướng sang trang /login */}
      <button className="login-button" onClick={() => navigate('/login')}>
        Login
      </button>
    </nav>
  );
};

export default Header;