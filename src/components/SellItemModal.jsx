import React, { useState, useEffect } from 'react';
import { FaCoins, FaPlus, FaMinus } from 'react-icons/fa';
import './SellItemModal.css';

/**
 * SellItemModal Component - Advanced item selling interface with quantity selection
 * Features quantity controls, real-time price calculation, and confirmation
 * @param {Object} props - Component properties
 * @param {boolean} props.isOpen - Whether the modal is currently visible
 * @param {Object} props.item - Item object with blueprint and quantity information
 * @param {Function} props.onConfirm - Function called when sale is confirmed (receives quantity)
 * @param {Function} props.onClose - Function called when modal is closed
 */
const SellItemModal = ({ isOpen, item, onConfirm, onClose }) => {
  // State for selected quantity to sell
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  // Reset quantity when modal opens with new item
  useEffect(() => {
    if (isOpen && item) {
      setSelectedQuantity(1);
    }
  }, [isOpen, item]);

  // Handle keyboard escape to close modal
  useEffect(() => {
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

  // Don't render anything if modal is not open or no item
  if (!isOpen || !item) return null;

  // Calculate values
  const unitPrice = item.blueprint.sellValue || 1;
  const maxQuantity = item.quantity;
  const totalPrice = unitPrice * selectedQuantity;

  // Quantity control functions
  const incrementQuantity = () => {
    if (selectedQuantity < maxQuantity) {
      setSelectedQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (selectedQuantity > 1) {
      setSelectedQuantity(prev => prev - 1);
    }
  };

  const setMaxQuantity = () => {
    setSelectedQuantity(maxQuantity);
  };

  const handleQuantityInputChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    const clampedValue = Math.max(1, Math.min(value, maxQuantity));
    setSelectedQuantity(clampedValue);
  };

  const handleConfirmSale = () => {
    onConfirm(selectedQuantity);
  };

  return (
    <div className="sell-item-modal-backdrop" onClick={handleBackdropClick}>
      <div className="sell-item-modal">
        {/* Modal header */}
        <div className="sell-modal-header">
          <div className="sell-modal-icon">💰</div>
          <h2 className="sell-modal-title">Sell Item</h2>
        </div>

        {/* Item display */}
        <div className="sell-item-display">
          <div className="sell-item-art">{item.blueprint.art}</div>
          <div className="sell-item-info">
            <h3 className="sell-item-name">{item.blueprint.name}</h3>
            <div className="sell-item-details">
              <span className="sell-item-owned">Owned: {maxQuantity}</span>
              <span className="sell-item-unit-price">Unit Price: {unitPrice} <FaCoins /></span>
            </div>
          </div>
        </div>

        {/* Quantity selector */}
        <div className="quantity-selector">
          <label className="quantity-label">Quantity to sell:</label>
          <div className="quantity-controls">
            <button 
              className="quantity-btn decrease"
              onClick={decrementQuantity}
              disabled={selectedQuantity <= 1}
            >
              <FaMinus />
            </button>
            <input 
              type="number"
              className="quantity-input"
              value={selectedQuantity}
              onChange={handleQuantityInputChange}
              min="1"
              max={maxQuantity}
            />
            <button 
              className="quantity-btn increase"
              onClick={incrementQuantity}
              disabled={selectedQuantity >= maxQuantity}
            >
              <FaPlus />
            </button>
            <button 
              className="quantity-btn max"
              onClick={setMaxQuantity}
            >
              Max
            </button>
          </div>
        </div>

        {/* Price calculation display */}
        <div className="price-calculation">
          <div className="price-breakdown">
            <span className="price-formula">{selectedQuantity} × {unitPrice} = </span>
            <span className="total-price">{totalPrice} <FaCoins /></span>
          </div>
          <div className="earnings-display">
            You will receive: <strong>{totalPrice} ChickCoin</strong>
          </div>
        </div>

        {/* Modal footer with action buttons */}
        <div className="sell-modal-footer">
          <button 
            className="sell-modal-button cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="sell-modal-button confirm"
            onClick={handleConfirmSale}
            autoFocus
          >
            Confirm Sale
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellItemModal; 