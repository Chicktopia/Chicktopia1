/**
 * Gacha System - Core logic for Wonder Gacha
 * Handles weighted random selection, pity system, and pull history
 */

import { EGG_BLUEPRINTS, RARITY_CONFIG } from './eggBlueprints';

/**
 * Gacha Pool Configurations
 * Each pool has different eggs and weights
 */
export const GACHA_POOLS = {
  beginners_luck: {
    id: 'beginners_luck',
    name: "Beginner's Luck",
    description: 'A balanced pool perfect for new players',
    bannerText: "Beginner's Luck Poster",
    eggs: ['common_egg_01', 'forest_egg_01', 'crystal_egg_01', 'dragon_egg_01']
  },
  gemstone_hoard: {
    id: 'gemstone_hoard',
    name: 'Gemstone Hoard',
    description: 'Premium pool with higher rare rates',
    bannerText: 'Gemstone Hoard Poster',
    eggs: ['forest_egg_01', 'crystal_egg_01', 'ocean_egg_01', 'dragon_egg_01', 'legendary_egg_01']
  }
};

/**
 * Calculate total weight for a gacha pool
 * @param {string} poolId - ID of the gacha pool
 * @returns {number} Total weight of all eggs in the pool
 */
export const calculatePoolTotalWeight = (poolId) => {
  const pool = GACHA_POOLS[poolId];
  if (!pool) return 0;
  
  return pool.eggs.reduce((total, eggId) => {
    const blueprint = EGG_BLUEPRINTS[eggId];
    return total + (blueprint?.gachaWeight || 0);
  }, 0);
};

/**
 * Calculate drop rates for a gacha pool
 * @param {string} poolId - ID of the gacha pool
 * @returns {Object} Object with egg IDs as keys and drop rates as values
 */
export const calculateDropRates = (poolId) => {
  const pool = GACHA_POOLS[poolId];
  if (!pool) return {};
  
  const totalWeight = calculatePoolTotalWeight(poolId);
  const dropRates = {};
  
  pool.eggs.forEach(eggId => {
    const blueprint = EGG_BLUEPRINTS[eggId];
    if (blueprint) {
      dropRates[eggId] = {
        rate: ((blueprint.gachaWeight / totalWeight) * 100).toFixed(2),
        rarity: blueprint.rarity,
        name: blueprint.name
      };
    }
  });
  
  return dropRates;
};

/**
 * Perform a single gacha roll
 * @param {string} poolId - ID of the gacha pool
 * @returns {string|null} ID of the rolled egg, or null if error
 */
export const performSingleRoll = (poolId) => {
  const pool = GACHA_POOLS[poolId];
  if (!pool) return null;
  
  const totalWeight = calculatePoolTotalWeight(poolId);
  let roll = Math.random() * totalWeight;
  
  for (const eggId of pool.eggs) {
    const blueprint = EGG_BLUEPRINTS[eggId];
    if (!blueprint) continue;
    
    roll -= blueprint.gachaWeight;
    if (roll <= 0) {
      return eggId;
    }
  }
  
  // Fallback to first egg if something goes wrong
  return pool.eggs[0] || null;
};

/**
 * Check if an egg is RARE or higher rarity
 * @param {string} eggId - ID of the egg to check
 * @returns {boolean} True if RARE or higher
 */
export const isRareOrHigher = (eggId) => {
  const blueprint = EGG_BLUEPRINTS[eggId];
  if (!blueprint) return false;
  
  const rareRarities = ['RARE', 'EPIC', 'LEGENDARY'];
  return rareRarities.includes(blueprint.rarity);
};

/**
 * Get a guaranteed rare egg from the pool
 * @param {string} poolId - ID of the gacha pool
 * @returns {string|null} ID of a random rare+ egg from the pool
 */
