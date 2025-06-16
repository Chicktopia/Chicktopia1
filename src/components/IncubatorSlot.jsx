import React from 'react';
import './IncubatorSlot.css';

/**
 * IncubatorSlot Component - Reusable slot for the incubator grid
 * Displays different visual states based on the status prop
 * @param {Object} props - Component properties
 * @param {Object} props.slot - Slot data object containing id, status, timer, etc.
 * @param {Function} props.onEmptySlotClick - Handler for clicking empty slots
 * @param {Function} props.onHatchClick - Handler for clicking hatch button
 * @param {Function} props.onUnlockClick - Handler for clicking locked slots
 * @param {Function} props.onSpeedUpClick - Handler for clicking speed up button
 */
const IncubatorSlot = ({ slot, onEmptySlotClick, onHatchClick, onUnlockClick, onSpeedUpClick }) => {
  const { id, status, timer, unlockCost } = slot;
  const renderSlotContent = () => {
    switch (status) {
      case 'empty':
        return (
          <div className="slot-content slot-empty" onClick={() => onEmptySlotClick(id)}>
            <div className="nest-container">
              <div className="add-icon">+</div>
              <p className="slot-text">Place Egg</p>
            </div>
          </div>
        );

      case 'hatching':
        return (
          <div className="slot-content slot-hatching">
            <div className="egg-container">
              <div className="egg-sprite">🥚</div>
              <div className="timer-display">{timer || '01:34:15'}</div>
              <button className="speed-up-btn" onClick={(e) => { e.stopPropagation(); onSpeedUpClick(id); }}>⚡️</button>
            </div>
          </div>
        );

      case 'ready':
        return (
          <div className="slot-content slot-ready">
            <div className="ready-container">
              <div className="cracking-egg">🐣</div>
              <button className="hatch-btn" onClick={(e) => { e.stopPropagation(); onHatchClick(id); }}>HATCH!</button>
            </div>
          </div>
        );

      case 'locked':
        return (
          <div className="slot-content slot-locked" onClick={() => onUnlockClick(id)}>
            <div className="lock-container">
              <div className="lock-icon">🔒</div>
              <p className="unlock-price">{unlockCost || 500} ChickCoin</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="slot-content slot-empty">
            <div className="nest-container">
              <div className="add-icon">+</div>
              <p className="slot-text">Place Egg</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`incubator-slot ${status}`}>
      {renderSlotContent()}
    </div>
  );
};

export default IncubatorSlot; 