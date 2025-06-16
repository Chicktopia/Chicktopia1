import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaWind, FaLeaf, FaMagic } from 'react-icons/fa';
import NestCard from './NestCard';
import GameModal from './GameModal';
import Tooltip from './Tooltip';
import { usePlayer } from '../context/PlayerContext';
import { getChickenBlueprint } from '../gameData/chickenBlueprints';
import './CoopPage.css';

/**
 * CoopPage Component - Main coop management interface
 * Features tab-based navigation and production system
 */
const CoopPage = () => {
  // Global player state
  const { 
    myChickens, 
    setMyChickens, 
    coop, 
    setCoop, 
    chickCoin, 
    spendChickCoin, 
    addChickCoin,
    addEgg,
    selectChicken
  } = usePlayer();

  // Local state for tab management
  const [activeTab, setActiveTab] = useState('production');
  
  // Modal states
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  // NEW: Chicken selection modal for assignment
  const [chickenSelectionModal, setChickenSelectionModal] = useState({
    isOpen: false,
    nestId: null
  });

  // Chicken details now handled by global state

  // Environment options with detailed descriptions and icons
  const environmentOptions = [
    { 
      id: 'standard', 
      name: 'Standard Atmosphere', 
      bonus: 'No bonus',
      description: 'No special effects. Standard production environment.',
      icon: FaWind
    },
    { 
      id: 'enriched', 
      name: 'Enriched Soil', 
      bonus: '+10% productivity',
      description: 'Slightly reduces production time for all nests by improving soil quality.',
      icon: FaLeaf
    },
    { 
      id: 'mystic', 
      name: 'Mystic Incense', 
      bonus: '+5% miracle chance',
      description: 'Increases the chance of finding Miracle Products during egg collection.',
      icon: FaMagic
    }
  ];

  // Get available adult chickens (excluding those in cooldown)
  const getAvailableChickens = () => {
    if (!coop?.nests || !myChickens) return [];
    
    // Get chickens that are already assigned to nests
    const assignedChickenIds = coop.nests
      .filter(nest => nest.assignedChickenId)
      .map(nest => nest.assignedChickenId);
    
    // Filter for adult chickens not assigned and not in cooldown
    return myChickens.filter(chicken => {
      const isAdult = chicken.stage === 'adult';
      const isNotAssigned = !assignedChickenIds.includes(chicken.id);
      const isNotInCooldown = !chicken.cooldownUntil || Date.now() >= chicken.cooldownUntil;
      
      return isAdult && isNotAssigned && isNotInCooldown;
    });
  };

  // Get chickens in cooldown for UI display
  const getChickensInCooldown = () => {
    if (!myChickens) return [];
    
    return myChickens.filter(chicken => {
      const isAdult = chicken.stage === 'adult';
      const isInCooldown = chicken.cooldownUntil && Date.now() < chicken.cooldownUntil;
      
      return isAdult && isInCooldown;
    });
  };

  // Show modal
  const showModal = (title, message, type = 'info') => {
    setModal({ isOpen: true, title, message, type });
  };

  // Close modal
  const closeModal = () => {
    setModal({ isOpen: false, title: '', message: '', type: 'info' });
  };

  // Handle tab switching
  const handleTabClick = (tabId) => {
    if (tabId === 'production') {
      setActiveTab(tabId);
    }
    // Other tabs are disabled for now
  };

  // Handle environment change
  const handleEnvironmentChange = () => {
    if (!coop) return;
    
    const currentIndex = environmentOptions.findIndex(env => env.id === coop.environment);
    const nextIndex = (currentIndex + 1) % environmentOptions.length;
    const newEnvironment = environmentOptions[nextIndex].id;
    
    setCoop(prev => ({
      ...prev,
      environment: newEnvironment
    }));
  };

  // IMPROVED: Handle nest assignment - directly open selection modal
  const handleAssignChicken = (nestId) => {
    const availableChickens = getAvailableChickens();
    
    if (availableChickens.length === 0) {
      showModal(
        'No Available Chickens', 
        'You need adult chickens to assign to nests. Level up your chickens to at least Level 5!',
        'warning'
      );
      return;
    }

    // Directly open the selection modal
    setChickenSelectionModal({
      isOpen: true,
      nestId: nestId
    });
  };

  // IMPROVED: Confirm chicken assignment from selection modal
  const confirmChickenAssignment = (chickenId) => {
    const nestId = chickenSelectionModal.nestId;
    const chicken = myChickens.find(c => c.id === chickenId);
    
    if (!chicken) return;

    // Calculate production time (2 hours base, modified by happiness and environment)
    const baseTime = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
    const happinessMultiplier = Math.max(0.5, 1 - (chicken.happiness / 100) * 0.3); // Higher happiness = faster
    const productionTime = Math.floor(baseTime * happinessMultiplier);
    const endTime = Date.now() + productionTime;

    // Update nest state
    setCoop(prev => ({
      ...prev,
      nests: prev.nests.map(nest =>
        nest.id === nestId
          ? { ...nest, status: 'working', assignedChickenId: chickenId, endTime }
          : nest
      ),
      activeProductions: {
        ...prev.activeProductions,
        [nestId]: {
          startTime: Date.now(),
          duration: productionTime,
          chickenId: chickenId
        }
      }
    }));

    // Close modal
    setChickenSelectionModal({ isOpen: false, nestId: null });
    
    showModal(
      'Chicken Assigned!', 
      `${chicken.nickname || chicken.speciesName} has been assigned to the nest and started working!`,
      'success'
    );
  };

  // NEW: Handle chicken details modal using global selection
  const handleViewChickenDetails = (chicken) => {
    selectChicken(chicken.id);
  };

  // Handle chicken recall
  const handleRecallChicken = (nestId) => {
    const nest = coop.nests.find(n => n.id === nestId);
    if (!nest) return;

    const chicken = myChickens.find(c => c.id === nest.assignedChickenId);
    
    // Update nest state
    setCoop(prev => ({
      ...prev,
      nests: prev.nests.map(n =>
        n.id === nestId
          ? { ...n, status: 'empty', assignedChickenId: null, endTime: null }
          : n
      ),
      activeProductions: Object.fromEntries(
        Object.entries(prev.activeProductions).filter(([key]) => key !== nestId.toString())
      )
    }));

    showModal(
      'Chicken Recalled', 
      `${chicken?.nickname || chicken?.speciesName || 'Your chicken'} has been recalled from the nest.`,
      'info'
    );
  };

  // Enhanced harvest report modal
  const showHarvestReport = (collectedItems, totalEarnings, hasSpecialProduct) => {
    const harvestContent = (
      <div className="harvest-report">
        <h3 className="harvest-title">🎉 Harvest Complete!</h3>
        
        {/* Collected Items List */}
        <div className="collected-items">
          <h4 className="items-title">Items Collected:</h4>
          <div className="items-list">
            {collectedItems.map((item, index) => (
              <div key={index} className="harvest-item">
                <span className="item-icon">{item.icon}</span>
                <span className="item-details">
                  <span className="item-name">{item.name}</span>
                  <span className="item-quantity">x{item.quantity}</span>
                </span>
              </div>
            ))}
            
            {/* Currency Gain - Highlighted */}
            <div className="harvest-item currency-item">
              <span className="item-icon">💰</span>
              <span className="item-details">
                <span className="item-name">ChickCoin</span>
                <span className="currency-amount">+{totalEarnings}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Special Product Notification */}
        {hasSpecialProduct && (
          <div className="miracle-notification">
            <span className="miracle-icon">✨</span>
            <p className="miracle-text">Miracle Product Bonus!</p>
          </div>
        )}
      </div>
    );

    setModal({
      isOpen: true,
      title: '',
      content: harvestContent,
      type: 'success'
    });
  };

  // Handle egg collection with enhanced rewards and cooldown
  const handleCollectEgg = (nestId) => {
    const nest = coop.nests.find(n => n.id === nestId);
    if (!nest) return;

    const chicken = myChickens.find(c => c.id === nest.assignedChickenId);
    if (!chicken) return;

    // Prepare collected items array
    const collectedItems = [];
    
    // Add basic egg to inventory and items list
    addEgg('common_egg_01');
    collectedItems.push({
      icon: '🥚',
      name: 'Common Egg',
      quantity: 1
    });
    
    // Calculate miracle product chance (base 5%, increased by environment and chicken stats)
    let miracleChance = 0.05;
    if (coop.environment === 'mystic') miracleChance += 0.05;
    
    const hasSpecialProduct = Math.random() < miracleChance;
    
    if (hasSpecialProduct) {
      // Add miracle product to inventory and items list
      addEgg('rare_egg_01'); // Add a rare egg as miracle product
      collectedItems.push({
        icon: '✨',
        name: 'Miracle Egg',
        quantity: 1
      });
    }

    // Set 24-hour production cooldown for the chicken
    const cooldownDuration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const cooldownUntil = Date.now() + cooldownDuration;

    // Update chicken with cooldown and reduced fullness
    setMyChickens(prev => 
      prev.map(c => 
        c.id === chicken.id 
          ? { 
              ...c, 
              fullness: Math.max(0, c.fullness - 20),
              cooldownUntil: cooldownUntil
            }
          : c
      )
    );

    // Calculate earnings (base 10, modified by chicken level and environment)
    const baseEarnings = 10;
    const levelBonus = chicken.level * 2;
    const environmentBonus = coop.environment === 'enriched' ? 5 : 0;
    const totalEarnings = baseEarnings + levelBonus + environmentBonus;
    
    addChickCoin(totalEarnings);

    // Reset nest to empty state
    setCoop(prev => ({
      ...prev,
      nests: prev.nests.map(n =>
        n.id === nestId
          ? { ...n, status: 'empty', assignedChickenId: null, endTime: null }
          : n
      ),
      activeProductions: Object.fromEntries(
        Object.entries(prev.activeProductions).filter(([key]) => key !== nestId.toString())
      )
    }));

    // Show enhanced harvest report
    showHarvestReport(collectedItems, totalEarnings, hasSpecialProduct);
  };

  // Enhanced nest unlocking with confirmation flow
  const handleUnlockNest = (nestId) => {
    const nest = coop.nests.find(n => n.id === nestId);
    if (!nest || nest.unlocked) return;

    const cost = nest.unlockCost || 5000;
    
    // Check if player has enough funds
    if (chickCoin < cost) {
      setModal({
        isOpen: true,
        title: 'Insufficient Funds',
        content: (
          <div className="insufficient-funds">
            <p>You need <strong>{cost.toLocaleString()}</strong> ChickCoin to unlock this nest.</p>
            <p>You currently have <strong>{chickCoin.toLocaleString()}</strong> ChickCoin.</p>
            <p className="funds-needed">Need <strong>{(cost - chickCoin).toLocaleString()}</strong> more ChickCoin.</p>
          </div>
        ),
        type: 'error'
      });
      return;
    }

    // Show confirmation dialog
    setModal({
      isOpen: true,
      title: 'Confirm Nest Unlock',
      content: (
        <div className="unlock-confirmation">
          <p>Are you sure you want to spend <strong>{cost.toLocaleString()}</strong> ChickCoin to unlock a new nest?</p>
          <p>This will expand your production capacity.</p>
          <div className="confirmation-buttons">
            <button 
              className="confirm-btn clay-btn-primary"
              onClick={() => confirmNestUnlock(nestId, cost)}
            >
              Confirm
            </button>
            <button 
              className="cancel-btn clay-btn-secondary"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      type: 'info'
    });
  };

  // Confirm nest unlock after user confirmation
  const confirmNestUnlock = (nestId, cost) => {
    // Spend currency and unlock nest
    spendChickCoin(cost);
    setCoop(prev => ({
      ...prev,
      nests: prev.nests.map(n =>
        n.id === nestId
          ? { ...n, unlocked: true, status: 'empty' }
          : n
      )
    }));

    // Show success message
    setModal({
      isOpen: true,
      title: 'Nest Unlocked!',
      content: (
        <div className="unlock-success">
          <span className="success-icon">🎉</span>
          <p>New nest unlocked for <strong>{cost.toLocaleString()}</strong> ChickCoin!</p>
          <p>You can now assign another chicken to work.</p>
        </div>
      ),
      type: 'success'
    });
  };

  // Check for completed productions
  useEffect(() => {
    if (!coop || !coop.nests) return;
    
    const checkProductions = () => {
      const now = Date.now();
      let hasUpdates = false;
      const updatedNests = coop.nests.map(nest => {
        if (nest.status === 'working' && nest.endTime && now >= nest.endTime) {
          hasUpdates = true;
          return { ...nest, status: 'ready' };
        }
        return nest;
      });

      if (hasUpdates) {
        setCoop(prev => ({
          ...prev,
          nests: updatedNests
        }));
      }
    };

    const interval = setInterval(checkProductions, 1000);
    return () => clearInterval(interval);
  }, [coop, coop?.nests, setCoop]);

  return (
    <div className="coop-page">
      {/* Page Header */}
      <div className="coop-header">
        <h1 className="coop-title">My Coop</h1>
        <p className="coop-subtitle">Manage your chicken empire</p>
      </div>

      {/* Tab Navigation */}
      <div className="coop-tabs">
        <button 
          className={`coop-tab ${activeTab === 'production' ? 'active' : ''}`}
          onClick={() => handleTabClick('production')}
        >
          Production
        </button>
        <button className="coop-tab disabled">
          Training
          <span className="tab-coming-soon">Coming Soon!</span>
        </button>
        <button className="coop-tab disabled">
          Evolution
          <span className="tab-coming-soon">Coming Soon!</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="coop-content">
        {activeTab === 'production' && (
          <div className="production-content">
            {/* Production Header */}
            <div className="production-header">
              <h2 className="production-title">The Fruitful Roost</h2>
              <p className="production-subtitle">Your chickens work hard to produce valuable eggs</p>
            </div>

            {/* Nest Area */}
            <div className="nest-area">
              <div className="nest-area-header">
                <h3 className="nest-area-title">Laying Nests</h3>
                <Tooltip 
                  text={environmentOptions.find(env => env.id === coop?.environment)?.description || 'Standard production environment'}
                  position="bottom"
                >
                  <button 
                    className="environment-controller"
                    onClick={handleEnvironmentChange}
                    title="Click to change environment"
                  >
                    {(() => {
                      const currentEnv = environmentOptions.find(env => env.id === coop?.environment);
                      const IconComponent = currentEnv?.icon || FaWind;
                      return (
                        <>
                          <IconComponent className="environment-icon" />
                          {currentEnv?.name || 'Standard Atmosphere'}
                        </>
                      );
                    })()}
                  </button>
                </Tooltip>
              </div>
              
              <div className="nests-grid">
                {coop?.nests?.map(nest => {
                  const assignedChicken = nest.assignedChickenId 
                    ? myChickens.find(c => c.id === nest.assignedChickenId)
                    : null;

                  return (
                    <NestCard
                      key={nest.id}
                      nest={nest}
                      assignedChicken={assignedChicken}
                      onAssignChicken={handleAssignChicken}
                      onRecallChicken={handleRecallChicken}
                      onCollectEgg={handleCollectEgg}
                      onUnlockNest={handleUnlockNest}
                    />
                  );
                }) || []}
              </div>
            </div>

            {/* Chicken Sidebar */}
            <div className="chicken-sidebar">
              <div className="sidebar-header">
                <h3 className="sidebar-title">Available Adults</h3>
                <p className="sidebar-subtitle">
                  {getAvailableChickens().length} chicken{getAvailableChickens().length !== 1 ? 's' : ''} ready to work
                </p>
              </div>
              
              <div className="chicken-list">
                {getAvailableChickens().length > 0 ? (
                  getAvailableChickens().map(chicken => {
                    const blueprint = getChickenBlueprint(chicken.blueprintId);
                    return (
                      <motion.div
                        key={chicken.id}
                        className="chicken-list-item"
                        whileHover={{ y: -2 }}
                        onClick={() => {
                          if (chickenSelectionModal.isOpen) {
                            confirmChickenAssignment(chicken.id);
                          } else {
                            handleViewChickenDetails(chicken);
                          }
                        }}
                      >
                        <div className="chicken-item-header">
                          <div className="chicken-item-avatar">
                            {blueprint?.art?.adult || '🐔'}
                          </div>
                          <div className="chicken-item-info">
                            <h4 className="chicken-item-name">
                              {chicken.nickname || chicken.speciesName}
                            </h4>
                            {chicken.nickname && (
                              <p className="chicken-item-species">
                                {chicken.speciesName || blueprint?.name}
                              </p>
                            )}
                          </div>
                          <div className="chicken-item-level">
                            Lv. {chicken.level}
                          </div>
                        </div>
                        <div className="chicken-item-stats">
                          <div className="chicken-stat">
                            💪 {chicken.current_stats?.str || 10}
                          </div>
                          <div className="chicken-stat">
                            ⚡ {chicken.current_stats?.agi || 10}
                          </div>
                          <div className="chicken-stat">
                            🛡️ {chicken.current_stats?.sta || 10}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="empty-chicken-list">
                    <span className="empty-chicken-emoji">🐣</span>
                    <h4 className="empty-chicken-title">No Adult Chickens</h4>
                    <p className="empty-chicken-description">
                      Level up your chickens to Level 5 to unlock production capabilities.
                    </p>
                  </div>
                )}
              </div>

              {/* Cooldown Chickens Section */}
              {getChickensInCooldown().length > 0 && (
                <div className="cooldown-chickens-section">
                  <div className="cooldown-section-title">
                    🕒 Resting Chickens ({getChickensInCooldown().length})
                  </div>
                  <div className="cooldown-chicken-list">
                    {getChickensInCooldown().map(chicken => {
                      const blueprint = getChickenBlueprint(chicken.blueprintId);
                      const timeLeft = chicken.cooldownUntil - Date.now();
                      const hoursLeft = Math.ceil(timeLeft / (1000 * 60 * 60));
                      
                      return (
                        <div key={chicken.id} className="cooldown-chicken-card">
                          <div className="chicken-list-item">
                            <div className="chicken-item-header">
                              <div className="chicken-item-avatar">
                                {blueprint?.art?.adult || '🐔'}
                              </div>
                              <div className="chicken-item-info">
                                <h4 className="chicken-item-name">
                                  {chicken.nickname || chicken.speciesName}
                                </h4>
                                <p className="cooldown-time">
                                  Resting for {hoursLeft}h
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="cooldown-overlay">
                            🕒 {hoursLeft}h
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Game Modal for notifications */}
      <GameModal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.content || modal.message}
        type={modal.type}
        onClose={closeModal}
      />

      {/* Improved Chicken Selection Modal */}
      <GameModal
        isOpen={chickenSelectionModal.isOpen}
        title="Select a Chicken for this Nest"
        message={
          <div className="chicken-selection-content">
            <p className="selection-instructions">Choose which adult chicken to assign to this nest:</p>
            <div className="chicken-selection-grid">
              {getAvailableChickens().map(chicken => {
                const blueprint = getChickenBlueprint(chicken.blueprintId);
                return (
                  <motion.div
                    key={chicken.id}
                    className="selectable-chicken-card"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => confirmChickenAssignment(chicken.id)}
                  >
                    <div className="chicken-card-avatar">
                      {blueprint?.art?.adult || '🐔'}
                    </div>
                    <div className="chicken-card-info">
                      <h4 className="chicken-card-name">
                        {chicken.nickname || chicken.speciesName}
                      </h4>
                      <p className="chicken-card-level">Level {chicken.level}</p>
                      <div className="chicken-card-stats">
                        <span className="stat">💪 {chicken.current_stats?.str || 10}</span>
                        <span className="stat">⚡ {chicken.current_stats?.agi || 10}</span>
                        <span className="stat">🛡️ {chicken.current_stats?.sta || 10}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        }
        type="info"
        onClose={() => setChickenSelectionModal({ isOpen: false, nestId: null })}
        showConfirmButton={false}
      />

                    {/* Chicken Details Modal now handled globally through HomePage */}
    </div>
  );
};

export default CoopPage; 