export const getGuaranteedRareEgg = (poolId) => {
  const pool = GACHA_POOLS[poolId];
  if (!pool) return null;
  
  // Filter eggs that are RARE or higher
  const rareEggs = pool.eggs.filter(eggId => isRareOrHigher(eggId));
  
  if (rareEggs.length === 0) return null;
  
  // Randomly select one rare egg
  const randomIndex = Math.floor(Math.random() * rareEggs.length);
  return rareEggs[randomIndex];
};

/**
 * Perform a 10-pull with pity system
 * @param {string} poolId - ID of the gacha pool
 * @param {number} pityCounter - Current pity counter for this pool
 * @returns {Object} Result object with eggs array and new pity counter
 */
export const performTenPull = (poolId, pityCounter = 0) => {
  const results = [];
  let newPityCounter = pityCounter;
  let hasRareOrHigher = false;
  
  // Perform 10 individual rolls
  for (let i = 0; i < 10; i++) {
    const rolledEgg = performSingleRoll(poolId);
    if (rolledEgg) {
      results.push(rolledEgg);
      
      // Check if this roll is rare or higher
      if (isRareOrHigher(rolledEgg)) {
        hasRareOrHigher = true;
        newPityCounter = 0; // Reset pity counter
      }
    }
  }
  
  // Apply pity system if no rare was rolled
  if (!hasRareOrHigher && results.length > 0) {
    // Replace the first common/uncommon with a guaranteed rare
    const guaranteedRare = getGuaranteedRareEgg(poolId);
    if (guaranteedRare) {
      // Find first non-rare egg to replace
      const replaceIndex = results.findIndex(eggId => !isRareOrHigher(eggId));
      if (replaceIndex !== -1) {
        results[replaceIndex] = guaranteedRare;
        hasRareOrHigher = true;
        newPityCounter = 0;
      }
    }
  }
  
  // Increment pity counter if still no rare
  if (!hasRareOrHigher) {
    newPityCounter += 10;
  }
  
  return {
    eggs: results,
    pityCounter: newPityCounter,
    hadPityActivation: !hasRareOrHigher && results.some(eggId => isRareOrHigher(eggId))
  };
};

/**
 * Create a pull history entry
 * @param {string|Array} eggs - Single egg ID or array of egg IDs
 * @param {string} pullType - Type of pull ('single' or 'ten')
 * @param {string} poolId - ID of the gacha pool used
 * @returns {Object} Pull history entry
 */
export const createPullHistoryEntry = (eggs, pullType, poolId) => {
  const eggArray = Array.isArray(eggs) ? eggs : [eggs];
  
  return {
    id: Date.now() + Math.random(), // Unique ID
    timestamp: Date.now(),
    pullType,
    poolId,
    eggs: eggArray.map(eggId => {
      const blueprint = EGG_BLUEPRINTS[eggId];
      return {
        eggId,
        name: blueprint?.name || 'Unknown Egg',
        rarity: blueprint?.rarity || 'COMMON',
        art: blueprint?.art || '🥚'
      };
    }),
    totalEggs: eggArray.length
  };
};

/**
 * Get rarity color for UI display
 * @param {string} rarity - Rarity string
 * @returns {string} CSS color value
 */
export const getRarityColor = (rarity) => {
  const config = RARITY_CONFIG[rarity];
  return config?.color || '#8B7D6B';
};

/**
 * Get rarity glow color for animations
 * @param {string} rarity - Rarity string
 * @returns {string} CSS color value for glow effects
 */
export const getRarityGlowColor = (rarity) => {
  switch (rarity) {
    case 'COMMON': return '#FFFFFF';
    case 'UNCOMMON': return '#22C55E';
    case 'RARE': return '#3B82F6';
    case 'EPIC': return '#A855F7';
    case 'LEGENDARY': return '#FFD700';
    default: return '#FFFFFF';
  }
};

/**
 * Format timestamp for display
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted date string
 */
export const formatPullTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

export default {
  GACHA_POOLS,
  calculatePoolTotalWeight,
  calculateDropRates,
  performSingleRoll,
  performTenPull,
  createPullHistoryEntry,
  getRarityColor,
  getRarityGlowColor,
  formatPullTimestamp
}; 