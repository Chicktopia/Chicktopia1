import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BottomNavigation.css';
// Import icons from reliable and well-supported icon sets
import { AiOutlineHome, AiOutlineShop } from 'react-icons/ai';
import { GiBarn } from 'react-icons/gi';
import { FaMapSigns } from 'react-icons/fa';
import { BsHandbag } from 'react-icons/bs';

/**
 * BottomNavigation Component
 * A fixed bottom navigation bar with 5 functional buttons
 * Styled with Earthen Claymorphism design matching the game theme
 */
const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get current active nav based on current route
  const getActiveNav = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/coop') return 'coop';
    if (path === '/hatchery') return 'hatchery';
    if (path === '/backpack') return 'backpack';
    // Add more route mappings as needed
    return 'home';
  };

  // Handler for button clicks with actual navigation
  const handleNavClick = (section, path) => {
    console.log(`Navigating to: ${section}`);
    navigate(path);
  };

  const activeNav = getActiveNav();

  return (
    <nav className="bottom-navigation">
      {/* Home Button */}
      <button 
        className={`nav-button ${activeNav === 'home' ? 'active' : ''}`}
        onClick={() => handleNavClick('home', '/')}
        title="Home"
        aria-label="Navigate to Home"
      >
        <AiOutlineHome className="nav-icon" />
        <span className="nav-label">Home</span>
      </button>

      {/* Coop Button */}
      <button 
        className={`nav-button ${activeNav === 'coop' ? 'active' : ''}`}
        onClick={() => handleNavClick('coop', '/coop')}
        title="Coop"
        aria-label="Open Coop"
      >
        <GiBarn className="nav-icon" />
        <span className="nav-label">Coop</span>
      </button>

      {/* Expeditions Button */}
      <button 
        className={`nav-button ${activeNav === 'expeditions' ? 'active' : ''}`}
        onClick={() => handleNavClick('expeditions', '/expeditions')}
        title="Expeditions"
        aria-label="Open Expeditions"
      >
        <FaMapSigns className="nav-icon" />
        <span className="nav-label">Expeditions</span>
      </button>

      {/* Market Button */}
      <button 
        className={`nav-button ${activeNav === 'market' ? 'active' : ''}`}
        onClick={() => handleNavClick('market', '/market')}
        title="Market"
        aria-label="Open Market"
      >
        <AiOutlineShop className="nav-icon" />
        <span className="nav-label">Market</span>
      </button>

      {/* Backpack Button */}
      <button 
        className={`nav-button ${activeNav === 'backpack' ? 'active' : ''}`}
        onClick={() => handleNavClick('backpack', '/backpack')}
        title="Backpack"
        aria-label="Open Backpack"
      >
        <BsHandbag className="nav-icon" />
        <span className="nav-label">Backpack</span>
      </button>
    </nav>
  );
};

export default BottomNavigation; 