import React, { useState } from 'react';
import './Tooltip.css';

/**
 * Tooltip Component - Reusable tooltip that appears on hover
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Element to wrap with tooltip
 * @param {string} props.text - Tooltip text to display
 * @param {string} props.position - Tooltip position ('top', 'bottom', 'left', 'right')
 */
const Tooltip = ({ children, text, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <div 
      className="tooltip-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div className={`tooltip tooltip-${position}`}>
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip; 