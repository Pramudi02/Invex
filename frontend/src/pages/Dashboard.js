import React from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="welcome-card">
          <h1>👋 Welcome back, {user?.username}!</h1>
          <p className="role-badge">
            Role: <span className={`badge ${user?.role.toLowerCase()}`}>
              {user?.role}
            </span>
          </p>
        </div>

        <div className="info-cards">
          <div className="info-card">
            <div className="info-icon">📦</div>
            <h3>Inventory Management</h3>
            <p>View and manage all inventory items</p>
            <a href="/items" className="card-link">Go to Items →</a>
          </div>

          {user?.role === 'ADMIN' && (
            <div className="info-card">
              <div className="info-icon">👥</div>
              <h3>User Management</h3>
              <p>Manage users and permissions</p>
              <a href="/users" className="card-link">Manage Users →</a>
            </div>
          )}

          <div className="info-card">
            <div className="info-icon">🔍</div>
            <h3>Search Items</h3>
            <p>Find items quickly with advanced search</p>
            <a href="/items" className="card-link">Search Now →</a>
          </div>

          <div className="info-card">
            <div className="info-icon">⚠️</div>
            <h3>Low Stock Alert</h3>
            <p>Monitor items with low inventory</p>
            <a href="/items" className="card-link">View Alerts →</a>
          </div>
        </div>

        <div className="permissions-info">
          <h3>📋 Your Permissions:</h3>
          <ul>
            <li>✅ View all inventory items</li>
            <li>✅ Search and filter items</li>
            {user?.role === 'ADMIN' ? (
              <>
                <li>✅ Create new items</li>
                <li>✅ Update all item details</li>
                <li>✅ Delete items</li>
                <li>✅ Manage users</li>
                <li>✅ Full system access</li>
              </>
            ) : (
              <>
                <li>✅ Update item quantities</li>
                <li>❌ Cannot create or delete items</li>
                <li>❌ Cannot modify prices or descriptions</li>
                <li>❌ Cannot manage users</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;