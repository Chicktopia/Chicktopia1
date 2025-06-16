import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { usePlayer } from '../context/PlayerContext.jsx';
import { getItemBlueprint, ITEM_CATEGORIES } from '../gameData/itemBlueprints';
import './SelectFeedModal.css';

/**
 * SelectFeedModal Component - Modal for selecting feed items to give to chickens
 * Displays only consumable items from the player's inventory
 * @param {Object} props - Component properties
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Object} props.chicken - The chicken being fed
 * @param {function} props.onFeedSelect - Function called when feed is selected
 * @param {function} props.onClose - Function to close the modal
 */
const SelectFeedModal = ({ isOpen, chicken, onFeedSelect, onClose }) => {
  const { inventory } = usePlayer();

  // Get consumable items from inventory
  const consumableItems = Object.entries(inventory || {})
    .map(([itemId, itemData]) => {
      const blueprint = getItemBlueprint(itemId);
      if (blueprint && blueprint.category === ITEM_CATEGORIES.CONSUMABLE && itemData.quantity > 0) {
        return {
          id: itemId,
          blueprint,
          quantity: itemData.quantity,
          isLocked: itemData.isLocked || false
        };
      }
      return null;
    })
    .filter(item => item !== null);

  // Animation variants for the modal
  const modalVariants = {
    closed: {
      scale: 0.8,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    },
    open: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  };

  // Animation variants for the backdrop
  const backdropVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.3
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  // Handle backdrop click to close modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle feed selection
  const handleFeedSelect = (feedItem) => {
    if (feedItem.isLocked) return;
    onFeedSelect(feedItem);
  };

  // Handle escape key press
  React.useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="select-feed-overlay"
          variants={backdropVariants}
          initial="closed"
          animate="open"
          exit="closed"
          onClick={handleBackdropClick}
        >
          <motion.div
            className="select-feed-modal"
            variants={modalVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="select-feed-header">
              <h3 className="select-feed-title">Select Feed for {chicken?.nickname || chicken?.name}</h3>
              <button 
                className="select-feed-close-btn" 
                onClick={onClose}
                aria-label="Close modal"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Content */}
            <div className="select-feed-content">
              {consumableItems.length > 0 ? (
                <div className="feed-grid">
                  {consumableItems.map((feedItem) => (
                    <div
                      key={feedItem.id}
                      className={`feed-item-card ${feedItem.isLocked ? 'locked' : ''}`}
                      onClick={() => handleFeedSelect(feedItem)}
                    >
                      <div className="feed-item-icon">
                        {feedItem.blueprint.art}
                      </div>
                      <div className="feed-item-info">
                        <h4 className="feed-item-name">{feedItem.blueprint.name}</h4>
                        <p className="feed-item-description">{feedItem.blueprint.description}</p>
                        <div className="feed-item-effects">
                          {feedItem.blueprint.onUse?.xp_gain && (
                            <span className="feed-effect">+{feedItem.blueprint.onUse.xp_gain} XP</span>
                          )}
                          {feedItem.blueprint.onUse?.happiness_gain && (
                            <span className="feed-effect">+{feedItem.blueprint.onUse.happiness_gain} Happiness</span>
                          )}
                          {feedItem.blueprint.onUse?.stat_boost && (
                            <span className="feed-effect">
                              +{feedItem.blueprint.onUse.stat_boost.value} {feedItem.blueprint.onUse.stat_boost.stat}
                            </span>
                          )}
                        </div>
                        <div className="feed-item-quantity">
                          Quantity: {feedItem.quantity}
                        </div>
                      </div>
                      {feedItem.isLocked && (
                        <div className="feed-item-locked">🔒</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-feed-items">
                  <span className="no-feed-emoji">🥺</span>
                  <h4>No Feed Available</h4>
                  <p>You don't have any consumable items to feed this chicken. Visit the Market to buy some feed!</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SelectFeedModal; 