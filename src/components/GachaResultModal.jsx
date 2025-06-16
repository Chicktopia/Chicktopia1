import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { EGG_BLUEPRINTS } from '../gameData/eggBlueprints';
import { getRarityGlowColor } from '../gameData/gachaSystem';
import './GachaResultModal.css';

/**
 * GachaResultModal Component - Spectacular gacha result reveal
 * Features 3D flip animations, rarity glow effects, and card-based reveal system
 */
const GachaResultModal = ({ 
  isOpen, 
  results, 
  pullType, 
  onClose, 
  onAddToInventory 
}) => {
  const [revealedCards, setRevealedCards] = useState(new Set());
  const [allRevealed, setAllRevealed] = useState(false);
  const [backgroundGlow, setBackgroundGlow] = useState('#FFFFFF');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen && results.length > 0) {
      setRevealedCards(new Set());
      setAllRevealed(false);
      setBackgroundGlow('#FFFFFF');
    }
  }, [isOpen, results]);

  // Handle individual card reveal
  const handleCardReveal = (index) => {
    if (revealedCards.has(index)) return;

    const newRevealed = new Set(revealedCards);
    newRevealed.add(index);
    setRevealedCards(newRevealed);

    // Get the rarity of the revealed egg for glow effect
    const eggId = results[index];
    const blueprint = EGG_BLUEPRINTS[eggId];
    if (blueprint) {
      const glowColor = getRarityGlowColor(blueprint.rarity);
      setBackgroundGlow(glowColor);
      
      // Reset glow after animation
      setTimeout(() => setBackgroundGlow('#FFFFFF'), 1000);
    }

    // Check if all cards are revealed
    if (newRevealed.size === results.length) {
      setAllRevealed(true);
    }
  };

  // Handle reveal all cards
  const handleRevealAll = () => {
    const allIndices = new Set(Array.from({ length: results.length }, (_, i) => i));
    setRevealedCards(allIndices);
    setAllRevealed(true);

    // Find highest rarity for background glow
    let highestRarity = 'COMMON';
    results.forEach(eggId => {
      const blueprint = EGG_BLUEPRINTS[eggId];
      if (blueprint) {
        const rarityOrder = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'];
        const currentIndex = rarityOrder.indexOf(blueprint.rarity);
        const highestIndex = rarityOrder.indexOf(highestRarity);
        if (currentIndex > highestIndex) {
          highestRarity = blueprint.rarity;
        }
      }
    });

    const glowColor = getRarityGlowColor(highestRarity);
    setBackgroundGlow(glowColor);
    setTimeout(() => setBackgroundGlow('#FFFFFF'), 2000);
  };

  // Handle confirm and add to inventory
  const handleConfirm = () => {
    if (onAddToInventory) {
      results.forEach(eggId => {
        onAddToInventory(eggId);
      });
    }
    onClose();
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && allRevealed) {
      onClose();
    }
  };

  if (!isOpen || !results || results.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="gacha-result-overlay"
        style={{ backgroundColor: `${backgroundGlow}20` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
      >
        <motion.div
          className="gacha-result-modal"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="result-header">
            <h2 className="result-title">
              {pullType === 'single' ? 'Single Pull Result' : '10-Pull Results'}
            </h2>
            <button 
              className="result-close-btn"
              onClick={onClose}
              disabled={!allRevealed}
            >
              <FaTimes />
            </button>
          </div>

          {/* Results Grid */}
          <div className={`results-grid ${pullType === 'single' ? 'single-result' : 'ten-results'}`}>
            {results.map((eggId, index) => {
              const blueprint = EGG_BLUEPRINTS[eggId];
              const isRevealed = revealedCards.has(index);
              const glowColor = getRarityGlowColor(blueprint?.rarity || 'COMMON');

              return (
                <motion.div
                  key={index}
                  className="result-card-container"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div 
                    className={`result-card ${isRevealed ? 'revealed' : 'hidden'}`}
                    onClick={() => handleCardReveal(index)}
                    style={{
                      '--glow-color': glowColor,
                      '--rarity-color': blueprint?.rarity ? getRarityGlowColor(blueprint.rarity) : '#FFFFFF'
                    }}
                  >
                    {/* Card Front (Hidden State) */}
                    <div className="card-front">
                      <div className="card-back-design">
                        <div className="card-pattern"></div>
                        <span className="card-question">?</span>
                      </div>
                    </div>

                    {/* Card Back (Revealed State) */}
                    <div className="card-back">
                      {blueprint && (
                        <>
                          <div className="egg-art">
                            {blueprint.art}
                          </div>
                          <div className="egg-info">
                            <h4 className="egg-name">{blueprint.name}</h4>
                            <span className={`egg-rarity rarity-${blueprint.rarity.toLowerCase()}`}>
                              {blueprint.rarity}
                            </span>
                          </div>
                          {isRevealed && (
                            <motion.div
                              className="reveal-glow"
                              initial={{ scale: 0, opacity: 1 }}
                              animate={{ scale: 3, opacity: 0 }}
                              transition={{ duration: 1 }}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="result-actions">
            {!allRevealed && results.length > 1 && (
              <button 
                className="reveal-all-btn clay-btn-secondary"
                onClick={handleRevealAll}
              >
                Reveal All
              </button>
            )}
            
            {allRevealed && (
              <button 
                className="confirm-btn clay-btn-primary"
                onClick={handleConfirm}
              >
                Add to Inventory
              </button>
            )}
          </div>

          {/* Pull Summary */}
          {allRevealed && (
            <motion.div
              className="pull-summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="summary-stats">
                {['LEGENDARY', 'EPIC', 'RARE', 'UNCOMMON', 'COMMON'].map(rarity => {
                  const count = results.filter(eggId => {
                    const blueprint = EGG_BLUEPRINTS[eggId];
                    return blueprint?.rarity === rarity;
                  }).length;
                  
                  if (count === 0) return null;
                  
                  return (
                    <div key={rarity} className={`summary-item rarity-${rarity.toLowerCase()}`}>
                      <span className="summary-rarity">{rarity}</span>
                      <span className="summary-count">×{count}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GachaResultModal; 