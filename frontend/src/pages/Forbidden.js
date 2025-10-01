import React from 'react';
import { Link } from 'react-router-dom';
import './ErrorPages.css';

const Forbidden = () => {
  return (
    <div className="error-page">
      <div className="error-content">
        <h1 className="error-code">403</h1>
  <h2 className="error-title">Access Denied</h2>
        <p className="error-message">
          You don't have permission to access this page.
        </p>
        <p className="error-description">
          This page is restricted to administrators only. If you believe this is an error, 
          please contact your system administrator.
        </p>
        <Link to="/dashboard" className="error-button">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;