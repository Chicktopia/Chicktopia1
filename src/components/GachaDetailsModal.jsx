import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaInfoCircle } from 'react-icons/fa';
import { GACHA_POOLS, calculateDropRates } from '../gameData/gachaSystem';
import { EGG_BLUEPRINTS, RARITY_CONFIG } from '../gameData/eggBlueprints';
import './GachaDetailsModal.css';

/**
 * GachaDetailsModal Component - Display pool details and drop rates
 * Features beautiful UI with rarity-based styling and probability calculations
 */
const GachaDetailsModal = ({ 
  isOpen, 
  onClose, 
  activePool 
}) => {
  if (!isOpen) return null;

  const pool = GACHA_POOLS[activePool];
  const dropRates = calculateDropRates(activePool);

  // Group eggs by rarity for better display
  const eggsByRarity = {};
  Object.entries(dropRates).forEach(([eggId, data]) => {
    if (!eggsByRarity[data.rarity]) {
      eggsByRarity[data.rarity] = [];
    }
    eggsByRarity[data.rarity].push({ eggId, ...data });
  });

  // Calculate total rates by rarity
  const rarityTotals = {};
  Object.entries(eggsByRarity).forEach(([rarity, eggs]) => {
    rarityTotals[rarity] = eggs.reduce((total, egg) => total + parseFloat(egg.rate), 0);
  });

  const rarityOrder = ['LEGENDARY', 'EPIC', 'RARE', 'UNCOMMON', 'COMMON'];

  return (
    <AnimatePresence>
      <motion.div
        className="gacha-details-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="gacha-details-modal"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="details-header">
            <h2 className="details-title">
              <FaInfoCircle className="details-icon" />
              {pool?.name} - Drop Rates
            </h2>
            <button className="details-close-btn" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          {/* Pool Description */}
          <div className="pool-description">
            <p>{pool?.description}</p>
          </div>

          {/* Drop Rates by Rarity */}
          <div className="drop-rates-section">
            <h3 className="section-title">Drop Rates by Rarity</h3>
            <div className="rarity-summary">
              {rarityOrder.map(rarity => {
                if (!rarityTotals[rarity]) return null;
                const config = RARITY_CONFIG[rarity];
                return (
                  <div 
                    key={rarity} 
                    className={`rarity-total rarity-${rarity.toLowerCase()}`}
                    style={{ '--rarity-color': config?.color || '#8B7D6B' }}
                  >
                    <span className="rarity-name">{rarity}</span>
                    <span className="rarity-rate">{rarityTotals[rarity].toFixed(2)}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Egg List */}
          <div className="detailed-rates-section">
            <h3 className="section-title">Individual Egg Drop Rates</h3>
            <div className="eggs-list">
              {rarityOrder.map(rarity => {
                if (!eggsByRarity[rarity]) return null;
                const config = RARITY_CONFIG[rarity];
                
                return (
                  <div key={rarity} className="rarity-group">
                    <h4 
                      className={`rarity-group-title rarity-${rarity.toLowerCase()}`}
                      style={{ '--rarity-color': config?.color || '#8B7D6B' }}
                    >
                      {rarity} ({rarityTotals[rarity].toFixed(2)}%)
                    </h4>
                    <div className="eggs-grid">
                      {eggsByRarity[rarity].map(({ eggId, rate, name }) => {
                        const blueprint = EGG_BLUEPRINTS[eggId];
                        return (
                          <div 
                            key={eggId} 
                            className={`egg-item rarity-${rarity.toLowerCase()}`}
                            style={{ '--rarity-color': config?.color || '#8B7D6B' }}
                          >
                            <div className="egg-art">{blueprint?.art || '🥚'}</div>
                            <div className="egg-info">
                              <span className="egg-name">{name}</span>
                              <span className="egg-rate">{rate}%</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pity System Info */}
          <div className="pity-info-section">
            <h3 className="section-title">Pity System</h3>
            <div className="pity-explanation">
              <div className="pity-rule">
                <strong>10-Pull Guarantee:</strong> Every 10-pull is guaranteed to contain at least one RARE or higher egg.
              </div>
              <div className="pity-rule">
                <strong>Pity Counter:</strong> If no RARE+ egg is naturally rolled in a 10-pull, one random result will be upgraded to a RARE egg.
              </div>
              <div className="pity-rule">
                <strong>Counter Reset:</strong> The pity counter resets whenever a RARE or higher egg is obtained.
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="details-actions">
            <button className="details-close-action" onClick={onClose}>
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GachaDetailsModal; 