import React from 'react';
import './MyEggs.css';
import EggCard from './EggCard';

/**
 * MyEggs Component - Displays the player's egg inventory in a scrollable list
 * Allows selection of eggs for placement in incubator slots
 * @param {Object} props - Component properties
 * @param {Array} props.eggs - Array of egg objects in the player's inventory
 * @param {string|null} props.selectedEggId - ID of currently selected egg
 * @param {Function} props.onEggSelect - Function called when an egg is selected/deselected
 */
const MyEggs = ({ eggs, selectedEggId, onEggSelect }) => {
  return (
    <div className="my-eggs">
      {/* Unified section header to match other sections */}
      <h2 className="section-title">My Eggs</h2>

      {/* Scrollable eggs list */}
      <div className="eggs-list">
        {eggs.length > 0 ? (
          eggs.map(egg => (
            <EggCard
              key={egg.id}
              egg={egg}
              isSelected={selectedEggId === egg.id}
              onSelect={onEggSelect}
            />
          ))
        ) : (
          // Empty state when no eggs
          <div className="no-eggs">
            <div className="no-eggs-icon">🥚</div>
            <p className="no-eggs-text">No eggs in inventory</p>
            <p className="no-eggs-hint">Visit the Market to get eggs!</p>
          </div>
        )}
      </div>

      {/* Selection instruction */}
      {eggs.length > 0 && (
        <div className="selection-hint">
          {selectedEggId ? (
            <p className="hint-text selected">
              ✓ Egg selected! Click an empty slot to place it.
            </p>
          ) : (
            <p className="hint-text">
              Click an egg to select it for incubation.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MyEggs; 