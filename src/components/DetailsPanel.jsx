import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Import framer-motion for animations
import { useNavigate } from 'react-router-dom'; // Import navigation hook
import { FaTimes, FaUtensils, FaSmile, FaHeart } from 'react-icons/fa'; // Import icons
import StatGauge from './StatGauge'; // Import StatGauge component
import SelectFeedModal from './SelectFeedModal'; // Import SelectFeedModal
import GameModal from './GameModal'; // Import GameModal for level up notifications
import { usePlayer } from '../context/PlayerContext.jsx'; // Import player context
import { getChickenBlueprint } from '../gameData/chickenBlueprints'; // Import chicken blueprints
import './DetailsPanel.css'; // Import component-specific styles

/**
 * DetailsPanel Component - Sliding side panel for chicken details
 * Slides in from the right side with smooth animations using framer-motion
 * @param {Object} props - Component properties
 * @param {boolean} props.isOpen - Whether the panel is open
 * @param {string} props.chickenId - ID of the chicken to display (REFACTORED for reactive data)
 * @param {function} props.onClose - Function to close the panel
 */
const DetailsPanel = ({ isOpen, chickenId, onClose }) => {
  const navigate = useNavigate(); // Initialize navigation hook
  const { myChickens, setMyChickens, removeItem } = usePlayer(); // Get player functions
  
  // REFACTORED: Get chicken data reactively from global state
  const chicken = myChickens.find(c => c.id === chickenId);
  const blueprint = chicken ? getChickenBlueprint(chicken.blueprintId) : null;
  
  // State for SelectFeedModal
  const [isSelectFeedModalOpen, setIsSelectFeedModalOpen] = useState(false);
  
  // State for level up modal
  const [levelUpModal, setLevelUpModal] = useState({
    isOpen: false,
    title: '',
    message: ''
  });
  
  // Handler for navigating to the coop page
  const handleManageInCoop = () => {
    navigate('/coop');
    onClose(); // Close the modal after navigation
  };
  
  // Handler for opening the feed selection modal
  const handleFeedClick = () => {
    setIsSelectFeedModalOpen(true);
  };
  
  // Handler for closing the feed selection modal
  const handleCloseFeedModal = () => {
    setIsSelectFeedModalOpen(false);
  };
  
  // Handler for when feed is selected
  const handleFeedSelect = (feedItem) => {
    if (!chicken) return;
    
    // Apply feeding effects
    handleFeed(chicken, feedItem);
    
    // Close modals
    setIsSelectFeedModalOpen(false);
  };
  
  // Main feeding logic
  const handleFeed = (chickenInstance, feedItem) => {
    const blueprint = getChickenBlueprint(chickenInstance.blueprintId);
    if (!blueprint) return;
    
    // Get feed effects
    const effects = feedItem.blueprint.onUse;
    
    // Calculate happiness bonus for XP
    const happinessBonus = chickenInstance.happiness > 80 ? 1.05 : 1.0;
    const finalXpGain = Math.floor((effects.xp_gain || 0) * happinessBonus);
    
    // Create updated chicken instance
    const updatedChicken = {
      ...chickenInstance,
      xp: chickenInstance.xp + finalXpGain,
      happiness: Math.min(
        chickenInstance.max_happiness || 100, 
        chickenInstance.happiness + (effects.happiness_gain || 0)
      ),
      fullness: Math.min(100, (chickenInstance.fullness || 85) + 35), // Feeding restores fullness
      current_stats: {
        ...chickenInstance.current_stats,
        // Apply stat boost if present
        ...(effects.stat_boost && {
          [effects.stat_boost.stat.toLowerCase()]: 
            chickenInstance.current_stats[effects.stat_boost.stat.toLowerCase()] + effects.stat_boost.value
        })
      },
      lastFed: Date.now()
    };
    
    // Check for level up
    if (updatedChicken.xp >= updatedChicken.xp_to_next_level) {
      handleLevelUp(updatedChicken);
    } else {
      // Update chicken without level up
      setMyChickens(prev => 
        prev.map(c => c.id === chickenInstance.id ? updatedChicken : c)
      );
    }
    
    // Remove item from inventory
    removeItem(feedItem.id, 1);
  };
  
  // Level up logic
  const handleLevelUp = (chickenInstance) => {
    const blueprint = getChickenBlueprint(chickenInstance.blueprintId);
    if (!blueprint) return;
    
    const newLevel = chickenInstance.level + 1;
    const remainingXp = chickenInstance.xp - chickenInstance.xp_to_next_level;
    
    // Check if chicken reaches adulthood
    const newStage = newLevel >= (blueprint.adult_at_level || 5) && chickenInstance.stage === 'juvenile' 
      ? 'adult' 
      : chickenInstance.stage;
    
    // Create leveled up chicken
    const leveledUpChicken = {
      ...chickenInstance,
      level: newLevel,
      stage: newStage, // Update stage if necessary
      xp: remainingXp,
      xp_to_next_level: newLevel * 100, // XP needed for next level
      current_stats: {
        ...chickenInstance.current_stats,
        str: chickenInstance.current_stats.str + (blueprint.stats_per_level?.str || 2),
        agi: chickenInstance.current_stats.agi + (blueprint.stats_per_level?.agi || 2),
        sta: chickenInstance.current_stats.sta + (blueprint.stats_per_level?.sta || 2)
      }
    };
    
    // Update chicken in global state
    setMyChickens(prev => 
      prev.map(c => c.id === chickenInstance.id ? leveledUpChicken : c)
    );
    
    // Determine level up message based on whether chicken reached adulthood
    let levelUpMessage = `${chickenInstance.nickname || chickenInstance.speciesName || blueprint.name} reached level ${newLevel}! All stats increased!`;
    if (newStage === 'adult' && chickenInstance.stage === 'juvenile') {
      levelUpMessage += '\n\n🎊 Congratulations! Your chicken has reached adulthood and can now work in the Coop Production module!';
    }
    
    // Show level up modal
    setLevelUpModal({
      isOpen: true,
      title: '🎉 Level Up!',
      message: levelUpMessage
    });
  };
  
  // Animation variants for the modal
  const modalVariants = {
    closed: {
      scale: 0.8, // Start smaller
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    },
    open: {
      scale: 1, // Scale to normal size
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut'
      }
    }
  };

  // Animation variants for the backdrop
  const backdropVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.3
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  // Handle backdrop click to close panel
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key press
  React.useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevent body scroll when panel is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        /* Full-screen overlay container with flexbox centering */
        <motion.div
          className="modal-overlay"
          variants={backdropVariants}
          initial="closed"
          animate="open"
          exit="closed"
          onClick={handleBackdropClick}
        >
          {/* Main modal - centered by flexbox */}
          <motion.div
            className="details-modal"
            variants={modalVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            {/* Modal Header */}
            <div className="modal-header">
              <h2 className="modal-title">Chicken Details</h2>
              <button 
                className="close-btn clay-btn-icon" 
                onClick={onClose}
                aria-label="Close panel"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Content */}
            <div className="modal-content">
              {chicken ? (
                <>
                  {/* Chicken Avatar Section */}
                  <div className="chicken-avatar-section">
                    <div className="avatar-container">
                      <span className="avatar-emoji">
                        {chicken.stage === 'adult' ? blueprint?.art?.adult || '🐔' : blueprint?.art?.chick || '🐤'}
                      </span>
                      <div className="avatar-info">
                        <h3 className="chicken-detail-name">
                          {chicken.nickname || chicken.speciesName || blueprint?.name}
                        </h3>
                        {/* Show species name if nickname exists */}
                        {chicken.nickname && (
                          <p className="chicken-species-name">
                            {chicken.speciesName || blueprint?.name}
                          </p>
                        )}
                        {/* Rarity Tag */}
                        <div className={`rarity-tag rarity-${blueprint?.rarity?.toLowerCase() || 'common'}`}>
                          {blueprint?.rarity || 'COMMON'}
                        </div>
                        <span className="chicken-detail-level">Level {chicken.level}</span>
                        
                        {/* XP Progress Bar */}
                        <div className="xp-progress-container">
                          <div className="xp-progress-bar">
                            <div 
                              className="xp-progress-fill"
                              style={{ 
                                width: `${((chicken.xp || 0) / (chicken.xp_to_next_level || 100)) * 100}%` 
                              }}
                            ></div>
                          </div>
                          <span className="xp-text">
                            XP: {chicken.xp || 0} / {chicken.xp_to_next_level || 100}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status Gauges Section */}
                  <div className="status-gauges-section">
                    <div className="status-gauges-grid">
                      {/* Fullness Gauge */}
                      <StatGauge
                        icon={FaUtensils}
                        label="Fullness"
                        currentValue={chicken.fullness || 85}
                        maxValue={100}
                        color="purple"
                      />
                      
                      {/* Happiness Gauge */}
                      <StatGauge
                        icon={FaSmile}
                        label="Happiness"
                        currentValue={chicken.happiness || 0}
                        maxValue={chicken.max_happiness || 100}
                        color="orange"
                      />
                      
                      {/* Health Gauge */}
                      <StatGauge
                        icon={FaHeart}
                        label="Health"
                        currentValue={chicken.health || 100}
                        maxValue={100}
                        color="green"
                      />
                    </div>
                  </div>

                  {/* Stats & Abilities Section */}
                  <div className="stats-section">
                    <h4 className="section-title">Stats & Abilities</h4>
                    <div className="stats-horizontal-grid">
                      <div className="stat-block">
                        <span className="stat-icon">💪</span>
                        <span className="stat-value">{chicken.current_stats?.str || 10}</span>
                        <span className="stat-label">STRENGTH</span>
                      </div>
                      <div className="stat-block">
                        <span className="stat-icon">⚡</span>
                        <span className="stat-value">{chicken.current_stats?.agi || 10}</span>
                        <span className="stat-label">AGILITY</span>
                      </div>
                      <div className="stat-block">
                        <span className="stat-icon">🛡️</span>
                        <span className="stat-value">{chicken.current_stats?.sta || 10}</span>
                        <span className="stat-label">STAMINA</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="no-chicken-selected">
                  <span className="no-chicken-emoji">🤔</span>
                  <p>No chicken selected</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="modal-actions">
              <button 
                className="action-btn clay-btn-primary"
                onClick={handleFeedClick}
              >
                <span>🌾 Feed</span>
              </button>
              <button 
                className="action-btn clay-btn-secondary"
                onClick={handleManageInCoop}
              >
                <span>🏡 Manage in Coop</span>
              </button>
            </div>
            
            {/* SelectFeedModal */}
            <SelectFeedModal
              isOpen={isSelectFeedModalOpen}
              chicken={chicken}
              onFeedSelect={handleFeedSelect}
              onClose={handleCloseFeedModal}
            />
            
            {/* Level Up Modal */}
            <GameModal
              isOpen={levelUpModal.isOpen}
              title={levelUpModal.title}
              message={levelUpModal.message}
              type="success"
              showConfirmButton={true}
              confirmText="Awesome!"
              onConfirm={() => setLevelUpModal({ isOpen: false, title: '', message: '' })}
              onClose={() => setLevelUpModal({ isOpen: false, title: '', message: '' })}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DetailsPanel; 