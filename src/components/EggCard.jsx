import React from 'react';
import './EggCard.css';
import { getEggBlueprint, RARITY_CONFIG } from '../gameData/eggBlueprints';

/**
 * EggCard Component - Represents an individual egg in the player's inventory
 * REFACTORED for blueprint system - now uses egg instances with blueprint references
 * @param {Object} props - Component properties
 * @param {Object} props.egg - Egg instance object containing id and blueprintId
 * @param {boolean} props.isSelected - Whether this egg is currently selected
 * @param {Function} props.onSelect - Function called when egg is clicked for selection
 */
const EggCard = ({ egg, isSelected, onSelect }) => {
  // Get blueprint data for this egg instance
  const blueprint = getEggBlueprint(egg.blueprintId);
  
  // Fallback if blueprint not found
  if (!blueprint) {
    console.warn(`Blueprint not found for egg: ${egg.blueprintId}`);
    return null;
  }

  // Get rarity configuration for styling
  const rarityConfig = RARITY_CONFIG[blueprint.rarity];

  const handleClick = () => {
    // Toggle selection - if already selected, deselect; otherwise select this egg
    onSelect(isSelected ? null : egg.id);
  };

  return (
    <div 
      className={`egg-card ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      style={{
        borderColor: rarityConfig.color,
        backgroundColor: rarityConfig.bgColor
      }}
    >
      {/* Egg pixel art sprite from blueprint */}
      <div className="egg-sprite">
        {blueprint.art}
      </div>
      
      {/* Egg information from blueprint */}
      <div className="egg-info">
        <h4 className="egg-name">{blueprint.name}</h4>
        <p className="egg-rarity" style={{ color: rarityConfig.color }}>
          {rarityConfig.name}
        </p>
      </div>
      
      {/* Selection indicator */}
      {isSelected && (
        <div className="selection-indicator">
          ✓
        </div>
      )}
    </div>
  );
};

export default EggCard; 