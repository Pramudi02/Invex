import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from './ConfirmModal';
import './Navbar.css';
import { Icons } from './Icons';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    logout();
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <img src="/logo.png" alt="Invex" className="brand-logo" />
        </Link>

        <div className="navbar-menu">
          <Link to="/dashboard" className="nav-link">
            <Icons.Dashboard style={{marginRight:6}} /> Dashboard
          </Link>
          
          <Link to="/items" className="nav-link">
            <Icons.Items style={{marginRight:6}} /> Items
          </Link>

          {isAdmin() && (
            <Link to="/users" className="nav-link">
              <Icons.Users style={{marginRight:6}} /> Users
            </Link>
          )}
        </div>

        <div className="navbar-user">
          <span className="user-info">
            <span className="username">{user.username}</span>
            <span className={`user-role ${user.role.toLowerCase()}`}>
              {user.role}
            </span>
          </span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        title="Logout"
        message="Are you sure you want to logout?"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
        confirmText="Logout"
        cancelText="Cancel"
        type="warning"
      />
    </nav>
  );
};

export default Navbar;