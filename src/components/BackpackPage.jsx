import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCoins } from 'react-icons/fa';
import './BackpackPage.css';
import ItemCard from './ItemCard';
import GameModal from './GameModal';
import SellItemModal from './SellItemModal';
import { usePlayer } from '../context/PlayerContext.jsx';
import { getItemBlueprint, ITEM_CATEGORIES } from '../gameData/itemBlueprints';
import { getEggBlueprint } from '../gameData/eggBlueprints';

/**
 * BackpackPage Component - Central inventory management system
 * Features category filtering, sorting, item details, and advanced management
 */
const BackpackPage = () => {
  // Navigation hook
  const navigate = useNavigate();

  // Global player state
  const { 
    inventory = {}, 
    myEggs = [], 
    backpackCapacity = 50,
    toggleItemLock,
    removeItem,
    addChickCoin,
    upgradeBackpackCapacity,
    getBackpackUpgradeCost,
    setItemToUse
  } = usePlayer();

  // Local state for UI controls
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('RARITY');
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Modal states
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showSellItemModal, setShowSellItemModal] = useState(false);
  const [showUpgradeResultModal, setShowUpgradeResultModal] = useState(false);
  const [upgradeResultMessage, setUpgradeResultMessage] = useState('');

  // Category tabs configuration
  const categoryTabs = [
    { id: 'ALL', label: 'All', icon: '📦' },
    { id: 'CONSUMABLE', label: 'Consumables', icon: '🍯' },
    { id: 'EGG', label: 'Eggs', icon: '🥚' },
    { id: 'MATERIAL', label: 'Materials', icon: '⚒️' },
    { id: 'SPECIAL', label: 'Special', icon: '✨' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'RARITY', label: 'Rarity' },
    { value: 'QUANTITY', label: 'Quantity' },
    { value: 'NAME', label: 'Name' }
  ];

  // Process inventory data into display format
  const processedItems = useMemo(() => {
    const items = [];

    // Add regular inventory items (with null check)
    if (inventory) {
      Object.entries(inventory).forEach(([itemId, itemData]) => {
        const blueprint = getItemBlueprint(itemId);
        if (blueprint) {
          items.push({
            id: itemId,
            type: 'ITEM',
            blueprint,
            quantity: itemData.quantity,
            isLocked: itemData.isLocked || false
          });
        }
      });
    }

    // Add eggs as items (with null check)
    if (myEggs && Array.isArray(myEggs)) {
      myEggs.forEach((egg) => {
      const blueprint = getEggBlueprint(egg.blueprintId);
      if (blueprint) {
        // Convert egg blueprint to item-like format
        const eggAsItem = {
          ...blueprint,
          category: ITEM_CATEGORIES.EGG,
          isStackable: true,
          sellValue: blueprint.sellValue || 25
        };

        // Check if we already have this egg type in items
        const existingEggIndex = items.findIndex(
          item => item.type === 'EGG' && item.blueprint.id === blueprint.id
        );

        if (existingEggIndex >= 0) {
          // Increment quantity
          items[existingEggIndex].quantity += 1;
          items[existingEggIndex].eggIds.push(egg.id);
        } else {
          // Add new egg type
          items.push({
            id: blueprint.id,
            type: 'EGG',
            blueprint: eggAsItem,
            quantity: 1,
            isLocked: false,
            eggIds: [egg.id] // Track individual egg IDs
          });
        }
      }
      });
    }

    return items;
  }, [inventory, myEggs]);

  // Filter items by category
  const filteredItems = useMemo(() => {
    if (activeCategory === 'ALL') {
      return processedItems;
    }
    return processedItems.filter(item => item.blueprint.category === activeCategory);
  }, [processedItems, activeCategory]);

  // Sort items
  const sortedItems = useMemo(() => {
    const items = [...filteredItems];
    
    switch (sortBy) {
      case 'RARITY': {
        const rarityOrder = { 'Legendary': 5, 'Epic': 4, 'Rare': 3, 'Uncommon': 2, 'Common': 1 };
        return items.sort((a, b) => {
          const rarityA = rarityOrder[a.blueprint.rarity] || 0;
          const rarityB = rarityOrder[b.blueprint.rarity] || 0;
          return rarityB - rarityA; // Highest rarity first
        });
      }
      case 'QUANTITY':
        return items.sort((a, b) => b.quantity - a.quantity); // Highest quantity first
      case 'NAME':
        return items.sort((a, b) => a.blueprint.name.localeCompare(b.blueprint.name));
      default:
        return items;
    }
  }, [filteredItems, sortBy]);

  // Calculate used slots
  const usedSlots = processedItems.length;

  // Handle item selection
  const handleItemClick = (item) => {
    setSelectedItem(selectedItem?.id === item.id ? null : item);
  };

  // Handle category tab click
  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setSelectedItem(null); // Clear selection when changing category
  };

  // Handle item use - Enter target selection mode
  const handleUseItem = () => {
    if (!selectedItem || selectedItem.isLocked) return;
    
    // Check if item is consumable and requires a target
    if (selectedItem.blueprint.category === ITEM_CATEGORIES.CONSUMABLE) {
      // Set the item to use in global state for target selection
      setItemToUse({
        itemId: selectedItem.id,
        itemName: selectedItem.blueprint.name,
        quantity: 1
      });
      
      // Navigate to homepage for target selection
      navigate('/');
    } else {
      // For non-consumable items, use immediately
      console.log('Using item:', selectedItem.blueprint.name);
      
      if (selectedItem.type === 'ITEM') {
        removeItem(selectedItem.id, 1);
      }
    }
    
    setSelectedItem(null);
  };

  // Handle item sell - Show quantity selector modal
  const handleSellItem = () => {
    if (!selectedItem || selectedItem.isLocked) return;
    setShowSellItemModal(true);
  };

  // Confirm item sell with specified quantity
  const confirmSellItem = (quantity) => {
    if (!selectedItem) return;
    
    const sellValue = selectedItem.blueprint.sellValue || 1;
    const totalValue = sellValue * quantity;
    
    // Add coins to player
    addChickCoin(totalValue);
    
    // Remove item from inventory
    if (selectedItem.type === 'ITEM') {
      removeItem(selectedItem.id, quantity);
    }
    
    setShowSellItemModal(false);
    setSelectedItem(null);
  };

  // Handle backpack upgrade
  const handleUpgradeBackpack = () => {
    setShowUpgradeModal(true);
  };

  // Confirm backpack upgrade
  const confirmUpgradeBackpack = () => {
    const success = upgradeBackpackCapacity();
    setShowUpgradeModal(false);
    
    // Show result feedback modal
    if (success) {
      setUpgradeResultMessage(`Success! Your backpack capacity has been increased to ${backpackCapacity + 10} slots.`);
    } else {
      setUpgradeResultMessage('Insufficient ChickCoin! Upgrade failed.');
    }
    setShowUpgradeResultModal(true);
  };

  // Handle item lock toggle
  const handleToggleLock = () => {
    if (!selectedItem) return;
    
    if (selectedItem.type === 'ITEM') {
      toggleItemLock(selectedItem.id);
    }
    
    // Update selected item state
    setSelectedItem(prev => ({
      ...prev,
      isLocked: !prev.isLocked
    }));
  };

  return (
    <div className="backpack-page">
      {/* Header Section */}
      <div className="backpack-header">
        <h1 className="backpack-title">Backpack</h1>
        <div className="capacity-display">
          <div className="capacity-info">
            <span className="capacity-text">
              Slots Used: <span className="capacity-numbers">{usedSlots} / {backpackCapacity}</span>
            </span>
            <div className="capacity-bar">
              <div 
                className="capacity-fill" 
                style={{ width: `${(usedSlots / backpackCapacity) * 100}%` }}
              />
            </div>
          </div>
          <button 
            className="upgrade-button"
            onClick={handleUpgradeBackpack}
            title={`Upgrade capacity for ${getBackpackUpgradeCost()} ChickCoin`}
          >
            [ + ]
          </button>
        </div>
      </div>

      {/* Controls Section */}
      <div className="backpack-controls">
        {/* Category Tabs */}
        <div className="category-tabs">
          {categoryTabs.map(tab => (
            <button
              key={tab.id}
              className={`category-tab ${activeCategory === tab.id ? 'active' : ''}`}
              onClick={() => handleCategoryClick(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Sorting Dropdown */}
        <div className="sort-controls">
          <label className="sort-label">Sort by:</label>
          <select 
            className="sort-dropdown"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="backpack-content">
        {/* Item Grid */}
        <div className="item-grid-container">
          <div className="item-grid">
            {sortedItems.map((item) => (
              <ItemCard
                key={`${item.type}-${item.id}`}
                item={item}
                isSelected={selectedItem?.id === item.id}
                onClick={handleItemClick}
              />
            ))}
          </div>

          {/* Empty State */}
          {sortedItems.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-content">
                <span className="empty-emoji">📦</span>
                <h3 className="empty-title">No items found</h3>
                <p className="empty-description">
                  {activeCategory === 'ALL' 
                    ? "Your backpack is empty. Start collecting items!"
                    : `No ${activeCategory.toLowerCase()} items in your backpack.`
                  }
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Item Details Panel */}
        {selectedItem && (
          <div className="item-details-panel">
            <div className="details-header">
              <div className="details-art">
                {selectedItem.blueprint.art}
              </div>
              <div className="details-info">
                <h3 className="details-name">{selectedItem.blueprint.name}</h3>
                <span className={`details-rarity rarity-${selectedItem.blueprint.rarity.toLowerCase()}`}>
                  {selectedItem.blueprint.rarity}
                </span>
                <div className="details-quantity">
                  Quantity: {selectedItem.quantity}
                </div>
              </div>
            </div>

            <div className="details-description">
              {selectedItem.blueprint.description}
            </div>

            <div className="details-actions">
              <button 
                className="action-btn use-btn"
                onClick={handleUseItem}
                disabled={selectedItem.isLocked || !selectedItem.blueprint.onUse}
              >
                Use
              </button>
              <button 
                className="action-btn sell-btn"
                onClick={handleSellItem}
                disabled={selectedItem.isLocked}
              >
                Sell ({(selectedItem.blueprint.sellValue || 1) * selectedItem.quantity} <FaCoins />)
              </button>
              <button 
                className="action-btn lock-btn"
                onClick={handleToggleLock}
              >
                {selectedItem.isLocked ? '🔓 Unlock' : '🔒 Lock'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Backpack Upgrade Modal */}
      <GameModal
        isOpen={showUpgradeModal}
        title="Upgrade Backpack"
        message={`Upgrade backpack capacity to ${backpackCapacity + 10} slots for ${getBackpackUpgradeCost()} ChickCoin?`}
        type="info"
        showConfirmButton={true}
        confirmText="Upgrade"
        cancelText="Cancel"
        onConfirm={confirmUpgradeBackpack}
        onClose={() => setShowUpgradeModal(false)}
      />

      {/* Sell Item Modal with Quantity Selection */}
      <SellItemModal
        isOpen={showSellItemModal}
        item={selectedItem}
        onConfirm={confirmSellItem}
        onClose={() => setShowSellItemModal(false)}
      />

      {/* Upgrade Result Feedback Modal */}
      <GameModal
        isOpen={showUpgradeResultModal}
        title={upgradeResultMessage.includes('Success') ? 'Upgrade Successful' : 'Upgrade Failed'}
        message={upgradeResultMessage}
        type={upgradeResultMessage.includes('Success') ? 'success' : 'error'}
        buttonText="OK"
        onClose={() => setShowUpgradeResultModal(false)}
      />
    </div>
  );
};

export default BackpackPage; 