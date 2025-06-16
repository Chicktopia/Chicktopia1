import React, { useState } from 'react';
import './DevTool.css';
import { usePlayer } from '../context/PlayerContext.jsx';

/**
 * DevTool Component - Floating developer tool for testing game mechanics
 * Provides quick access to add currency and reset game state
 * Fixed to bottom-right corner with expandable interface
 */
const DevTool = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { addChickCoin, setMyEggs, setMyChickens, coop, setCoop } = usePlayer();

  // Toggle expanded state
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Add 1000 ChickCoin to player balance
  const handleAddCurrency = () => {
    addChickCoin(1000);
    console.log('DevTool: Added 1000 ChickCoin');
  };

  // Add test eggs for easier testing
  const handleAddTestEggs = () => {
    const testEggs = [
      { id: `test_egg_${Date.now()}_1`, blueprintId: 'common_egg_01' },
      { id: `test_egg_${Date.now()}_2`, blueprintId: 'forest_egg_01' },
      { id: `test_egg_${Date.now()}_3`, blueprintId: 'crystal_egg_01' }
    ];
    setMyEggs(prev => [...prev, ...testEggs]);
    console.log('DevTool: Added 3 test eggs');
  };

  // Speed up all production timers - instantly complete working nests
  const handleSpeedUpProduction = () => {
    if (!coop?.nests) {
      console.log('DevTool: No coop data found');
      return;
    }

    let completedCount = 0;
    
    setCoop(prev => ({
      ...prev,
      nests: prev.nests.map(nest => {
        if (nest.status === 'working' && nest.assignedChickenId) {
          completedCount++;
          return {
            ...nest,
            status: 'ready' // Instantly complete the production
          };
        }
        return nest;
      }),
      // Clear active production timers since they're now complete
      activeProductions: {}
    }));

    console.log(`DevTool: Instantly completed ${completedCount} working nests`);
  };

  // Update existing chickens with new stat system
  const handleUpgradeChickens = () => {
    setMyChickens(prev => prev.map(chicken => {
      // Add missing fields if they don't exist
      const updatedChicken = {
        ...chicken,
        xp: chicken.xp || 0,
        xp_to_next_level: chicken.xp_to_next_level || (chicken.level * 100),
        happiness: Math.min(100, chicken.happiness || 80), // Ensure capped at 100
        health: chicken.health || 100, // Add health field
        fullness: chicken.fullness || 85, // Add fullness field
        max_happiness: chicken.max_happiness || 100, // Add max_happiness field
        current_stats: chicken.current_stats || {
          str: 15 + (chicken.level - 1) * 2, // Updated base stats
          agi: 18 + (chicken.level - 1) * 2,
          sta: 12 + (chicken.level - 1) * 2
        }
      };
      return updatedChicken;
    }));
    console.log('DevTool: Upgraded all chickens with new stat system');
  };

  // Reset game by clearing localStorage and reloading page
  const handleResetGame = () => {
    if (window.confirm('Are you sure you want to reset the game? This will clear all progress!')) {
      localStorage.removeItem('chicktopia-savegame');
      window.location.reload();
    }
  };

  return (
    <div className="dev-tool">
      {/* Main toggle button */}
      <button 
        className={`dev-tool-toggle ${isExpanded ? 'expanded' : ''}`}
        onClick={toggleExpanded}
        title="Developer Tools"
      >
        ⚙️
      </button>

      {/* Expanded options panel */}
      {isExpanded && (
        <div className="dev-tool-panel">
          <h3 className="dev-tool-title">Dev Tools</h3>
          
          <button 
            className="dev-tool-button"
            onClick={handleAddCurrency}
            title="Add 1000 ChickCoin"
          >
            💰 Add Coins
          </button>
          
          <button 
            className="dev-tool-button"
            onClick={handleAddTestEggs}
            title="Add 3 test eggs to inventory"
          >
            🥚 Add Eggs
          </button>

          <button 
            className="dev-tool-button"
            onClick={handleSpeedUpProduction}
            title="Instantly complete all working nest productions"
          >
            ⚡ Speed Up Production
          </button>
          
          <button 
            className="dev-tool-button"
            onClick={handleUpgradeChickens}
            title="Upgrade existing chickens with new stat system"
          >
            ⬆️ Upgrade Chickens
          </button>
          
          <button 
            className="dev-tool-button danger"
            onClick={handleResetGame}
            title="Reset game completely"
          >
            🔄 Reset Game
          </button>
        </div>
      )}
    </div>
  );
};

export default DevTool; 