/**
 * Chicken Blueprints Database
 * Defines all types of chickens available in Chicktopia with their stats, abilities, and evolution paths
 */

export const CHICKEN_BLUEPRINTS = {
  // COMMON CHICKENS (Basic starter chickens)
  yellow_chick_01: {
    id: 'yellow_chick_01',
    name: 'Sunfeather',
    rarity: 'COMMON',
    description: 'A cheerful yellow chick. The most common type, but still adorable!',
    art: {
      chick: '🐥', // Baby stage
      adult: '🐔', // Adult stage
      elder: '🐓'  // Elder stage (future expansion)
    },
    adult_at_level: 5, // New adulthood mechanic
    baseStats: {
      health: 100,
      attack: 15,
      defense: 10,
      speed: 20,
      happiness: 80,
      productivity: 25, // Eggs/coins per hour
      // Core stats for feeding system
      str: 5, // Base strength
      agi: 7, // Base agility  
      sta: 6  // Base stamina
    },
    stats_per_level: { str: 2, agi: 3, sta: 2 }, // Growth per level
    max_happiness: 100, // COMMON chickens have standard happiness cap
    growthRate: 1.0, // Normal growth speed
    baseValue: 50, // ChickCoin value when sold
    
    // Future expansion fields
    skills: [], // Special abilities (future)
    evolutionPath: {
      canEvolve: true,
      evolutionLevel: 10,
      evolvesInto: 'yellow_chicken_02' // Future evolution
    },
    traits: ['Friendly', 'Hardy'], // Personality traits
    preferredFood: ['seeds', 'corn'],
    specialAbilities: null, // Future: special powers
    breedingCompatibility: ['brown_chick_01', 'forest_chick_01']
  },

  brown_chick_01: {
    id: 'brown_chick_01',
    name: 'Earth-kin',
    rarity: 'COMMON',
    description: 'A sturdy brown chick with excellent defense capabilities.',
    art: {
      chick: '🐤', // Baby stage
      adult: '🐔', // Adult stage (brown variant)
      elder: '🦃'  // Elder stage (turkey-like)
    },
    adult_at_level: 5, // New adulthood mechanic
    baseStats: {
      health: 120,
      attack: 12,
      defense: 18,
      speed: 15,
      happiness: 75,
      productivity: 20,
      // Core stats for feeding system - Tanky common
      str: 4, // Lower base strength
      agi: 6, // Lower base agility
      sta: 8  // High base stamina (tanky)
    },
    stats_per_level: { str: 1, agi: 2, sta: 4 }, // Tanky growth
    max_happiness: 100, // COMMON chickens have standard happiness cap
    growthRate: 0.9, // Slightly slower growth
    baseValue: 60,
    
    // Future expansion fields
    skills: [],
    evolutionPath: {
      canEvolve: true,
      evolutionLevel: 12,
      evolvesInto: 'brown_chicken_02'
    },
    traits: ['Defensive', 'Loyal'],
    preferredFood: ['seeds', 'worms'],
    specialAbilities: null,
    breedingCompatibility: ['yellow_chick_01', 'forest_chick_01']
  },

  // UNCOMMON CHICKENS (Enhanced abilities)
  forest_chick_01: {
    id: 'forest_chick_01',
    name: 'Grove Tender',
    rarity: 'UNCOMMON',
    description: 'A mystical chick infused with forest magic. Produces special nature eggs.',
    art: {
      chick: '🌿', // Nature-themed baby
      adult: '🦜', // Colorful forest bird
      elder: '🦅'  // Majestic forest eagle
    },
    adult_at_level: 5, // New adulthood mechanic
    baseStats: {
      health: 140,
      attack: 20,
      defense: 15,
      speed: 25,
      happiness: 90,
      productivity: 35,
      // Core stats for feeding system - UNCOMMON power boost
      str: 7, // Higher base strength
      agi: 8, // Higher base agility
      sta: 8  // Good base stamina
    },
    stats_per_level: { str: 3, agi: 4, sta: 3 }, // Balanced magical growth
    max_happiness: 110, // UNCOMMON chickens have slightly higher happiness cap
    growthRate: 1.2, // Faster growth due to magic
    baseValue: 150,
    
    // Future expansion fields
    skills: ['Nature Magic', 'Herb Gathering'],
    evolutionPath: {
      canEvolve: true,
      evolutionLevel: 15,
      evolvesInto: 'forest_guardian_03'
    },
    traits: ['Magical', 'Wise', 'Nature-Loving'],
    preferredFood: ['berries', 'herbs', 'magical_seeds'],
    specialAbilities: {
      passiveBonus: 'Increases nearby chickens happiness by 10%',
      activeSkill: 'Forest Blessing - Boosts egg production for 1 hour'
    },
    breedingCompatibility: ['crystal_chick_01', 'ocean_chick_01']
  },

  // RARE CHICKENS (Powerful and unique)
  crystal_chick_01: {
    id: 'crystal_chick_01',
    name: 'Crystalline',
    rarity: 'RARE',
    description: 'A radiant chick with crystalline feathers that sparkle in the light.',
    art: {
      chick: '💎', // Crystal baby
      adult: '🦋', // Butterfly-like crystal bird
      elder: '🌟'  // Star-like crystal phoenix
    },
    adult_at_level: 5, // New adulthood mechanic
    baseStats: {
      health: 180,
      attack: 30,
      defense: 25,
      speed: 35,
      happiness: 95,
      productivity: 50,
      // Core stats for feeding system - RARE power
      str: 9, // Significantly higher base strength
      agi: 11, // Significantly higher base agility
      sta: 10  // High base stamina
    },
    stats_per_level: { str: 4, agi: 5, sta: 4 }, // Crystal power growth
    max_happiness: 120, // RARE chickens have higher happiness cap
    growthRate: 1.5, // Very fast growth
    baseValue: 400,
    
    // Future expansion fields
    skills: ['Crystal Magic', 'Light Manipulation', 'Gem Creation'],
    evolutionPath: {
      canEvolve: true,
      evolutionLevel: 20,
      evolvesInto: 'crystal_phoenix_04'
    },
    traits: ['Radiant', 'Intelligent', 'Precious'],
    preferredFood: ['crystal_shards', 'starlight_nectar', 'rare_gems'],
    specialAbilities: {
      passiveBonus: 'Produces rare crystal eggs worth 3x normal value',
      activeSkill: 'Crystal Resonance - Doubles all chickens productivity for 30 minutes'
    },
    breedingCompatibility: ['golden_chick_01', 'dragon_chick_01']
  },

  golden_chick_01: {
    id: 'golden_chick_01',
    name: 'Goldcrest',
    rarity: 'RARE',
    description: 'A legendary golden chick that brings prosperity and fortune.',
    art: {
      chick: '🐣', // Golden baby (special variant)
      adult: '🦚', // Golden peacock
      elder: '👑'  // Crown-wearing royal bird
    },
    adult_at_level: 5, // New adulthood mechanic
    baseStats: {
      health: 200,
      attack: 25,
      defense: 30,
      speed: 30,
      happiness: 100,
      productivity: 60,
      // Core stats for feeding system - RARE royal power
      str: 10, // High base strength
      agi: 9, // High base agility
      sta: 11  // Very high base stamina (royal endurance)
    },
    stats_per_level: { str: 3, agi: 3, sta: 5 }, // Royal strength growth
    max_happiness: 130, // RARE chickens have higher happiness cap
    growthRate: 1.3,
    baseValue: 500,
    
    // Future expansion fields
    skills: ['Fortune Magic', 'Wealth Generation', 'Royal Presence'],
    evolutionPath: {
      canEvolve: true,
      evolutionLevel: 25,
      evolvesInto: 'golden_emperor_05'
    },
    traits: ['Royal', 'Fortunate', 'Charismatic'],
    preferredFood: ['golden_grain', 'royal_jelly', 'diamond_dust'],
    specialAbilities: {
      passiveBonus: 'Generates 50 ChickCoin per hour automatically',
      activeSkill: 'Golden Touch - Converts all eggs to golden eggs for 1 hour'
    },
    breedingCompatibility: ['crystal_chick_01', 'dragon_chick_01']
  },

  // EPIC CHICKENS (Legendary tier)
  dragon_chick_01: {
    id: 'dragon_chick_01',
    name: 'Dragonheart',
    rarity: 'EPIC',
    description: 'A mythical dragon chick with immense power and ancient wisdom.',
    art: {
      chick: '🔥', // Fire baby dragon
      adult: '🐉', // Eastern dragon
      elder: '🐲'  // Western dragon
    },
    adult_at_level: 5, // New adulthood mechanic
    baseStats: {
      health: 300,
      attack: 50,
      defense: 40,
      speed: 45,
      happiness: 100,
      productivity: 80,
      // Core stats for feeding system - EPIC dragon power
      str: 14, // Legendary base strength
      agi: 12, // Legendary base agility
      sta: 14  // Legendary base stamina
    },
    stats_per_level: { str: 6, agi: 5, sta: 6 }, // Legendary dragon growth
    max_happiness: 150, // EPIC chickens have the highest happiness cap
    growthRate: 2.0, // Extremely fast growth
    baseValue: 2000,
    
    // Future expansion fields
    skills: ['Dragon Fire', 'Ancient Magic', 'Flight', 'Intimidation'],
    evolutionPath: {
      canEvolve: true,
      evolutionLevel: 50,
      evolvesInto: 'ancient_dragon_06'
    },
    traits: ['Legendary', 'Powerful', 'Ancient', 'Wise'],
    preferredFood: ['dragon_fruit', 'phoenix_feathers', 'molten_gold'],
    specialAbilities: {
      passiveBonus: 'All other chickens gain +20% to all stats',
      activeSkill: 'Dragon Roar - Instantly completes all incubating eggs'
    },
    breedingCompatibility: ['golden_chick_01'] // Very exclusive breeding
  },

  // SPECIAL EVENT CHICKENS
  ocean_chick_01: {
    id: 'ocean_chick_01',
    name: 'Tidecaller',
    rarity: 'RARE',
    description: 'A mystical sea chick with the power of the tides.',
    art: {
      chick: '🌊', // Wave baby
      adult: '🐧', // Penguin-like sea bird
      elder: '🦈'  // Shark-like sea creature
    },
    adult_at_level: 5, // New adulthood mechanic
    baseStats: {
      health: 160,
      attack: 28,
      defense: 22,
      speed: 40,
      happiness: 85,
      productivity: 45,
      // Core stats for feeding system - RARE ocean agility
      str: 8, // Moderate base strength
      agi: 12, // Very high base agility (ocean speed)
      sta: 10  // Good base stamina
    },
    stats_per_level: { str: 3, agi: 6, sta: 3 }, // Ocean agility growth
    max_happiness: 120, // RARE chickens have higher happiness cap
    growthRate: 1.4,
    baseValue: 350,
    
    // Future expansion fields
    skills: ['Water Magic', 'Tide Control', 'Deep Sea Diving'],
    evolutionPath: {
      canEvolve: true,
      evolutionLevel: 18,
      evolvesInto: 'ocean_leviathan_04'
    },
    traits: ['Aquatic', 'Mysterious', 'Fluid'],
    preferredFood: ['seaweed', 'pearls', 'ocean_essence'],
    specialAbilities: {
      passiveBonus: 'Reduces all hatch times by 25%',
      activeSkill: 'Tidal Wave - Refreshes all enhancement cooldowns'
    },
    breedingCompatibility: ['forest_chick_01', 'crystal_chick_01']
  }
};

