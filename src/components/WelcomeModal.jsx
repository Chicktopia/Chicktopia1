import React from 'react';
import { FaCheck } from 'react-icons/fa';
import './WelcomeModal.css';

/**
 * WelcomeModal Component - First-time player welcome screen
 * Shows only when no save file exists in localStorage
 * Introduces players to Chicktopia with beautiful claymorphism design
 * @param {Object} props - Component properties
 * @param {boolean} props.isOpen - Whether the modal is currently visible
 * @param {Function} props.onStartPlaying - Function called when "Start Playing" is clicked
 * @param {boolean} props.isReopened - Whether this is a reopened modal (from About button)
 */
const WelcomeModal = ({ isOpen, onStartPlaying, isReopened = false }) => {
  // Handle keyboard escape to close modal (disabled for welcome modal)
  React.useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle external link buttons
  const handleWhitepaperClick = () => {
    window.open('https://chicktopia.gitbook.io/chicktopia/', '_blank');
  };

  const handleFollowXClick = () => {
    window.open('https://x.com/Chicktopia', '_blank');
  };

  // Don't render anything if modal is not open
  if (!isOpen) return null;

  return (
    <div className="welcome-modal-backdrop">
      <div className="welcome-modal">
        {/* Header Image - Friendly Chicken Mascot */}
        <div className="welcome-header-image">
          <div className="mascot-container">
            {/* Pixel art chicken mascot placeholder - using emoji for now */}
            <div className="chicken-mascot">🐣</div>
            <div className="mascot-glow"></div>
          </div>
        </div>

        {/* Main Title */}
        <h1 className="welcome-title">Welcome to Chicktopia!</h1>

        {/* Welcome Text */}
        <div className="welcome-content">
          <p className="welcome-text">
            In this magical world, you'll hatch unique pixel chicks, care for them with love, 
            and train them to witness their evolution from a tiny egg to a legendary companion! 
            Come and build your own Chicktopia!
          </p>

          {/* Alpha Version Notice */}
          <p className="alpha-notice">
            <em>Please note: This is a very early Alpha Version! Many features are still hatching. 
            We eagerly await your valuable feedback.</em>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="welcome-buttons">
          {/* Primary Button - Start Playing or Got It */}
          <button 
            className="welcome-button primary"
            onClick={onStartPlaying}
            autoFocus
          >
            {isReopened ? (
              <>
                <FaCheck style={{ marginRight: '8px' }} />
                Got It!
              </>
            ) : (
              '🎮 Start Playing'
            )}
          </button>

          {/* Secondary Buttons */}
          <div className="secondary-buttons">
            <button 
              className="welcome-button secondary"
              onClick={handleWhitepaperClick}
            >
              📖 Whitepaper
            </button>
            
            <button 
              className="welcome-button secondary"
              onClick={handleFollowXClick}
            >
              𝕏 Follow Us on X
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal; 