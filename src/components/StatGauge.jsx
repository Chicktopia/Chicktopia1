import React from 'react';
import './StatGauge.css'; // Import component-specific styles

/**
 * StatGauge Component - Reusable horizontal gauge for displaying stats
 * Shows icon, text value, and progress bar in a clean horizontal layout
 * @param {Object} props - Component properties
 * @param {React.Component} props.icon - React icon component to display
 * @param {string} props.label - Text label for the stat
 * @param {number} props.currentValue - Current value of the stat
 * @param {number} props.maxValue - Maximum value of the stat
 * @param {string} props.color - Color theme for the progress bar (purple, orange, green)
 */
const StatGauge = ({ icon: Icon, label, currentValue, maxValue, color }) => {
  // Calculate percentage for progress bar
  const percentage = Math.min(100, (currentValue / maxValue) * 100);
  
  return (
    <div className="stat-gauge">
      {/* Icon container */}
      <div className="stat-gauge-icon">
        <Icon />
      </div>
      
      {/* Content container */}
      <div className="stat-gauge-content">
        {/* Text label showing current/max values */}
        <div className="stat-gauge-label">
          {currentValue} / {maxValue}
        </div>
        
        {/* Progress bar */}
        <div className="stat-gauge-bar">
          <div 
            className={`stat-gauge-fill ${color}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default StatGauge; 