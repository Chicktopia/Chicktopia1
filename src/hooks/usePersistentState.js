import { useState, useEffect, useRef } from 'react';
import { createChickenInstance } from '../gameData/chickenBlueprints';

/**
 * Custom hook for persistent state management using localStorage
 * Automatically saves state changes to localStorage and loads on initialization
 * @param {string} key - localStorage key to use for persistence
 * @param {*} initialValue - Default value if no saved data exists
 * @returns {Array} [state, setState] - Same as useState but with persistence
 */
const usePersistentState = (key, initialValue) => {
  // Use ref to track if we've loaded initial data to prevent unnecessary saves
  const hasLoadedInitialData = useRef(false);
  
  // Initialize state with saved data or default value
  const [state, setState] = useState(() => {
    try {
      const savedData = localStorage.getItem(key);
      if (savedData !== null) {
        hasLoadedInitialData.current = true;
        return JSON.parse(savedData);
      }
    } catch (error) {
      console.warn(`Error loading saved data for key "${key}":`, error);
    }
    return initialValue;
  });

  // Save to localStorage whenever state changes (but not on initial load)
  useEffect(() => {
    if (hasLoadedInitialData.current) {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (error) {
        console.warn(`Error saving data for key "${key}":`, error);
      }
    } else {
      // Mark that we've loaded initial data
      hasLoadedInitialData.current = true;
    }
  }, [key, state]);

  return [state, setState];
};

/**
 * Hook specifically for Chicktopia game state management
 * Manages all game state in a single localStorage entry
 * @returns {Object} Game state and setter functions
 */
