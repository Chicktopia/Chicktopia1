import React, { useState, useEffect } from 'react';
import './HatcheryPage.css';
import IncubatorSlot from './IncubatorSlot';
import MyEggs from './MyEggs';
import GameModal from './GameModal';
import EggSelectionModal from './EggSelectionModal';
import FusionAltar from './FusionAltar';
import ChickenNamingModal from './ChickenNamingModal';
import { FaFeatherAlt } from 'react-icons/fa';
import { usePlayer } from '../context/PlayerContext.jsx';

/**
 * HatcheryPage Component - Main page for the incubator and egg management
 * Implements improved interaction flows, confirmation modals, and hierarchical layout
 */
const HatcheryPage = () => {
  // Use global player state for currency synchronization
  const {
    slots,
    myEggs,
    enhancements,
    chickCoin,
    selectedEggId,
    setSlots,
    setMyEggs,
    setMyChickens,
    setEnhancements,
    spendChickCoin,
    setSelectedEggId,
    rollChickenFromEgg,
    getEggBlueprint,
    createChickenInstance
  } = usePlayer();

  // Modal states for beautiful notifications and interactions
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  // Egg selection modal state for improved interaction flow
  const [eggSelectionModal, setEggSelectionModal] = useState({
    isOpen: false,
    targetSlotId: null
  });

  // Speed up confirmation modal state
  const [speedUpConfirmation, setSpeedUpConfirmation] = useState({
    isOpen: false,
    slotId: null,
    cost: 100
  });

  // Chicken naming modal state
  const [namingModal, setNamingModal] = useState({
    isOpen: false,
    chickenInstance: null
  });

  // Slot unlock confirmation modal state
  const [unlockConfirmation, setUnlockConfirmation] = useState({
    isOpen: false,
    slotId: null,
    cost: 0
  });

  // Show modal helper function
  const showModal = (title, message, type = 'info') => {
    setModal({
      isOpen: true,
      title,
      message,
      type
    });
  };

  // Close modal helper function
  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  // Calculate enhancement bonuses for display - MOVED UP to fix hoisting issue
  const getEnhancementBonus = (enhancementType) => {
    const level = enhancements[enhancementType]?.level || 0;
    if (enhancementType === 'warmthLamp') {
      return level * 5; // 5% per level
    } else if (enhancementType === 'blessingTotem') {
      return level * 3; // 3% per level
    }
    return 0;
  };

  // Timer management with useEffect - UPDATED to use blueprint hatch times
  useEffect(() => {
    const interval = setInterval(() => {
      setSlots(prevSlots => 
        prevSlots.map(slot => {
          if (slot.status === 'hatching' && slot.startTime) {
            const elapsed = Date.now() - slot.startTime;
            // Use blueprint hatch time if available, otherwise default to 2 minutes
            const hatchTime = slot.hatchTime || 120000;
            
            // Apply warmth lamp bonus (reduce hatch time)
            const warmthBonus = getEnhancementBonus('warmthLamp');
            const adjustedHatchTime = Math.floor(hatchTime * (1 - warmthBonus / 100));
            
            if (elapsed >= adjustedHatchTime) {
              // Timer finished - change to ready
              return { ...slot, status: 'ready', timer: '00:00:00' };
            } else {
              // Update timer display
              const remaining = Math.max(0, adjustedHatchTime - elapsed);
              const minutes = Math.floor(remaining / 60000);
              const seconds = Math.floor((remaining % 60000) / 1000);
              const timer = `00:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
              return { ...slot, timer };
            }
          }
          return slot;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [setSlots, getEnhancementBonus]);

  // IMPROVED: New interaction flow - clicking empty slot opens egg selection modal
  const handleEmptySlotClick = (slotId) => {
    setEggSelectionModal({
      isOpen: true,
      targetSlotId: slotId
    });
  };

  // Handle egg selection from modal and place it in the slot
  const handleEggSelectFromModal = (slotId, eggId) => {
    // Find the egg to get its blueprint ID
    const selectedEgg = myEggs.find(egg => egg.id === eggId);
    if (!selectedEgg) {
      showModal('Error', 'Selected egg not found!', 'error');
      return;
    }

    // Get blueprint to determine hatch time
    const blueprint = getEggBlueprint(selectedEgg.blueprintId);
    const hatchTime = blueprint ? blueprint.hatchTime : 120000; // Default 2 minutes

    // Remove egg from inventory
    setMyEggs(prevEggs => prevEggs.filter(egg => egg.id !== eggId));
    
    // Update slot to hatching status with blueprint reference
    setSlots(prevSlots =>
      prevSlots.map(slot =>
        slot.id === slotId
          ? { 
              ...slot, 
              status: 'hatching', 
              startTime: Date.now(), 
              timer: '02:00:00',
              blueprintId: selectedEgg.blueprintId,
              hatchTime: hatchTime
            }
          : slot
      )
    );

    // Clear selection
    setSelectedEggId(null);
    
    // Show success message
    const eggName = blueprint ? blueprint.name : 'Unknown Egg';
    showModal('Egg Placed Successfully!', `Your ${eggName} is now incubating. Hatching will take ${Math.floor(hatchTime / 60000)} minutes.`, 'success');
  };

  // Close egg selection modal
  const closeEggSelectionModal = () => {
    setEggSelectionModal({
      isOpen: false,
      targetSlotId: null
    });
  };

  const handleHatchClick = (slotId) => {
    // Find the slot to get the egg blueprint
    const slot = slots.find(s => s.id === slotId);
    if (!slot || !slot.blueprintId) {
      showModal('Error', 'No egg found in this slot!', 'error');
      return;
    }

    // Roll for chicken using blueprint system
    const chickenBlueprintId = rollChickenFromEgg(slot.blueprintId);
    if (!chickenBlueprintId) {
      showModal('Error', 'Failed to hatch chicken!', 'error');
      return;
    }

    // Create new chicken instance (without nickname yet)
    const newChicken = createChickenInstance(chickenBlueprintId, 1);
    
    // Reset slot to empty
    setSlots(prevSlots =>
      prevSlots.map(slot =>
        slot.id === slotId
          ? { id: slot.id, status: 'empty' }
          : slot
      )
    );

    // Open naming modal instead of simple success modal
    setNamingModal({
      isOpen: true,
      chickenInstance: newChicken
    });
  };

  const handleUnlockSlot = (slotId) => {
    const slot = slots.find(s => s.id === slotId);
    if (!slot) return;

    const cost = slot.unlockCost || 2000;
    
    // Show confirmation modal instead of immediately unlocking
    setUnlockConfirmation({
      isOpen: true,
      slotId: slotId,
      cost: cost
    });
  };

  // IMPROVED: Speed up now shows confirmation modal
  const handleSpeedUpClick = (slotId) => {
    setSpeedUpConfirmation({
      isOpen: true,
      slotId: slotId,
      cost: 100
    });
  };

  // Confirm speed up after user confirmation
  const confirmSpeedUp = () => {
    const { slotId, cost } = speedUpConfirmation;
    
    // Use global currency spend function
    const success = spendChickCoin(cost);
    if (!success) {
      showModal('Insufficient Funds', `Not enough ChickCoin! Speed up costs ${cost} but you only have ${chickCoin}.`, 'error');
      closeSpeedUpConfirmation();
      return;
    }

    // Instantly ready the egg
    setSlots(prevSlots =>
      prevSlots.map(slot =>
        slot.id === slotId
          ? { ...slot, status: 'ready', timer: '00:00:00' }
          : slot
      )
    );

    showModal('Hatching Accelerated!', `Your egg is now ready to hatch! Speed up cost: ${cost} ChickCoin.`, 'success');
    closeSpeedUpConfirmation();
  };

  // Close speed up confirmation modal
  const closeSpeedUpConfirmation = () => {
    setSpeedUpConfirmation({
      isOpen: false,
      slotId: null,
      cost: 100
    });
  };

  // Handle chicken naming confirmation
  const handleChickenNaming = (chickenInstance, nickname) => {
    // Add nickname to chicken instance
    const namedChicken = {
      ...chickenInstance,
      nickname: nickname
    };
    
    // Add chicken to collection
    setMyChickens(prev => [...prev, namedChicken]);
    
    // Close naming modal
    setNamingModal({
      isOpen: false,
      chickenInstance: null
    });
    
    // Show success message
    showModal('Welcome to the Family!', `${nickname} has joined your chicken collection! 🐥`, 'success');
  };

  // Confirm slot unlock after user confirmation
  const confirmSlotUnlock = () => {
    const { slotId, cost } = unlockConfirmation;
    
    // Use global currency spend function
    const success = spendChickCoin(cost);
    if (!success) {
      showModal('Insufficient Funds', `Not enough ChickCoin! You need ${cost} but only have ${chickCoin}.`, 'error');
      closeUnlockConfirmation();
      return;
    }

    // Unlock slot
    setSlots(prevSlots =>
      prevSlots.map(s =>
        s.id === slotId
          ? { id: s.id, status: 'empty' }
          : s
      )
    );

    showModal('Slot Unlocked!', `Incubator slot unlocked for ${cost} ChickCoin!`, 'success');
    closeUnlockConfirmation();
  };

  // Close unlock confirmation modal
  const closeUnlockConfirmation = () => {
    setUnlockConfirmation({
      isOpen: false,
      slotId: null,
      cost: 0
    });
  };

  const handleEggSelect = (eggId) => {
    setSelectedEggId(eggId);
  };

  // NEW: Enhancement upgrade functionality
  const handleEnhancementUpgrade = (enhancementType) => {
    const enhancement = enhancements[enhancementType];
    if (!enhancement) return;

    // Check if already at max level
    if (enhancement.level >= enhancement.maxLevel) {
      showModal('Max Level Reached', `${enhancementType === 'warmthLamp' ? 'Warmth Lamp' : 'Blessing Totem'} is already at maximum level!`, 'warning');
      return;
    }

    // Calculate cost (increases with level)
    const baseCost = enhancement.cost;
    const currentLevel = enhancement.level;
    const upgradeCost = Math.floor(baseCost * Math.pow(1.5, currentLevel));

    // Show confirmation modal
    const enhancementName = enhancementType === 'warmthLamp' ? 'Warmth Lamp' : 'Blessing Totem';
    const currentBonus = enhancementType === 'warmthLamp' 
      ? `${currentLevel * 5}%` 
      : `${currentLevel * 3}%`;
    const nextBonus = enhancementType === 'warmthLamp' 
      ? `${(currentLevel + 1) * 5}%` 
      : `${(currentLevel + 1) * 3}%`;

    setModal({
      isOpen: true,
      title: `Upgrade ${enhancementName}`,
      message: `Upgrade ${enhancementName} from Level ${currentLevel} to Level ${currentLevel + 1}?\n\nCost: ${upgradeCost} ChickCoin\nCurrent Bonus: ${currentBonus}\nNew Bonus: ${nextBonus}`,
      type: 'warning',
      showConfirmButton: true,
      onConfirm: () => confirmEnhancementUpgrade(enhancementType, upgradeCost),
      confirmText: 'Upgrade',
      cancelText: 'Cancel'
    });
  };

  // Confirm enhancement upgrade
  const confirmEnhancementUpgrade = (enhancementType, cost) => {
    // Check if player has enough currency
    const success = spendChickCoin(cost);
    if (!success) {
      showModal('Insufficient Funds', `Not enough ChickCoin! Upgrade costs ${cost} but you only have ${chickCoin}.`, 'error');
      return;
    }

    // Upgrade the enhancement
    setEnhancements(prev => ({
      ...prev,
      [enhancementType]: {
        ...prev[enhancementType],
        level: prev[enhancementType].level + 1
      }
    }));

    const enhancementName = enhancementType === 'warmthLamp' ? 'Warmth Lamp' : 'Blessing Totem';
    showModal('Upgrade Successful!', `${enhancementName} has been upgraded! Cost: ${cost} ChickCoin.`, 'success');
  };

  return (
    <div className="hatchery-page">
      {/* Page Header */}
      <div className="hatchery-header">
        <h1 className="hatchery-title">The Hatchery</h1>
        <p className="hatchery-subtitle">The cradle of new life</p>
      </div>

      {/* IMPROVED: New hierarchical layout - Top-Bottom structure */}
      <div className="hatchery-content">
        {/* Top Section - Full-width Incubator Slots (Main Focus) */}
        <section className="incubator-section">
          <div className="incubator-grid">
            {slots.map(slot => (
              <IncubatorSlot
                key={slot.id}
                slot={slot}
                onEmptySlotClick={handleEmptySlotClick}
                onHatchClick={handleHatchClick}
                onUnlockClick={handleUnlockSlot}
                onSpeedUpClick={handleSpeedUpClick}
              />
            ))}
          </div>
        </section>

        {/* Bottom Section - Three-column layout for secondary modules */}
        <div className="secondary-modules">
          {/* Left Column - Egg Fusion Altar */}
          <section className="fusion-section">
            <h2 className="section-title">Egg Fusion Altar</h2>
            <FusionAltar />
          </section>

          {/* Middle Column - Hatchery Enhancements */}
          <section className="enhancements-section">
            <h2 className="section-title">Hatchery Enhancements</h2>
            <div className="enhancements-grid">
              {/* Warmth Lamp Enhancement Card */}
              <div className="enhancement-card">
                <div className="enhancement-icon">💡</div>
                <h3 className="enhancement-name">Warmth Lamp</h3>
                <p className="enhancement-effect">
                  Hatching Speed: -{getEnhancementBonus('warmthLamp')}%
                </p>
                <button 
                  className="enhancement-btn"
                  onClick={() => handleEnhancementUpgrade('warmthLamp')}
                >
                  Upgrade (Lv.{enhancements.warmthLamp?.level || 0})
                </button>
              </div>

              {/* Blessing Totem Enhancement Card */}
              <div className="enhancement-card">
                <div className="enhancement-icon">
                  <FaFeatherAlt />
                </div>
                <h3 className="enhancement-name">Blessing Totem</h3>
                <p className="enhancement-effect">
                  Bonus Initial Stats: +{getEnhancementBonus('blessingTotem')}%
                </p>
                <button 
                  className="enhancement-btn"
                  onClick={() => handleEnhancementUpgrade('blessingTotem')}
                >
                  Upgrade (Lv.{enhancements.blessingTotem?.level || 0})
                </button>
              </div>
            </div>
          </section>

          {/* Right Column - My Eggs Inventory */}
          <section className="my-eggs-section">
            <MyEggs
              eggs={myEggs}
              selectedEggId={selectedEggId}
              onEggSelect={handleEggSelect}
            />
          </section>
        </div>
      </div>

      {/* Game Modal for beautiful notifications */}
      <GameModal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onClose={closeModal}
      />

      {/* IMPROVED: Egg Selection Modal for intuitive interaction flow */}
      <EggSelectionModal
        isOpen={eggSelectionModal.isOpen}
        eggs={myEggs}
        slotId={eggSelectionModal.targetSlotId}
        onEggSelect={handleEggSelectFromModal}
        onClose={closeEggSelectionModal}
      />

      {/* IMPROVED: Speed Up Confirmation Modal */}
      <GameModal
        isOpen={speedUpConfirmation.isOpen}
        title="Speed Up Hatching"
        message={`Speed up hatching for ${speedUpConfirmation.cost} ChickCoin? This will make your egg ready to hatch immediately.`}
        type="warning"
        onClose={closeSpeedUpConfirmation}
        showConfirmButton={true}
        onConfirm={confirmSpeedUp}
        confirmText="Confirm"
        cancelText="Cancel"
      />

      {/* NEW: Chicken Naming Modal */}
      <ChickenNamingModal
        isOpen={namingModal.isOpen}
        chickenInstance={namingModal.chickenInstance}
        onConfirm={handleChickenNaming}
      />

      {/* NEW: Slot Unlock Confirmation Modal */}
      <GameModal
        isOpen={unlockConfirmation.isOpen}
        title="Unlock Incubator Slot"
        message={`Unlock this incubator slot for ${unlockConfirmation.cost.toLocaleString()} ChickCoin?`}
        type="warning"
        onClose={closeUnlockConfirmation}
        showConfirmButton={true}
        onConfirm={confirmSlotUnlock}
        confirmText="Confirm"
        cancelText="Cancel"
      />
    </div>
  );
};

export default HatcheryPage; 