import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCoins, FaTicketAlt, FaExchangeAlt } from 'react-icons/fa';
import './TicketExchangeModal.css';

/**
 * TicketExchangeModal Component - Exchange ChickCoin for Gacha Tickets
 * Features beautiful UI with exchange rate display and confirmation
 */
const TicketExchangeModal = ({ 
  isOpen, 
  onClose, 
  currentChickCoin, 
  currentTickets,
  onExchange 
}) => {
  const [exchangeAmount, setExchangeAmount] = useState(1);
  
  // Exchange rate: 100 ChickCoin = 1 Gacha Ticket
  const EXCHANGE_RATE = 100;
  
  const totalCost = exchangeAmount * EXCHANGE_RATE;
  const canAfford = currentChickCoin >= totalCost;

  const handleExchange = () => {
    if (canAfford && exchangeAmount > 0) {
      onExchange(exchangeAmount, totalCost);
      setExchangeAmount(1);
      onClose();
    }
  };

  const handleAmountChange = (newAmount) => {
    const amount = Math.max(1, Math.min(newAmount, Math.floor(currentChickCoin / EXCHANGE_RATE)));
    setExchangeAmount(amount);
  };

  const handleMaxClick = () => {
    const maxAffordable = Math.floor(currentChickCoin / EXCHANGE_RATE);
    setExchangeAmount(Math.max(1, maxAffordable));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="ticket-exchange-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="ticket-exchange-modal"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="exchange-header">
            <h2 className="exchange-title">
              <FaExchangeAlt className="exchange-icon" />
              Ticket Exchange
            </h2>
            <button className="exchange-close-btn" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          {/* Current Balances */}
          <div className="current-balances">
            <div className="balance-item">
              <FaCoins className="balance-icon coin-icon" />
              <span className="balance-label">ChickCoin</span>
              <span className="balance-value">{currentChickCoin.toLocaleString()}</span>
            </div>
            <div className="balance-item">
              <FaTicketAlt className="balance-icon ticket-icon" />
              <span className="balance-label">Gacha Tickets</span>
              <span className="balance-value">{currentTickets}</span>
            </div>
          </div>

          {/* Exchange Rate Info */}
          <div className="exchange-rate">
            <div className="rate-display">
              <span className="rate-text">Exchange Rate:</span>
              <div className="rate-conversion">
                <span className="rate-amount">100 <FaCoins /></span>
                <FaExchangeAlt className="rate-arrow" />
                <span className="rate-amount">1 <FaTicketAlt /></span>
              </div>
            </div>
          </div>

          {/* Exchange Controls */}
          <div className="exchange-controls">
            <div className="amount-selector">
              <label className="amount-label">Tickets to Purchase:</label>
              <div className="amount-input-group">
                <button 
                  className="amount-btn"
                  onClick={() => handleAmountChange(exchangeAmount - 1)}
                  disabled={exchangeAmount <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  className="amount-input"
                  value={exchangeAmount}
                  onChange={(e) => handleAmountChange(parseInt(e.target.value) || 1)}
                  min="1"
                  max={Math.floor(currentChickCoin / EXCHANGE_RATE)}
                />
                <button 
                  className="amount-btn"
                  onClick={() => handleAmountChange(exchangeAmount + 1)}
                  disabled={totalCost + EXCHANGE_RATE > currentChickCoin}
                >
                  +
                </button>
              </div>
              <button 
                className="max-btn"
                onClick={handleMaxClick}
                disabled={currentChickCoin < EXCHANGE_RATE}
              >
                MAX
              </button>
            </div>

            {/* Cost Display */}
            <div className="cost-display">
              <div className="cost-breakdown">
                <span className="cost-label">Total Cost:</span>
                <span className={`cost-value ${!canAfford ? 'insufficient' : ''}`}>
                  {totalCost.toLocaleString()} <FaCoins />
                </span>
              </div>
              <div className="cost-breakdown">
                <span className="cost-label">You'll Receive:</span>
                <span className="cost-value receive">
                  {exchangeAmount} <FaTicketAlt />
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="exchange-actions">
            <button 
              className="exchange-btn cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              className={`exchange-btn confirm-btn ${!canAfford ? 'disabled' : ''}`}
              onClick={handleExchange}
              disabled={!canAfford || exchangeAmount <= 0}
            >
              {!canAfford ? 'Insufficient Funds' : 'Exchange'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TicketExchangeModal; 