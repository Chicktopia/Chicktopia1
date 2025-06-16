/**
 * Egg Blueprints Database
 * Defines all types of eggs available in Chicktopia with their properties and possible outcomes
 */

export const EGG_BLUEPRINTS = {
  // COMMON EGGS (Most frequent, basic chickens)
  common_egg_01: {
    id: 'common_egg_01',
    name: 'Common Egg',
    rarity: 'COMMON',
    description: 'A simple, everyday egg. Nothing special, but reliable.',
    hatchTime: 120000, // 2 minutes in milliseconds
    art: '🥚', // Simple white egg
    baseValue: 10, // ChickCoin value
    gachaWeight: 1000, // High weight = more common in gacha
    possibleChickens: [
      { blueprintId: 'yellow_chick_01', weight: 70 }, // 70% chance
      { blueprintId: 'brown_chick_01', weight: 30 }   // 30% chance
    ],
    fusionResult: 'forest_egg_01' // 3 common eggs → 1 forest egg
  },

  // UNCOMMON EGGS (Moderate rarity, better chickens)
  forest_egg_01: {
    id: 'forest_egg_01',
    name: 'Forest Egg',
    rarity: 'UNCOMMON',
    description: 'An egg found deep in the forest, touched by nature magic.',
    hatchTime: 180000, // 3 minutes
    art: '🌿', // Forest/nature themed
    baseValue: 50,
    gachaWeight: 400, // Moderate weight for uncommon rarity
    possibleChickens: [
      { blueprintId: 'forest_chick_01', weight: 60 }, // 60% chance
      { blueprintId: 'yellow_chick_01', weight: 25 }, // 25% chance (upgraded common)
      { blueprintId: 'brown_chick_01', weight: 15 }   // 15% chance (upgraded common)
    ],
    fusionResult: 'crystal_egg_01' // 3 forest eggs → 1 crystal egg
  },

  // RARE EGGS (High rarity, special chickens)
  crystal_egg_01: {
    id: 'crystal_egg_01',
    name: 'Crystal Egg',
    rarity: 'RARE',
    description: 'A crystalline egg that sparkles with inner light. Very precious.',
    hatchTime: 300000, // 5 minutes
    art: '💎', // Crystal/gem themed
    baseValue: 200,
    gachaWeight: 200, // Low weight for rare rarity
    possibleChickens: [
      { blueprintId: 'crystal_chick_01', weight: 50 }, // 50% chance
      { blueprintId: 'forest_chick_01', weight: 30 },  // 30% chance (upgraded uncommon)
      { blueprintId: 'golden_chick_01', weight: 20 }   // 20% chance (special rare)
    ],
    fusionResult: 'dragon_egg_01' // 3 crystal eggs → 1 dragon egg
  },

  // EPIC EGGS (Extremely rare, legendary chickens)
  dragon_egg_01: {
    id: 'dragon_egg_01',
    name: 'Dragon Egg',
    rarity: 'EPIC',
    description: 'A legendary egg said to contain the essence of ancient dragons.',
    hatchTime: 600000, // 10 minutes
    art: '🔥', // Fire/dragon themed
    baseValue: 1000,
    gachaWeight: 50, // Very low weight for epic rarity
    possibleChickens: [
      { blueprintId: 'dragon_chick_01', weight: 80 }, // 80% chance
      { blueprintId: 'golden_chick_01', weight: 20 }  // 20% chance (upgraded rare)
    ],
    fusionResult: null // Cannot be fused further (max tier)
  },

  // SPECIAL EVENT EGGS (Limited time, unique properties)
  ocean_egg_01: {
    id: 'ocean_egg_01',
    name: 'Ocean Egg',
    rarity: 'RARE',
    description: 'A mysterious egg from the depths of the ocean.',
    hatchTime: 240000, // 4 minutes
    art: '🌊', // Ocean/water themed
    baseValue: 150,
    gachaWeight: 180, // Slightly higher than crystal for variety
    possibleChickens: [
      { blueprintId: 'ocean_chick_01', weight: 70 }, // 70% chance
      { blueprintId: 'crystal_chick_01', weight: 30 } // 30% chance
    ],
    fusionResult: 'crystal_egg_01' // 3 ocean eggs → 1 crystal egg
  },

  // LEGENDARY EGGS (Ultra rare, mythical chickens)
  legendary_egg_01: {
    id: 'legendary_egg_01',
    name: 'Legendary Egg',
    rarity: 'LEGENDARY',
    description: 'A mythical egg that radiates pure power. Legends speak of its incredible potential.',
    hatchTime: 900000, // 15 minutes
    art: '✨', // Sparkle/legendary themed
    baseValue: 5000,
    gachaWeight: 10, // Extremely low weight for legendary rarity
    possibleChickens: [
      { blueprintId: 'legendary_chick_01', weight: 90 }, // 90% chance
      { blueprintId: 'dragon_chick_01', weight: 10 }     // 10% chance (upgraded epic)
    ],
    fusionResult: null // Cannot be fused further (ultimate tier)
  }
};

