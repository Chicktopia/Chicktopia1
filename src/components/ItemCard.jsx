import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import './ItemCard.css';

/**
 * ItemCard Component - Individual item card for backpack grid display
 * Features quantity badges, lock icons, rarity borders, and selection states
 * @param {Object} props - Component properties
 * @param {Object} props.item - Item data with blueprint and inventory info
 * @param {boolean} props.isSelected - Whether this item is currently selected
 * @param {Function} props.onClick - Click handler function
 */
const ItemCard = ({ item, isSelected, onClick }) => {
  const { blueprint, quantity, isLocked } = item;

  // Get rarity border class
  const getRarityBorderClass = () => {
    if (!blueprint) return '';
    const rarity = blueprint.rarity.toLowerCase();
    switch (rarity) {
      case 'uncommon':
        return 'item-border-uncommon';
      case 'rare':
        return 'item-border-rare';
      case 'epic':
        return 'item-border-epic';
      case 'legendary':
        return 'item-border-legendary';
      default:
        return ''; // Common has no special border
    }
  };

  // Get selection class
  const getSelectionClass = () => {
    return isSelected ? 'item-selected' : '';
  };

  return (
    <motion.div
      className={`item-card clay-card ${getRarityBorderClass()} ${getSelectionClass()}`}
      onClick={() => onClick(item)}
      // Framer Motion hover animation
      whileHover={{ 
        y: -4,
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      // Framer Motion tap animation
      whileTap={{ 
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
      // Initial animation when component mounts
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Lock Icon (top-left corner) */}
      {isLocked && (
        <div className="item-lock-icon">
          🔒
        </div>
      )}

      {/* Item Art/Icon */}
      <div className="item-art">
        {blueprint?.art || '❓'}
      </div>

      {/* Item Name */}
      <div className="item-name">
        {blueprint?.name || 'Unknown Item'}
      </div>

      {/* Quantity Badge (bottom-right corner) */}
      {quantity > 1 && (
        <div className="item-quantity-badge">
          x{quantity}
        </div>
      )}

      {/* Rarity Tag */}
      {blueprint && (
        <div className={`item-rarity-tag rarity-${blueprint.rarity.toLowerCase()}`}>
          {blueprint.rarity}
        </div>
      )}
    </motion.div>
  );
};

export default ItemCard; 