/**
 * Chicken Stats Configuration
 * Defines what each stat does and how it affects gameplay
 */
export const STATS_CONFIG = {
  health: {
    name: 'Health',
    description: 'Determines how much damage the chicken can take',
    icon: '❤️',
    color: '#FF6B6B'
  },
  attack: {
    name: 'Attack',
    description: 'Determines damage dealt in battles',
    icon: '⚔️',
    color: '#FF8E53'
  },
  defense: {
    name: 'Defense',
    description: 'Reduces incoming damage',
    icon: '🛡️',
    color: '#4ECDC4'
  },
  speed: {
    name: 'Speed',
    description: 'Determines turn order and dodge chance',
    icon: '💨',
    color: '#45B7D1'
  },
  happiness: {
    name: 'Happiness',
    description: 'Affects productivity and breeding success',
    icon: '😊',
    color: '#FFA726'
  },
  productivity: {
    name: 'Productivity',
    description: 'Determines resource generation rate',
    icon: '🥚',
    color: '#66BB6A'
  }
};

/**
 * Helper Functions for Chicken Blueprints
 */

// Get chicken blueprint by ID
export const getChickenBlueprint = (blueprintId) => {
  return CHICKEN_BLUEPRINTS[blueprintId] || null;
};

// Get all chickens of a specific rarity
export const getChickensByRarity = (rarity) => {
  return Object.values(CHICKEN_BLUEPRINTS).filter(chicken => chicken.rarity === rarity);
};

