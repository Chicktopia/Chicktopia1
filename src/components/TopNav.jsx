import React, { useState } from 'react';
import { FaCoins, FaUserCircle, FaChevronDown } from 'react-icons/fa'; // Import icons
import './TopNav.css'; // Import component-specific styles
import { usePlayer } from '../context/PlayerContext.jsx';

/**
 * TopNav Component - Redesigned fixed navigation bar
 * Features dynamic Player Hub, cleaner layout, and consolidated menu system
 */
const TopNav = () => {
  // Access global player state for currency display
  const { chickCoin } = usePlayer();
  
  // State management for dropdowns
  const [isPlayerHubOpen, setIsPlayerHubOpen] = useState(false);
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Toggle for testing login states

  // Handler for Player Hub dropdown
  const togglePlayerHub = () => {
    setIsPlayerHubOpen(!isPlayerHubOpen);
    setIsHamburgerMenuOpen(false); // Close other menus
  };

  // Handler for Hamburger menu
  const toggleHamburgerMenu = () => {
    setIsHamburgerMenuOpen(!isHamburgerMenuOpen);
    setIsPlayerHubOpen(false); // Close other menus
  };

  // Handler for login state toggle (for testing)
  const toggleLoginState = () => {
    setIsLoggedIn(!isLoggedIn);
    setIsPlayerHubOpen(false);
  };

  return (
    <nav className="top-nav">
      <div className="nav-container">
        {/* Left section - Logo */}
        <div className="nav-logo">
          <h2 className="logo-text">Chicktopia</h2>
        </div>

        {/* Center section - ChickCoin Balance */}
        <div className="nav-balance">
          <div className="balance-display">
            <FaCoins className="coin-icon" />
            <span className="balance-text">ChickCoin: {chickCoin}</span>
          </div>
        </div>

        {/* Right section - Player Hub and Hamburger Menu */}
        <div className="nav-actions">
          {/* Dynamic Player Hub */}
          <div className="player-hub">
            {!isLoggedIn ? (
              /* Logged-Out State: Connect Wallet Button */
              <button className="connect-wallet-btn" onClick={toggleLoginState}>
                Connect Wallet
              </button>
            ) : (
              /* Logged-In State: Player Profile Button with Dropdown */
              <div className="player-profile-container">
                <button className="player-profile-btn" onClick={togglePlayerHub}>
                  <FaUserCircle className="profile-avatar" />
                  <span className="player-name">PlayerName</span>
                  <FaChevronDown className={`dropdown-arrow ${isPlayerHubOpen ? 'open' : ''}`} />
                </button>
                
                {/* Player Hub Dropdown Menu */}
                {isPlayerHubOpen && (
                  <div className="player-hub-dropdown">
                    <ul className="dropdown-menu">
                      <li className="dropdown-item">
                        <span className="dropdown-icon">👤</span>
                        Profile
                      </li>
                      <li className="dropdown-item">
                        <span className="dropdown-icon">➕</span>
                        Add Coins
                      </li>
                      <li className="dropdown-item">
                        <span className="dropdown-icon">⚙️</span>
                        Settings
                      </li>
                      <li className="dropdown-item logout" onClick={toggleLoginState}>
                        <span className="dropdown-icon">🚪</span>
                        Logout
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hamburger Menu */}
          <div className="hamburger-container">
            <button className="menu-btn" onClick={toggleHamburgerMenu}>
              <span className="menu-icon">☰</span>
            </button>
            
            {/* Hamburger Menu Dropdown */}
            {isHamburgerMenuOpen && (
              <div className="hamburger-dropdown">
                <ul className="dropdown-menu">
                  <li className="dropdown-item">
                    <span className="dropdown-icon">🛒</span>
                    Shop
                  </li>
                  <li className="dropdown-item">
                    <span className="dropdown-icon">🎉</span>
                    Events
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopNav; 