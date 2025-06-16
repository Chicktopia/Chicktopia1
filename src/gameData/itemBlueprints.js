/**
 * Item Blueprint Database - Comprehensive item system for Chicktopia
 * Each item blueprint defines the properties and behavior of items in the game
 */

// Item Categories
export const ITEM_CATEGORIES = {
  CONSUMABLE: 'CONSUMABLE',
  EGG: 'EGG',
  MATERIAL: 'MATERIAL',
  SPECIAL: 'SPECIAL'
};

// Item Rarities (matching existing system)
export const ITEM_RARITIES = {
  COMMON: 'Common',
  UNCOMMON: 'Uncommon',
  RARE: 'Rare',
  EPIC: 'Epic',
  LEGENDARY: 'Legendary'
};

// Item Blueprint Database
const itemBlueprints = {
  // CONSUMABLE ITEMS
  'chicken_feed_01': {
    id: 'chicken_feed_01',
    name: 'Premium Chicken Feed',
    description: 'High-quality feed that instantly restores 25 happiness to a chicken. Made from the finest grains and seeds.',
    rarity: ITEM_RARITIES.COMMON,
    category: ITEM_CATEGORIES.CONSUMABLE,
    isStackable: true,
    art: '🌾',
    onUse: {
      xp_gain: 15,
      happiness_gain: 25,
      target: 'CHICKEN'
    },
    sellValue: 10
  },

  'power_nut_01': {
    id: 'power_nut_01',
    name: 'Power Nut',
    description: 'A crunchy nut packed with protein that provides a small permanent strength boost and moderate XP gain.',
    rarity: ITEM_RARITIES.UNCOMMON,
    category: ITEM_CATEGORIES.CONSUMABLE,
    isStackable: true,
    art: '🥜',
    onUse: {
      xp_gain: 20,
      happiness_gain: 10,
      stat_boost: { stat: 'STR', value: 2 },
      target: 'CHICKEN'
    },
    sellValue: 25
  },

  'joyful_berry_01': {
    id: 'joyful_berry_01',
    name: 'Joyful Berry',
    description: 'A magical berry that fills chickens with pure joy! Provides massive happiness boost and good XP.',
    rarity: ITEM_RARITIES.RARE,
    category: ITEM_CATEGORIES.CONSUMABLE,
    isStackable: true,
    art: '🫐',
    onUse: {
      xp_gain: 30,
      happiness_gain: 60,
      target: 'CHICKEN'
    },
    sellValue: 75
  },
  
  'golden_corn_01': {
    id: 'golden_corn_01',
    name: 'Golden Corn',
    description: 'Magical corn that fully restores a chicken\'s happiness and provides a temporary XP boost. Chickens love this treat!',
    rarity: ITEM_RARITIES.RARE,
    category: ITEM_CATEGORIES.CONSUMABLE,
    isStackable: true,
    art: '🌽',
    onUse: {
      xp_gain: 50,
      happiness_gain: 100, // Full restore
      target: 'CHICKEN'
    },
    sellValue: 100
  },

  'energy_potion_01': {
    id: 'energy_potion_01',
    name: 'Energy Potion',
    description: 'A bubbling potion that instantly completes any ongoing hatching process. Perfect for impatient chicken breeders.',
    rarity: ITEM_RARITIES.UNCOMMON,
    category: ITEM_CATEGORIES.CONSUMABLE,
    isStackable: true,
    art: '🧪',
    onUse: {
      type: 'INSTANT_HATCH',
      target: 'EGG_SLOT'
    },
    sellValue: 50
  },

  // MATERIAL ITEMS
  'rainbow_feather_01': {
    id: 'rainbow_feather_01',
    name: 'Rainbow Feather',
    description: 'A rare feather that shimmers with all colors of the rainbow. Essential crafting material for legendary items.',
    rarity: ITEM_RARITIES.EPIC,
    category: ITEM_CATEGORIES.MATERIAL,
    isStackable: true,
    art: '🪶',
    onUse: null, // Materials are used in crafting, not directly consumed
    sellValue: 500
  },

  'crystal_shard_01': {
    id: 'crystal_shard_01',
    name: 'Crystal Shard',
    description: 'A fragment of pure crystal energy. Can be used to enhance incubator equipment or craft special items.',
    rarity: ITEM_RARITIES.RARE,
    category: ITEM_CATEGORIES.MATERIAL,
    isStackable: true,
    art: '💎',
    onUse: null,
    sellValue: 200
  },

  'mystic_dust_01': {
    id: 'mystic_dust_01',
    name: 'Mystic Dust',
    description: 'Glittering dust with magical properties. A common crafting ingredient found throughout the chicken realm.',
    rarity: ITEM_RARITIES.COMMON,
    category: ITEM_CATEGORIES.MATERIAL,
    isStackable: true,
    art: '✨',
    onUse: null,
    sellValue: 5
  },

  // SPECIAL ITEMS
  'lucky_charm_01': {
    id: 'lucky_charm_01',
    name: 'Lucky Charm',
    description: 'A mysterious charm that increases the chance of hatching rare chickens. Its power is said to be limitless.',
    rarity: ITEM_RARITIES.LEGENDARY,
    category: ITEM_CATEGORIES.SPECIAL,
    isStackable: false, // Special items are often unique
    art: '🍀',
    onUse: {
      type: 'RARE_HATCH_BOOST',
      duration: '24H',
      multiplier: 2.0
    },
    sellValue: 2000
  },

  'time_crystal_01': {
    id: 'time_crystal_01',
    name: 'Time Crystal',
    description: 'A crystal that bends time itself. Permanently reduces all hatching times by 10%. Can only be used once.',
    rarity: ITEM_RARITIES.LEGENDARY,
    category: ITEM_CATEGORIES.SPECIAL,
    isStackable: false,
    art: '⏰',
    onUse: {
      type: 'PERMANENT_HATCH_SPEED',
      value: 0.1, // 10% reduction
      consumeOnUse: true
    },
    sellValue: 5000
  },

  'chicken_whistle_01': {
    id: 'chicken_whistle_01',
    name: 'Chicken Whistle',
    description: 'A magical whistle that calls all chickens to gather. Instantly collects happiness from all chickens in your coop.',
    rarity: ITEM_RARITIES.EPIC,
    category: ITEM_CATEGORIES.SPECIAL,
    isStackable: false,
    art: '🎵',
    onUse: {
      type: 'COLLECT_ALL_HAPPINESS',
      target: 'ALL_CHICKENS'
    },
    sellValue: 1000
  }
};

