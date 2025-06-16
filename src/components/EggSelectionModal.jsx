import React, { useState } from 'react';
import './EggSelectionModal.css';
import EggCard from './EggCard';

/**
 * EggSelectionModal Component - Modal for selecting eggs to place in incubator slots
 * Opens when user clicks an empty incubator slot, showing egg inventory for selection
 * @param {Object} props - Component properties
 * @param {boolean} props.isOpen - Whether the modal is currently visible
 * @param {Array} props.eggs - Array of available eggs in inventory
 * @param {Function} props.onEggSelect - Function called when an egg is selected and confirmed
 * @param {Function} props.onClose - Function called when modal is closed
 * @param {number} props.slotId - ID of the slot that will receive the selected egg
 */
const EggSelectionModal = ({ isOpen, eggs, onEggSelect, onClose, slotId }) => {
  const [selectedEggId, setSelectedEggId] = useState(null);

  // Handle keyboard escape to close modal
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Don't render anything if modal is not open
  if (!isOpen) return null;

  // Handle backdrop click to close modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Handle closing modal and reset selection
  const handleClose = () => {
    setSelectedEggId(null);
    onClose();
  };

  // Handle egg selection within the modal
  const handleEggSelect = (eggId) => {
    setSelectedEggId(eggId);
  };

  // Handle confirm button click
  const handleConfirm = () => {
    if (selectedEggId) {
      onEggSelect(slotId, selectedEggId);
      handleClose();
    }
  };

  return (
    <div className="egg-selection-backdrop" onClick={handleBackdropClick}>
      <div className="egg-selection-modal">
        {/* Modal header */}
        <div className="modal-header">
          <div className="modal-icon">🥚</div>
          <h2 className="modal-title">Select an Egg</h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>

        {/* Modal content - Egg inventory */}
        <div className="modal-content">
          <p className="modal-subtitle">Choose an egg to place in the incubator slot:</p>
          
          <div className="eggs-grid">
            {eggs.length > 0 ? (
              eggs.map(egg => (
                <EggCard
                  key={egg.id}
                  egg={egg}
                  isSelected={selectedEggId === egg.id}
                  onSelect={handleEggSelect}
                />
              ))
            ) : (
              <div className="no-eggs-available">
                <div className="no-eggs-icon">🥚</div>
                <p className="no-eggs-text">No eggs available</p>
                <p className="no-eggs-hint">Visit the Market to get eggs!</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal footer with action buttons */}
        <div className="modal-footer">
          <button className="cancel-button" onClick={handleClose}>
            Cancel
          </button>
          <button 
            className={`confirm-button ${!selectedEggId ? 'disabled' : ''}`}
            onClick={handleConfirm}
            disabled={!selectedEggId}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default EggSelectionModal; 