/**
 * Rarity Configuration
 * Defines the properties and styling for each rarity tier
 */
export const RARITY_CONFIG = {
  COMMON: {
    name: 'Common',
    color: '#8B7D6B', // Clay brown
    bgColor: 'rgba(139, 125, 107, 0.1)',
    dropRate: 60, // 60% base drop rate
    sellMultiplier: 1.0
  },
  UNCOMMON: {
    name: 'Uncommon',
    color: '#228B22', // Forest green
    bgColor: 'rgba(34, 139, 34, 0.1)',
    dropRate: 25, // 25% base drop rate
    sellMultiplier: 1.5
  },
  RARE: {
    name: 'Rare',
    color: '#4169E1', // Royal blue
    bgColor: 'rgba(65, 105, 225, 0.1)',
    dropRate: 12, // 12% base drop rate
    sellMultiplier: 3.0
  },
  EPIC: {
    name: 'Epic',
    color: '#8A2BE2', // Blue violet
    bgColor: 'rgba(138, 43, 226, 0.1)',
    dropRate: 3, // 3% base drop rate
    sellMultiplier: 10.0
  },
  LEGENDARY: {
    name: 'Legendary',
    color: '#FFD700', // Gold
    bgColor: 'rgba(255, 215, 0, 0.1)',
    dropRate: 0.5, // 0.5% base drop rate
    sellMultiplier: 50.0
  }
};

/**
 * Helper Functions for Egg Blueprints
 */

// Get egg blueprint by ID
export const getEggBlueprint = (blueprintId) => {
  return EGG_BLUEPRINTS[blueprintId] || null;
};

// Get all eggs of a specific rarity
export const getEggsByRarity = (rarity) => {
  return Object.values(EGG_BLUEPRINTS).filter(egg => egg.rarity === rarity);
};

// Calculate egg value with rarity multiplier
export const calculateEggValue = (blueprintId) => {
  const blueprint = getEggBlueprint(blueprintId);
  if (!blueprint) return 0;
  
  const rarityConfig = RARITY_CONFIG[blueprint.rarity];
  return Math.floor(blueprint.baseValue * rarityConfig.sellMultiplier);
};

// Get random chicken from egg's possible outcomes
export const rollChickenFromEgg = (blueprintId) => {
  const blueprint = getEggBlueprint(blueprintId);
  if (!blueprint || !blueprint.possibleChickens) return null;
  
  // Calculate total weight
  const totalWeight = blueprint.possibleChickens.reduce((sum, chicken) => sum + chicken.weight, 0);
  
  // Roll random number
  let roll = Math.random() * totalWeight;
  
  // Find which chicken was rolled
  for (const chicken of blueprint.possibleChickens) {
    roll -= chicken.weight;
    if (roll <= 0) {
      return chicken.blueprintId;
    }
  }
  
  // Fallback to first chicken if something goes wrong
  return blueprint.possibleChickens[0].blueprintId;
};

// Check if eggs can be fused (3 identical eggs)
export const canFuseEggs = (eggInstances) => {
  if (eggInstances.length !== 3) return false;
  
  const firstBlueprintId = eggInstances[0].blueprintId;
  const allSame = eggInstances.every(egg => egg.blueprintId === firstBlueprintId);
  
  if (!allSame) return false;
  
  const blueprint = getEggBlueprint(firstBlueprintId);
  return blueprint && blueprint.fusionResult !== null;
};

// Get fusion result for 3 identical eggs
export const getFusionResult = (blueprintId) => {
  const blueprint = getEggBlueprint(blueprintId);
  return blueprint ? blueprint.fusionResult : null;
};

export default EGG_BLUEPRINTS; 