/**
 * Get item blueprint by ID
 * @param {string} itemId - The item blueprint ID
 * @returns {Object|null} Item blueprint or null if not found
 */
export const getItemBlueprint = (itemId) => {
  return itemBlueprints[itemId] || null;
};

/**
 * Get all item blueprints
 * @returns {Object} All item blueprints
 */
export const getAllItemBlueprints = () => {
  return itemBlueprints;
};

/**
 * Get items by category
 * @param {string} category - The category to filter by
 * @returns {Array} Array of item blueprints in the category
 */
export const getItemsByCategory = (category) => {
  return Object.values(itemBlueprints).filter(item => item.category === category);
};

/**
 * Get items by rarity
 * @param {string} rarity - The rarity to filter by
 * @returns {Array} Array of item blueprints with the specified rarity
 */
export const getItemsByRarity = (rarity) => {
  return Object.values(itemBlueprints).filter(item => item.rarity === rarity);
};

/**
 * Check if an item is consumable
 * @param {string} itemId - The item blueprint ID
 * @returns {boolean} True if the item is consumable
 */
export const isItemConsumable = (itemId) => {
  const blueprint = getItemBlueprint(itemId);
  return blueprint && blueprint.category === ITEM_CATEGORIES.CONSUMABLE;
};

/**
 * Check if an item is stackable
 * @param {string} itemId - The item blueprint ID
 * @returns {boolean} True if the item is stackable
 */
export const isItemStackable = (itemId) => {
  const blueprint = getItemBlueprint(itemId);
  return blueprint && blueprint.isStackable;
};

export default itemBlueprints; 