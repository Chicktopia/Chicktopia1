import React, { useState, useEffect } from 'react';
import './ChickenNamingModal.css';
import { getChickenBlueprint } from '../gameData/chickenBlueprints';

/**
 * ChickenNamingModal Component - Special modal for naming newly hatched chickens
 * Displays chicken art, species name, and nickname input field
 * @param {Object} props - Component properties
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Object} props.chickenInstance - The newly hatched chicken instance
 * @param {Function} props.onConfirm - Callback when nickname is confirmed
 * @param {Function} props.onClose - Callback to close modal
 */
const ChickenNamingModal = ({ isOpen, chickenInstance, onConfirm }) => {
  const [nickname, setNickname] = useState('');
  const [isValid, setIsValid] = useState(false);

  // Get blueprint data for the chicken
  const blueprint = chickenInstance ? getChickenBlueprint(chickenInstance.blueprintId) : null;

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setNickname('');
      setIsValid(false);
    }
  }, [isOpen]);

  // Validate nickname input
  useEffect(() => {
    const trimmedNickname = nickname.trim();
    setIsValid(trimmedNickname.length >= 2 && trimmedNickname.length <= 20);
  }, [nickname]);

  // Handle nickname input change
  const handleNicknameChange = (e) => {
    const value = e.target.value;
    // Allow letters, numbers, spaces, and basic punctuation
    if (/^[a-zA-Z0-9\s\-'.]*$/.test(value)) {
      setNickname(value);
    }
  };

  // Handle confirm button click
  const handleConfirm = () => {
    if (isValid && chickenInstance) {
      const trimmedNickname = nickname.trim();
      onConfirm(chickenInstance, trimmedNickname);
      setNickname('');
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && isValid) {
      handleConfirm();
    }
  };

  // Don't render if not open or no chicken data
  if (!isOpen || !chickenInstance || !blueprint) {
    return null;
  }

  return (
    <div className="chicken-naming-modal-overlay">
      <div className="chicken-naming-modal">
        {/* Modal Header */}
        <div className="naming-modal-header">
          <h2 className="naming-modal-title">🎉 Congratulations!</h2>
          <p className="naming-modal-subtitle">You hatched a new friend!</p>
        </div>

        {/* Chicken Display */}
        <div className="naming-chicken-display">
          <div className="naming-chicken-art">
            {blueprint.art.chick}
          </div>
          <div className="naming-chicken-info">
            <h3 className="naming-species-name">
              You got a {blueprint.name}!
            </h3>
            <span className={`naming-rarity-tag rarity-${blueprint.rarity.toLowerCase()}`}>
              {blueprint.rarity}
            </span>
          </div>
        </div>

        {/* Nickname Input Section */}
        <div className="naming-input-section">
          <label className="naming-input-label">
            Give your new friend a nickname:
          </label>
          <input
            type="text"
            className={`naming-input ${isValid ? 'valid' : 'invalid'}`}
            value={nickname}
            onChange={handleNicknameChange}
            onKeyPress={handleKeyPress}
            placeholder="Enter a nickname..."
            maxLength={20}
            autoFocus
          />
          <div className="naming-input-hint">
            {nickname.length === 0 ? (
              "2-20 characters, letters and numbers only"
            ) : nickname.trim().length < 2 ? (
              "Too short! At least 2 characters needed"
            ) : nickname.trim().length > 20 ? (
              "Too long! Maximum 20 characters"
            ) : (
              `Perfect! "${nickname.trim()}" is a great name! ✨`
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="naming-modal-actions">
          <button
            className={`naming-confirm-btn ${isValid ? 'active' : 'inactive'}`}
            onClick={handleConfirm}
            disabled={!isValid}
          >
            Confirm Name
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChickenNamingModal; 