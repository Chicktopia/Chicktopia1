import React, { useState, useEffect } from 'react';
import './HomePage.css';

// Import homepage components
import FeatureCardsContainer from './FeatureCard';
import ChickenGrid from './ChickenGrid';
import { usePlayer } from '../context/PlayerContext.jsx';

/**
 * HomePage Component - Main homepage content
 * Contains the feature cards, chicken grid, and details panel
 */
const HomePage = () => {
  // Global player state - now using centralized chicken selection
  const { 
    itemToUse, 
    setItemToUse, 
    removeItem, 
    myChickens, 
    setMyChickens,
    selectChicken
  } = usePlayer();
  
  // State for target selection mode
  const [isTargetSelectionMode, setIsTargetSelectionMode] = useState(false);

  // Check for target selection mode on mount and when itemToUse changes
  useEffect(() => {
    if (itemToUse) {
      setIsTargetSelectionMode(true);
    } else {
      setIsTargetSelectionMode(false);
    }
  }, [itemToUse]);

  // Fullness decay timer - chickens get hungry over time
  useEffect(() => {
    const hungerTimer = setInterval(() => {
      setMyChickens(prevChickens => 
        prevChickens.map(chicken => ({
          ...chicken,
          fullness: Math.max(0, (chicken.fullness || 85) - 1) // Decrease by 1 every minute
        }))
      );
    }, 60000); // Every 60 seconds (1 minute)

    return () => clearInterval(hungerTimer);
  }, [setMyChickens]);

  // Handler for when a chicken card is clicked
  const handleChickenClick = (chicken) => {
    if (isTargetSelectionMode && itemToUse) {
      // Apply item effect to chicken
      console.log(`Using ${itemToUse.itemName} on ${chicken.name}`);
      
      // Remove item from inventory
      removeItem(itemToUse.itemId, itemToUse.quantity);
      
      // Clear target selection mode
      setItemToUse(null);
      
      // TODO: Apply actual item effects to chicken here
      // This would depend on the item blueprint's onUse function
      
      return;
    }
    
    // Use global chicken selection system
    console.log('Selected chicken:', chicken.name);
    selectChicken(chicken.id);
  };

  // Cancel target selection mode
  const cancelTargetSelection = () => {
    setItemToUse(null);
  };

  return (
    <>
      {/* Target Selection Mode Header */}
      {isTargetSelectionMode && itemToUse && (
        <div className="target-selection-header">
          <div className="target-selection-content">
            <h2 className="target-selection-title">
              Select a chicken to use <strong>{itemToUse.itemName}</strong> on
            </h2>
            <button 
              className="cancel-selection-btn"
              onClick={cancelTargetSelection}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Quick Access Feature Cards Section */}
      <FeatureCardsContainer />

      {/* My Chickens Grid Section */}
      <ChickenGrid onChickenClick={handleChickenClick} />

      {/* ChickenDetails Modal now handled globally in App.jsx */}
    </>
  );
};

export default HomePage; 