import React, { createContext, useContext, useState } from 'react';
import { useGameState } from '../hooks/usePersistentState';
import { rollChickenFromEgg, getEggBlueprint } from '../gameData/eggBlueprints';
import { createChickenInstance } from '../gameData/chickenBlueprints';

/**
 * PlayerContext - Global state management for player data
 * Provides currency, inventory, and other player stats across the entire application
 */
const PlayerContext = createContext();

/**
 * PlayerProvider Component - Wraps the app to provide global player state
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components
 */
export const PlayerProvider = ({ children }) => {
  // Use the persistent game state hook as the source of truth
  const gameState = useGameState();
  
  // Extract currency-specific functions for easier access
  const updateChickCoin = (amount) => {
    if (typeof amount === 'function') {
      gameState.setChickCoin(amount);
    } else {
      gameState.setChickCoin(amount);
    }
  };

  // Spend currency with validation
  const spendChickCoin = (amount) => {
    if (gameState.chickCoin >= amount) {
      gameState.setChickCoin(prev => prev - amount);
      return true; // Success
    }
    return false; // Insufficient funds
  };

  // Add currency (for rewards, purchases, etc.)
  const addChickCoin = (amount) => {
    gameState.setChickCoin(prev => prev + amount);
  };

  // Inventory management functions
  const addItem = (itemId, quantity = 1) => {
    gameState.setInventory(prev => ({
      ...prev,
      [itemId]: {
        quantity: (prev[itemId]?.quantity || 0) + quantity,
        isLocked: prev[itemId]?.isLocked || false
      }
    }));
  };

  const removeItem = (itemId, quantity = 1) => {
    gameState.setInventory(prev => {
      const currentQuantity = prev[itemId]?.quantity || 0;
      const newQuantity = Math.max(0, currentQuantity - quantity);
      
      if (newQuantity === 0) {
        // Remove item completely if quantity reaches 0
        const { [itemId]: _removed, ...rest } = prev;
        return rest;
      } else {
        // Update quantity
        return {
          ...prev,
          [itemId]: {
            ...prev[itemId],
            quantity: newQuantity
          }
        };
      }
    });
  };

  const toggleItemLock = (itemId) => {
    gameState.setInventory(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        isLocked: !prev[itemId]?.isLocked
      }
    }));
  };

  // Egg management functions (for backpack integration)
  const addEgg = (blueprintId) => {
    const newEgg = {
      id: `egg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      blueprintId: blueprintId
    };
    gameState.setMyEggs(prev => [...prev, newEgg]);
    return newEgg;
  };

  const removeEgg = (eggId) => {
    gameState.setMyEggs(prev => prev.filter(egg => egg.id !== eggId));
  };

  // Backpack capacity upgrade function
  const upgradeBackpackCapacity = () => {
    const currentCapacity = gameState.backpackCapacity;
    const upgradeCost = Math.floor(currentCapacity * 30); // Progressive cost: 50*30=1500, 60*30=1800, etc.
    
    if (spendChickCoin(upgradeCost)) {
      gameState.setBackpackCapacity(prev => prev + 10);
      return true; // Success
    }
    return false; // Insufficient funds
  };

  // Get backpack upgrade cost
  const getBackpackUpgradeCost = () => {
    return Math.floor(gameState.backpackCapacity * 30);
  };

  // NEW: Gacha ticket management functions
  const addGachaTickets = (amount) => {
    gameState.setGachaTickets(prev => prev + amount);
  };

  const spendGachaTickets = (amount) => {
    if (gameState.gachaTickets >= amount) {
      gameState.setGachaTickets(prev => prev - amount);
      return true; // Success
    }
    return false; // Insufficient tickets
  };

  // NEW: Add pull history entry
  const addPullHistoryEntry = (entry) => {
    gameState.setPullHistory(prev => [entry, ...prev]); // Add to beginning for newest first
  };

  // NEW: Update pity counter for a specific pool
  const updatePityCounter = (poolId, newValue) => {
    gameState.setPityCounters(prev => ({
      ...prev,
      [poolId]: newValue
    }));
  };

  // NEW: Centralized chicken selection for details modal
  const selectChicken = (chickenId) => {
    gameState.setSelectedChickenId(chickenId);
  };

  const deselectChicken = () => {
    gameState.setSelectedChickenId(null);
  };

  // NEW: Welcome modal state management (separate from persistent game state)
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [isWelcomeModalReopened, setIsWelcomeModalReopened] = useState(false);

  // NEW: Global modal state for background transparency effect
  const [isModalActive, setIsModalActive] = useState(false);

  const openWelcomeModal = (isReopened = false) => {
    setIsWelcomeModalOpen(true);
    setIsWelcomeModalReopened(isReopened);
    setIsModalActive(true); // Set global modal state
  };

  const closeWelcomeModal = () => {
    setIsWelcomeModalOpen(false);
    setIsWelcomeModalReopened(false);
    setIsModalActive(false); // Clear global modal state
  };

  // General modal state management functions for any modal
  const setModalActive = (active) => {
    setIsModalActive(active);
  };

  // NEW: Centralized function to start a new game
  const startNewGame = () => {
    // Reset the game state to initial values (this triggers localStorage save automatically)
    gameState.resetGame();
    
    // Close the welcome modal
    closeWelcomeModal();
    
    console.log('New game started successfully!');
  };

  // Context value with all player data and functions
  const contextValue = {
    // Player stats
    chickCoin: gameState.chickCoin,
    
    // Game state (for modules that need full access)
    slots: gameState.slots,
    myEggs: gameState.myEggs,
    myChickens: gameState.myChickens,
    enhancements: gameState.enhancements,
    inventory: gameState.inventory,
    backpackCapacity: gameState.backpackCapacity,
    selectedEggId: gameState.selectedEggId,
    selectedChickenId: gameState.selectedChickenId,
    lastSaved: gameState.lastSaved,
    itemToUse: gameState.itemToUse, // For target selection mode
    
    // NEW: Gacha system state
    gachaTickets: gameState.gachaTickets,
    pullHistory: gameState.pullHistory,
    pityCounters: gameState.pityCounters,
    
    // NEW: Coop system state
    coop: gameState.coop,
    
    // State setters
    setSlots: gameState.setSlots,
    setMyEggs: gameState.setMyEggs,
    setMyChickens: gameState.setMyChickens,
    setEnhancements: gameState.setEnhancements,
    setInventory: gameState.setInventory,
    setSelectedEggId: gameState.setSelectedEggId,
    setChickCoin: gameState.setChickCoin,
    setItemToUse: gameState.setItemToUse,
    setCoop: gameState.setCoop,
    resetGame: gameState.resetGame,
    
    // Currency helper functions
    updateChickCoin,
    spendChickCoin,
    addChickCoin,
    
    // Inventory management functions
    addItem,
    removeItem,
    toggleItemLock,
    addEgg,
    removeEgg,
    
    // Backpack functions
    upgradeBackpackCapacity,
    getBackpackUpgradeCost,
    
    // Blueprint system functions
    rollChickenFromEgg,
    getEggBlueprint,
    createChickenInstance,

    // NEW: Gacha ticket management functions
    addGachaTickets,
    spendGachaTickets,

    // NEW: Add pull history entry
    addPullHistoryEntry,

    // NEW: Update pity counter for a specific pool
    updatePityCounter,

    // NEW: Centralized chicken selection functions
    selectChicken,
    deselectChicken,

    // NEW: Welcome modal state management
    isWelcomeModalOpen,
    isWelcomeModalReopened,
    openWelcomeModal,
    closeWelcomeModal,

    // NEW: Global modal state management for background transparency
    isModalActive,
    setModalActive,

    // NEW: Centralized game initialization
    startNewGame,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {children}
    </PlayerContext.Provider>
  );
};

/**
 * Custom hook to use PlayerContext
 * @returns {Object} Player context value
 */
export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};

export default PlayerContext; 