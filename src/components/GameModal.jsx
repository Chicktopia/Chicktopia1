import React from 'react';
import './GameModal.css';

/**
 * GameModal Component - Custom modal dialog with claymorphism design
 * Replaces browser alerts with beautiful in-game notifications
 * @param {Object} props - Component properties
 * @param {boolean} props.isOpen - Whether the modal is currently visible
 * @param {string} props.title - Modal title text
 * @param {string} props.message - Modal message content
 * @param {Function} props.onClose - Function called when modal is closed
 * @param {string} props.type - Modal type: 'success', 'warning', 'info', 'error'
 * @param {React.Component} props.icon - Custom icon component to display
 * @param {string} props.buttonText - Custom button text (default: 'OK')
 * @param {boolean} props.showConfirmButton - Whether to show confirm/cancel buttons
 * @param {Function} props.onConfirm - Function called when confirm is clicked
 * @param {string} props.confirmText - Confirm button text (default: 'Confirm')
 * @param {string} props.cancelText - Cancel button text (default: 'Cancel')
 * @param {Array} props.customButtons - Array of custom button objects with {text, onClick, className} properties
 */
const GameModal = ({ 
  isOpen, 
  title, 
  message, 
  onClose, 
  type = 'info',
  icon,
  buttonText = 'OK',
  showConfirmButton = false,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  customButtons
}) => {
  // Handle keyboard escape to close modal
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
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
  }, [isOpen, onClose]);

  // Handle backdrop click to close modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Don't render anything if modal is not open
  if (!isOpen) return null;

  // Get icon based on modal type or custom icon
  const getDisplayIcon = () => {
    if (icon) {
      return React.cloneElement(icon, { className: 'modal-custom-icon' });
    }
    
    switch (type) {
      case 'success':
        return '🎉';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="game-modal-backdrop" onClick={handleBackdropClick}>
      <div className={`game-modal ${type}`}>
        {/* Modal header with icon and title */}
        <div className="modal-header">
          <div className="modal-icon">
            {getDisplayIcon()}
          </div>
          <h2 className="modal-title">{title}</h2>
        </div>

        {/* Modal content */}
        <div className="modal-content">
          {typeof message === 'string' ? (
            <p className="modal-message">{message}</p>
          ) : (
            <div className="modal-message">{message}</div>
          )}
        </div>

        {/* Modal footer with action button(s) */}
        <div className="modal-footer">
          {customButtons ? (
            // Show custom buttons if provided
            customButtons.map((button, index) => (
              <button 
                key={index}
                className={`modal-button ${button.className || ''}`}
                onClick={button.onClick}
                autoFocus={index === 0}
              >
                {button.text}
              </button>
            ))
          ) : showConfirmButton ? (
            // Show confirm/cancel buttons for confirmation dialogs
            <>
              <button 
                className="modal-button cancel"
                onClick={onClose}
              >
                {cancelText}
              </button>
              <button 
                className="modal-button confirm"
                onClick={onConfirm}
                autoFocus
              >
                {confirmText}
              </button>
            </>
          ) : (
            // Show single OK button for notifications
            <button 
              className="modal-button"
              onClick={onClose}
              autoFocus
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameModal; 