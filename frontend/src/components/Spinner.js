import React from 'react';
import './Spinner.css';

// Single-circle loading spinner with no text by default
const Spinner = ({ fullscreen = false }) => {
  const content = (
    <div className="spinner">
      <div className="spinner-circle" />
    </div>
  );

  if (fullscreen) {
    return <div className="spinner-overlay">{content}</div>;
  }

  return content;
};

export default Spinner;