// Calculate chicken value with level and rarity multipliers
export const calculateChickenValue = (blueprintId, level = 1) => {
  const blueprint = getChickenBlueprint(blueprintId);
  if (!blueprint) return 0;
  
  // Value increases with level
  const levelMultiplier = 1 + (level - 1) * 0.1; // 10% per level
  return Math.floor(blueprint.baseValue * levelMultiplier);
};

// Calculate current stats based on level
export const calculateCurrentStats = (blueprintId, level = 1) => {
  const blueprint = getChickenBlueprint(blueprintId);
  if (!blueprint) return null;
  
  const currentStats = {};
  const levelMultiplier = 1 + (level - 1) * 0.05; // 5% per level
  
  Object.keys(blueprint.baseStats).forEach(stat => {
    currentStats[stat] = Math.floor(blueprint.baseStats[stat] * levelMultiplier);
  });
  
  return currentStats;
};

// Check if chicken can evolve
export const canEvolve = (blueprintId, level) => {
  const blueprint = getChickenBlueprint(blueprintId);
  if (!blueprint || !blueprint.evolutionPath.canEvolve) return false;
  
  return level >= blueprint.evolutionPath.evolutionLevel;
};

// Get evolution target
export const getEvolutionTarget = (blueprintId) => {
  const blueprint = getChickenBlueprint(blueprintId);
  return blueprint?.evolutionPath?.evolvesInto || null;
};

