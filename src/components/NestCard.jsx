import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaClock, FaHeart, FaTint } from 'react-icons/fa';
import { getChickenBlueprint } from '../gameData/chickenBlueprints';
import './NestCard.css';

/**
 * NestCard Component - Individual nest for chicken production
 * Handles multiple states: empty, working, ready, locked
 * @param {Object} props - Component properties
 * @param {Object} props.nest - Nest data object
 * @param {Object} props.assignedChicken - Chicken instance if assigned
 * @param {Function} props.onAssignChicken - Callback for assigning chicken
 * @param {Function} props.onRecallChicken - Callback for recalling chicken
 * @param {Function} props.onCollectEgg - Callback for collecting produce
 * @param {Function} props.onUnlockNest - Callback for unlocking nest
 * @param {Function} props.onUpgradeNest - Callback for upgrading nest
 */
const NestCard = ({
  nest,
  assignedChicken,
  onAssignChicken,
  onRecallChicken,
  onCollectEgg,
  onUnlockNest,
  onUpgradeNest
}) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [progress, setProgress] = useState(0);

  // Get chicken blueprint if assigned
  const chickenBlueprint = assignedChicken ? getChickenBlueprint(assignedChicken.blueprintId) : null;

  // Timer effect for working state
  useEffect(() => {
    if (nest.status === 'working' && nest.endTime) {
      const updateTimer = () => {
        const now = Date.now();
        const timeLeft = nest.endTime - now;
        
        if (timeLeft <= 0) {
          setTimeRemaining('Ready!');
          setProgress(100);
          return;
        }

        // Calculate progress (assuming 2 hour production time)
        const totalDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
        const elapsed = totalDuration - timeLeft;
        const progressPercent = Math.min(100, (elapsed / totalDuration) * 100);
        setProgress(progressPercent);

        // Format time remaining
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        setTimeRemaining(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [nest.status, nest.endTime]);

  // Render locked state
  if (!nest.unlocked) {
    return (
      <motion.div
        className="nest-card locked"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onUnlockNest(nest.id)}
      >
        <div className="nest-content">
          <div className="lock-icon">
            <FaLock />
          </div>
          <h3 className="nest-title">Locked Nest</h3>
          <p className="unlock-cost">{nest.unlockCost?.toLocaleString()} ChickCoin</p>
          <button className="unlock-button">
            [ + Unlock ]
          </button>
        </div>
      </motion.div>
    );
  }

  // Render empty state
  if (nest.status === 'empty') {
    return (
      <motion.div
        className="nest-card empty"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onAssignChicken(nest.id)}
      >
        <div className="nest-content">
          <div className="nest-icon">🏠</div>
          <h3 className="nest-title">Empty Nest</h3>
          <p className="nest-description">No chicken assigned</p>
          <button className="assign-button">
            [ + Assign Chicken ]
          </button>
          {nest.level > 1 && (
            <div className="nest-level">Level {nest.level}</div>
          )}
        </div>
      </motion.div>
    );
  }

  // Render working state
  if (nest.status === 'working') {
    // Get chicken rarity for glow effect
    const chickenRarity = chickenBlueprint?.rarity?.toLowerCase() || 'common';
    
    return (
      <motion.div className={`nest-card working working-${chickenRarity}`}>
        <div className="nest-content">
          {/* Chicken Info Header */}
          <div className="chicken-info">
            <div className="chicken-avatar">
              {chickenBlueprint?.art?.adult || '🐔'}
            </div>
            <div className="chicken-details">
              <h4 className="chicken-name">
                {assignedChicken?.nickname || assignedChicken?.speciesName || 'Unknown'}
              </h4>
              <span className="chicken-level">Lv. {assignedChicken?.level || 1}</span>
            </div>
          </div>

          {/* Progress Section */}
          <div className="production-progress">
            <div className="progress-header">
              <FaClock className="progress-icon" />
              <span className="progress-title">Laying Egg</span>
            </div>
            
            <div className="egg-progress-container">
              <div className="egg-shape">
                <div 
                  className="egg-fill"
                  style={{ height: `${progress}%` }}
                />
                <div className="egg-timer">{timeRemaining}</div>
              </div>
            </div>
            
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Chicken Status Gauges */}
          <div className="chicken-gauges">
            <div className="gauge">
              <FaHeart className="gauge-icon health" />
              <div className="gauge-bar">
                <div 
                  className="gauge-fill health"
                  style={{ width: `${assignedChicken?.health || 100}%` }}
                />
              </div>
              <span className="gauge-value">{assignedChicken?.health || 100}</span>
            </div>
            
            <div className="gauge">
              <span className="gauge-icon">😊</span>
              <div className="gauge-bar">
                <div 
                  className="gauge-fill happiness"
                  style={{ width: `${(assignedChicken?.happiness || 80) / (assignedChicken?.max_happiness || 100) * 100}%` }}
                />
              </div>
              <span className="gauge-value">{assignedChicken?.happiness || 80}</span>
            </div>
            
            <div className="gauge">
              <FaTint className="gauge-icon fullness" />
              <div className="gauge-bar">
                <div 
                  className="gauge-fill fullness"
                  style={{ width: `${assignedChicken?.fullness || 85}%` }}
                />
              </div>
              <span className="gauge-value">{assignedChicken?.fullness || 85}</span>
            </div>
          </div>

          {/* Action Button */}
          <button 
            className="recall-button"
            onClick={() => onRecallChicken(nest.id)}
          >
            [ Recall ]
          </button>
        </div>
      </motion.div>
    );
  }

  // Render ready state
  if (nest.status === 'ready') {
    return (
      <motion.div 
        className="nest-card ready"
        animate={{ 
          boxShadow: [
            '0 0 20px rgba(255, 215, 0, 0.5)',
            '0 0 30px rgba(255, 215, 0, 0.8)',
            '0 0 20px rgba(255, 215, 0, 0.5)'
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="nest-content">
          {/* Chicken Info Header */}
          <div className="chicken-info">
            <div className="chicken-avatar">
              {chickenBlueprint?.art?.adult || '🐔'}
            </div>
            <div className="chicken-details">
              <h4 className="chicken-name">
                {assignedChicken?.nickname || assignedChicken?.speciesName || 'Unknown'}
              </h4>
              <span className="chicken-level">Lv. {assignedChicken?.level || 1}</span>
            </div>
          </div>

          {/* Ready Egg Display */}
          <div className="ready-egg-container">
            <motion.div 
              className="ready-egg"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              🥚
            </motion.div>
            <h3 className="ready-title">Egg Ready!</h3>
            <p className="ready-description">Your chicken has laid an egg</p>
          </div>

          {/* Collect Button */}
          <motion.button 
            className="collect-button"
            onClick={() => onCollectEgg(nest.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            [ Collect ]
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Default fallback
  return (
    <div className="nest-card error">
      <div className="nest-content">
        <h3>Unknown State</h3>
        <p>Nest status: {nest.status}</p>
      </div>
    </div>
  );
};

export default NestCard; 