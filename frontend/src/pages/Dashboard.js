import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Icons } from '../components/Icons';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="welcome-card">
          <div className="welcome-text">
            <h1>Welcome back, {user?.username}!</h1>
            <p className="role-badge">
              Role: <span className={`badge ${user?.role.toLowerCase()}`}>
                {user?.role}
              </span>
            </p>
          </div>
          <img
            src="/inventory.jpg"
            alt="Inventory overview"
            className="welcome-image"
            loading="lazy"
          />
        </div>

        <div className="info-cards">
          <div className="info-card">
            <div className="info-icon"><Icons.Items /></div>
            <h3>Inventory Management</h3>
            <p>View and manage all inventory items</p>
            <a href="/items" className="card-link">Go to Items →</a>
          </div>

          {isAdmin() && (
            <div className="info-card">
              <div className="info-icon"><Icons.Users /></div>
              <h3>User Management</h3>
              <p>Manage users and permissions</p>
              <a href="/users" className="card-link">Manage Users →</a>
            </div>
          )}

          <div className="info-card">
            <div className="info-icon"><Icons.Dashboard /></div>
            <h3>Search Items</h3>
            <p>Find items quickly with advanced search</p>
            <a href="/items" className="card-link">Search Now →</a>
          </div>

          <div className="info-card">
            <div className="info-icon"><Icons.Users /></div>
            <h3>Low Stock Alert</h3>
            <p>Monitor items with low inventory</p>
            <a href="/items" className="card-link">View Alerts →</a>
          </div>
        </div>

        <div className="permissions-info">
          <h3>Your Permissions</h3>
          <ul>
            <li>
              <span className="permission-icon allowed"><Icons.Check /></span>
              View all inventory items
            </li>
            <li>
              <span className="permission-icon allowed"><Icons.Check /></span>
              Search and filter items
            </li>
            {isAdmin() ? (
              <>
                <li>
                  <span className="permission-icon allowed"><Icons.Check /></span>
                  Create new items
                </li>
                <li>
                  <span className="permission-icon allowed"><Icons.Check /></span>
                  Update all item details
                </li>
                <li>
                  <span className="permission-icon allowed"><Icons.Check /></span>
                  Delete items
                </li>
                <li>
                  <span className="permission-icon allowed"><Icons.Check /></span>
                  Manage users
                </li>
                <li>
                  <span className="permission-icon allowed"><Icons.Check /></span>
                  Full system access
                </li>
              </>
            ) : (
              <>
                <li>
                  <span className="permission-icon allowed"><Icons.Check /></span>
                  Update item quantities
                </li>
                <li>
                  <span className="permission-icon denied"><Icons.Times /></span>
                  Cannot create or delete items
                </li>
                <li>
                  <span className="permission-icon denied"><Icons.Times /></span>
                  Cannot modify prices or descriptions
                </li>
                <li>
                  <span className="permission-icon denied"><Icons.Times /></span>
                  Cannot manage users
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;