export const useGameState = () => {
  // Initial game state structure - FINAL SETUP for new players
  const initialGameState = {
    // ADJUSTED: Only slot 1 unlocked, others locked with steeper progression costs
    slots: [
      { id: 1, status: 'empty' }, // Only this slot is unlocked for new players
      { id: 2, status: 'locked', unlockCost: 2000 },
      { id: 3, status: 'locked', unlockCost: 5000 },
      { id: 4, status: 'locked', unlockCost: 12000 },
      { id: 5, status: 'locked', unlockCost: 25000 },
      { id: 6, status: 'locked', unlockCost: 50000 }
    ],
    // DEFINED: Starting egg inventory - 4 specific eggs of different rarities
    myEggs: [
      { id: 'starter_egg_1', blueprintId: 'common_egg_01' },
      { id: 'starter_egg_2', blueprintId: 'common_egg_01' },
      { id: 'starter_egg_3', blueprintId: 'forest_egg_01' }, // Uncommon
      { id: 'starter_egg_4', blueprintId: 'crystal_egg_01' } // Rare
    ],
    // DEFINED: Starting chicken collection - one adult Level 5 and two juvenile Level 1 chickens
    myChickens: [
      {
        ...createChickenInstance('yellow_chick_01', 5), // Level 5 Adult
        id: 'starter_chicken_sunny', // Fixed ID for consistency
        nickname: 'Goldie', // Personal nickname (different from species name)
        stage: 'adult' // Ensure it's marked as adult
      },
      {
        ...createChickenInstance('brown_chick_01', 1), // Level 1 Juvenile
        id: 'starter_chicken_cocoa', // Fixed ID for consistency
        nickname: 'Brownie', // Personal nickname (different from species name)
        stage: 'juvenile' // Ensure it's marked as juvenile
      },
      {
        ...createChickenInstance('forest_chick_01', 1), // Level 1 Juvenile
        id: 'starter_chicken_willow', // Fixed ID for consistency
        nickname: 'Forest', // Personal nickname (different from species name)
        stage: 'juvenile' // Ensure it's marked as juvenile
      }
    ],
    // Hatchery enhancements state
    enhancements: {
      warmthLamp: {
        level: 0,
        cost: 100,
        maxLevel: 10
      },
      blessingTotem: {
        level: 0,
        cost: 150,
        maxLevel: 10
      }
    },
    // NEW: Inventory system for items
    inventory: {
      // Starting items for testing
      'chicken_feed_01': { quantity: 5, isLocked: false },
      'power_nut_01': { quantity: 3, isLocked: false },
      'joyful_berry_01': { quantity: 2, isLocked: false },
      'mystic_dust_01': { quantity: 10, isLocked: false },
      'crystal_shard_01': { quantity: 2, isLocked: true } // Example locked item
    },
    backpackCapacity: 50, // Maximum inventory slots
    itemToUse: null, // Item being used in target selection mode
    chickCoin: 2500, // Starting currency
    selectedEggId: null,
    selectedChickenId: null, // NEW: For centralized chicken details modal
    lastSaved: Date.now(),
    
    // NEW: Gacha system state
    gachaTickets: 25, // Starting gacha tickets
    pullHistory: [], // Array of pull history entries
    pityCounters: { // Pity counters for each pool
      beginners_luck: 0,
      gemstone_hoard: 0
    },

    // NEW: Coop system state
    coop: {
      // Nest configurations - 2 unlocked by default, up to 6 total
      nests: [
        { id: 1, status: 'empty', assignedChickenId: null, level: 1, unlocked: true },
        { id: 2, status: 'empty', assignedChickenId: null, level: 1, unlocked: true },
        { id: 3, status: 'locked', assignedChickenId: null, level: 1, unlocked: false, unlockCost: 5000 },
        { id: 4, status: 'locked', assignedChickenId: null, level: 1, unlocked: false, unlockCost: 12000 },
        { id: 5, status: 'locked', assignedChickenId: null, level: 1, unlocked: false, unlockCost: 25000 },
        { id: 6, status: 'locked', assignedChickenId: null, level: 1, unlocked: false, unlockCost: 50000 }
      ],
      // Environment setting - affects all nests
      environment: 'standard', // 'standard', 'enriched', 'mystic'
      // Active production timers (tracked separately for performance)
      activeProductions: {} // { nestId: { startTime, duration, chickenId } }
    }
  };

  const [gameState, setGameState] = usePersistentState('chicktopia-savegame', initialGameState);

  // Individual setter functions for clean component APIs
  const setSlots = (newSlots) => {
    setGameState(prev => ({
      ...prev,
      slots: typeof newSlots === 'function' ? newSlots(prev.slots) : newSlots,
      lastSaved: Date.now()
    }));
  };

  const setMyEggs = (newEggs) => {
    setGameState(prev => ({
      ...prev,
      myEggs: typeof newEggs === 'function' ? newEggs(prev.myEggs) : newEggs,
      lastSaved: Date.now()
    }));
  };

  const setChickCoin = (newAmount) => {
    setGameState(prev => ({
      ...prev,
      chickCoin: typeof newAmount === 'function' ? newAmount(prev.chickCoin) : newAmount,
      lastSaved: Date.now()
    }));
  };

  const setSelectedEggId = (newId) => {
    setGameState(prev => ({
      ...prev,
      selectedEggId: newId,
      lastSaved: Date.now()
    }));
  };

  // NEW: Setter for selected chicken (centralized chicken details modal)
  const setSelectedChickenId = (newId) => {
    setGameState(prev => ({
      ...prev,
      selectedChickenId: newId,
      lastSaved: Date.now()
    }));
  };

  // NEW: Setter for chicken collection
  const setMyChickens = (newChickens) => {
    setGameState(prev => ({
      ...prev,
      myChickens: typeof newChickens === 'function' ? newChickens(prev.myChickens) : newChickens,
      lastSaved: Date.now()
    }));
  };

  // NEW: Setter for enhancements
  const setEnhancements = (newEnhancements) => {
    setGameState(prev => ({
      ...prev,
      enhancements: typeof newEnhancements === 'function' ? newEnhancements(prev.enhancements) : newEnhancements,
      lastSaved: Date.now()
    }));
  };

  // NEW: Setter for inventory
  const setInventory = (newInventory) => {
    setGameState(prev => ({
      ...prev,
      inventory: typeof newInventory === 'function' ? newInventory(prev.inventory) : newInventory,
      lastSaved: Date.now()
    }));
  };

  // NEW: Setter for itemToUse (target selection mode)
  const setItemToUse = (newItemToUse) => {
    setGameState(prev => ({
      ...prev,
      itemToUse: newItemToUse,
      lastSaved: Date.now()
    }));
  };

  // NEW: Setter for backpack capacity
  const setBackpackCapacity = (newCapacity) => {
    setGameState(prev => ({
      ...prev,
      backpackCapacity: typeof newCapacity === 'function' ? newCapacity(prev.backpackCapacity) : newCapacity,
      lastSaved: Date.now()
    }));
  };

  // NEW: Setter for gacha tickets
  const setGachaTickets = (newTickets) => {
    setGameState(prev => ({
      ...prev,
      gachaTickets: typeof newTickets === 'function' ? newTickets(prev.gachaTickets) : newTickets,
      lastSaved: Date.now()
    }));
  };

  // NEW: Setter for pull history
  const setPullHistory = (newHistory) => {
    setGameState(prev => ({
      ...prev,
      pullHistory: typeof newHistory === 'function' ? newHistory(prev.pullHistory) : newHistory,
      lastSaved: Date.now()
    }));
  };

  // NEW: Setter for pity counters
  const setPityCounters = (newCounters) => {
    setGameState(prev => ({
      ...prev,
      pityCounters: typeof newCounters === 'function' ? newCounters(prev.pityCounters) : newCounters,
      lastSaved: Date.now()
    }));
  };

  // NEW: Setter for coop state
  const setCoop = (newCoop) => {
    setGameState(prev => ({
      ...prev,
      coop: typeof newCoop === 'function' ? newCoop(prev.coop) : newCoop,
      lastSaved: Date.now()
    }));
  };

  // Reset game to initial state
  const resetGame = () => {
    setGameState({
      ...initialGameState,
      lastSaved: Date.now()
    });
  };

  return {
    // Game state values
    slots: gameState.slots,
    myEggs: gameState.myEggs,
    myChickens: gameState.myChickens,
    enhancements: gameState.enhancements,
    inventory: gameState.inventory,
    backpackCapacity: gameState.backpackCapacity,
    itemToUse: gameState.itemToUse,
    chickCoin: gameState.chickCoin,
    selectedEggId: gameState.selectedEggId,
    selectedChickenId: gameState.selectedChickenId,
    lastSaved: gameState.lastSaved,
    
    // NEW: Gacha system state
    gachaTickets: gameState.gachaTickets,
    pullHistory: gameState.pullHistory,
    pityCounters: gameState.pityCounters,
    
    // NEW: Coop system state
    coop: gameState.coop,
    
    // Setter functions
    setSlots,
    setMyEggs,
    setMyChickens,
    setEnhancements,
    setInventory,
    setChickCoin,
    setSelectedEggId,
    setSelectedChickenId,
    setItemToUse,
    setBackpackCapacity,
    setGachaTickets,
    setPullHistory,
    setPityCounters,
    setCoop,
    resetGame
  };
};

export default usePersistentState; 