import React, { useState } from 'react';
import { FaCoins, FaUserCircle, FaChevronDown, FaSignOutAlt, FaEnvelopeOpenText, FaCog } from 'react-icons/fa'; // Import icons
import { useWallet } from '@solana/wallet-adapter-react';
import './TopNav.css'; // Import component-specific styles
import { usePlayer } from '../context/PlayerContext.jsx';
import { WalletConnectButton } from './WalletConnectButton';
import GameModal from './GameModal'; // Import GameModal component
import AddCoinsModal from './AddCoinsModal'; // Import AddCoinsModal component

/**
 * TopNav Component - Redesigned fixed navigation bar
 * Features dynamic Player Hub, cleaner layout, and consolidated menu system
 * Now integrated with real Solana wallet connectivity, modal functionality, and ChickCoin purchasing
 */
const TopNav = () => {
  // Access global player state for currency display and functions
  const { chickCoin, addChickCoin } = usePlayer();
  
  // Access Solana wallet state
  const { connected, publicKey, disconnect } = useWallet();
  
  // State management for dropdowns
  const [isPlayerHubOpen, setIsPlayerHubOpen] = useState(false);
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);
  
  // State management for modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAddCoinsModalOpen, setIsAddCoinsModalOpen] = useState(false);

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

  // Handler for Profile menu item
  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
    setIsPlayerHubOpen(false); // Close dropdown menu
  };

  // Handler for Settings menu item
  const handleSettingsClick = () => {
    setIsSettingsModalOpen(true);
    setIsPlayerHubOpen(false); // Close dropdown menu
  };

  // Handler for Add Coins menu item
  const handleAddCoinsClick = () => {
    setIsAddCoinsModalOpen(true);
    setIsPlayerHubOpen(false); // Close dropdown menu
  };

  // Handler for opening Twitter/X link
  const handleGoToX = () => {
    window.open('https://x.com/Chicktopia', '_blank');
    setIsProfileModalOpen(false); // Close modal after opening link
  };

  // Handler for ChickCoin purchase confirmation
  const handlePurchaseConfirm = (chickCoinAmount) => {
    // Add the ChickCoin to player's balance (real transaction handled in AddCoinsModal)
    addChickCoin(chickCoinAmount);
  };

  // Format numbers with commas for display
  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  // Format wallet address for display
  const formatWalletAddress = (address) => {
    if (!address) return '';
    const addressStr = address.toString();
    return `${addressStr.slice(0, 4)}...${addressStr.slice(-4)}`;
  };

  return (
    <>
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
              <span className="balance-text">ChickCoin: {formatNumber(chickCoin)}</span>
            </div>
          </div>

          {/* Right section - Wallet and Hamburger Menu */}
          <div className="nav-actions">
            {/* Solana Wallet Connection */}
            <div className="wallet-section">
              {!connected ? (
                /* Not Connected: Wallet Connect Button */
                <WalletConnectButton />
              ) : (
                /* Connected: Player Profile Button with Dropdown */
                <div className="player-profile-container">
                  <button className="player-profile-btn" onClick={togglePlayerHub}>
                    <FaUserCircle className="profile-avatar" />
                    <span className="player-name">{formatWalletAddress(publicKey)}</span>
                    <FaChevronDown className={`dropdown-arrow ${isPlayerHubOpen ? 'open' : ''}`} />
                  </button>
                  
                  {/* Player Hub Dropdown Menu */}
                  {isPlayerHubOpen && (
                    <div className="player-hub-dropdown">
                      <ul className="dropdown-menu">
                        <li className="dropdown-item" onClick={handleProfileClick}>
                          <span className="dropdown-icon">👤</span>
                          Profile
                        </li>
                        <li className="dropdown-item" onClick={handleAddCoinsClick}>
                          <span className="dropdown-icon">➕</span>
                          Add Coins
                        </li>
                        <li className="dropdown-item" onClick={handleSettingsClick}>
                          <span className="dropdown-icon">⚙️</span>
                          Settings
                        </li>
                        <li className="dropdown-item">
                          <span className="dropdown-icon">💳</span>
                          Wallet: {formatWalletAddress(publicKey)}
                        </li>
                        <li className="dropdown-item disconnect" onClick={disconnect}>
                          <FaSignOutAlt className="dropdown-icon" />
                          Disconnect
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

      {/* Profile Modal - "A Note from the Devs" */}
      <GameModal
        isOpen={isProfileModalOpen}
        title="A Note from the Devs"
        icon={<FaEnvelopeOpenText />}
        message="This is a very early Alpha Version of Chicktopia, and many features are still under construction! If you find any bugs or have great ideas, please send a direct message to our official X (Twitter) account: @Chicktopia. Valuable feedback will be rewarded with some $CHICK!"
        customButtons={[
          {
            text: "[ Go to X ]",
            onClick: handleGoToX,
            className: "confirm"
          },
          {
            text: "[ Got It! ]",
            onClick: () => setIsProfileModalOpen(false),
            className: "cancel"
          }
        ]}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Settings Modal - Coming Soon Placeholder */}
      <GameModal
        isOpen={isSettingsModalOpen}
        title="Settings"
        icon={<FaCog />}
        message="This feature is coming soon! Stay tuned for updates."
        buttonText="[ OK ]"
        onClose={() => setIsSettingsModalOpen(false)}
      />

      {/* Add Coins Modal - Comprehensive ChickCoin Purchase */}
      <AddCoinsModal
        isOpen={isAddCoinsModalOpen}
        onClose={() => setIsAddCoinsModalOpen(false)}
        onPurchaseConfirm={handlePurchaseConfirm}
      />
    </>
  );
};

export default TopNav; 