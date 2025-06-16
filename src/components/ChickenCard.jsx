import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'; // Import framer-motion for smooth animations
import './ChickenCard.css'; // Import component-specific styles

/**
 * ChickenCard Component - Individual chicken card with claymorphism design
 * UPDATED: Now supports blueprint-based chicken display with nicknames and rarity borders
 * @param {Object} props - Component properties
 * @param {string} props.nickname - Chicken's personal nickname (primary display)
 * @param {string} props.name - Chicken's species name (secondary display)
 * @param {number} props.level - Chicken's level
 * @param {string} props.status - Chicken's current status ('hungry', 'normal', 'egg-ready', 'very-hungry')
 * @param {Object} props.blueprint - Chicken blueprint data (optional)
 * @param {Object} props.instance - Chicken instance data (optional)
 * @param {function} props.onClick - Click handler function
 */
const ChickenCard = ({ nickname, name, level, status, blueprint, instance, onClick }) => {
  
  // Function to get status emoji and text based on status prop
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'hungry':
        return { emoji: '😋', text: 'Hungry' };
      case 'normal':
        return { emoji: '😄', text: 'Normal' };
      case 'egg-ready':
        return { emoji: '🥚', text: 'Egg Ready' };
      case 'very-hungry':
        return { emoji: '😢', text: 'Very Hungry' };
      default:
        return { emoji: '😄', text: 'Normal' };
    }
  };

  const statusDisplay = getStatusDisplay(status);

  // Get rarity border class
  const getRarityBorderClass = () => {
    if (!blueprint) return '';
    const rarity = blueprint.rarity.toLowerCase();
    switch (rarity) {
      case 'uncommon':
        return 'border-uncommon';
      case 'rare':
        return 'border-rare';
      case 'epic':
        return 'border-epic';
      case 'legendary':
        return 'border-legendary';
      default:
        return ''; // Common has no special border
    }
  };

  return (
    <motion.div
      className={`chicken-card clay-card ${status} ${getRarityBorderClass()}`}
      onClick={onClick}
      // Framer Motion hover animation - lift effect
      whileHover={{ 
        y: -6, // Move up 6px
        scale: 1.03, // Scale up by 3%
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      // Framer Motion tap animation - slight press effect
      whileTap={{ 
        scale: 0.97,
        transition: { duration: 0.1 }
      }}
      // Initial animation when component mounts
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Chicken Name Section */}
      <div className="chicken-header">
        <span className="chicken-emoji">
          {/* Show appropriate art based on stage */}
          {blueprint?.art && instance?.stage
            ? (blueprint.art[instance.stage] || blueprint.art.chick || '🐤')
            : (blueprint?.art?.chick || '🐤')
          }
        </span>
        <div className="chicken-name-section">
          <h4 className="chicken-name">{nickname || name}</h4>
          {/* Species name (smaller, secondary) - only show if nickname exists */}
          {nickname && (
            <p className="chicken-species">{name}</p>
          )}
          {/* Rarity Tag */}
          {blueprint && (
            <span className={`rarity-tag rarity-${blueprint.rarity.toLowerCase()}`}>
              {blueprint.rarity}
            </span>
          )}
          {/* Stage indicator */}
          {instance?.stage && (
            <span className={`stage-tag stage-${instance.stage}`}>
              {instance.stage === 'adult' ? '🐔 Adult' : '🐣 Juvenile'}
            </span>
          )}
        </div>
      </div>

      {/* Level Display */}
      <div className="chicken-level">
        <span className="level-text">Lv. {level}</span>
      </div>

      {/* Status Indicator */}
      <div className="chicken-status">
        <span className="status-emoji">{statusDisplay.emoji}</span>
        <span className="status-text">{statusDisplay.text}</span>
      </div>
    </motion.div>
  );
};

export default ChickenCard; 