// Create a new chicken instance
export const createChickenInstance = (blueprintId, level = 1) => {
  const blueprint = getChickenBlueprint(blueprintId);
  if (!blueprint) return null;
  
  // Determine initial stage based on level and blueprint adult_at_level
  const stage = level >= (blueprint.adult_at_level || 5) ? 'adult' : 'juvenile';
  
  return {
    id: `chicken_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    blueprintId: blueprintId,
    speciesName: blueprint.name, // Species name from blueprint (never changes)
    nickname: null, // Player's custom nickname (set after hatching)
    level: level,
    stage: stage, // New adulthood mechanic - 'juvenile' or 'adult'
    currentStats: calculateCurrentStats(blueprintId, level),
    // New feeding system fields
    xp: 0, // Current experience points
    xp_to_next_level: level * 100, // XP needed for next level
    happiness: Math.min(blueprint.max_happiness || 100, blueprint.baseStats.happiness), // Cap at max_happiness
    health: 100, // Health out of 100
    fullness: 85, // Fullness level (0-100), starts high when hatched
    max_happiness: blueprint.max_happiness || 100, // Personal max happiness from blueprint
    current_stats: { // Personal stats initialized from blueprint baseStats
      str: blueprint.baseStats.str || (10 + (level - 1) * (blueprint.stats_per_level?.str || 2)),
      agi: blueprint.baseStats.agi || (10 + (level - 1) * (blueprint.stats_per_level?.agi || 2)), 
      sta: blueprint.baseStats.sta || (10 + (level - 1) * (blueprint.stats_per_level?.sta || 2))
    },
    // Existing fields
    experience: 0, // Keep for backward compatibility
    experienceToNext: level * 100, // Keep for backward compatibility 
    lastFed: Date.now(),
    birthTime: Date.now(),
    totalEarnings: 0, // Track lifetime earnings
    cooldownUntil: null // NEW: Production cooldown timestamp (24 hours after collection)
  };
};

export default CHICKEN_BLUEPRINTS; 