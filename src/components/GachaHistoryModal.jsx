import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaHistory, FaClock, FaEgg } from 'react-icons/fa';
import { GACHA_POOLS } from '../gameData/gachaSystem';
import { RARITY_CONFIG } from '../gameData/eggBlueprints';
import './GachaHistoryModal.css';

/**
 * GachaHistoryModal Component - Display pull history
 * Features chronological pull history with rarity highlighting and statistics
 */
const GachaHistoryModal = ({ 
  isOpen, 
  onClose, 
  pullHistory 
}) => {
  if (!isOpen) return null;

  // Calculate statistics
  const totalPulls = pullHistory.length;
  const totalEggs = pullHistory.reduce((sum, entry) => sum + entry.totalEggs, 0);
  
  // Count eggs by rarity
  const rarityStats = {};
  pullHistory.forEach(entry => {
    entry.eggs.forEach(egg => {
      const rarity = egg.rarity;
      rarityStats[rarity] = (rarityStats[rarity] || 0) + 1;
    });
  });

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const rarityOrder = ['LEGENDARY', 'EPIC', 'RARE', 'UNCOMMON', 'COMMON'];

  return (
    <AnimatePresence>
      <motion.div
        className="gacha-history-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="gacha-history-modal"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="history-header">
            <h2 className="history-title">
              <FaHistory className="history-icon" />
              Pull History
            </h2>
            <button className="history-close-btn" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          {/* Statistics Summary */}
          <div className="history-stats">
            <div className="stats-overview">
              <div className="stat-item">
                <span className="stat-label">Total Pulls</span>
                <span className="stat-value">{totalPulls}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Eggs</span>
                <span className="stat-value">{totalEggs}</span>
              </div>
            </div>

            {/* Rarity Breakdown */}
            {Object.keys(rarityStats).length > 0 && (
              <div className="rarity-stats">
                <h3 className="stats-title">Rarity Breakdown</h3>
                <div className="rarity-breakdown">
                  {rarityOrder.map(rarity => {
                    const count = rarityStats[rarity] || 0;
                    if (count === 0) return null;
                    const config = RARITY_CONFIG[rarity];
                    const percentage = totalEggs > 0 ? ((count / totalEggs) * 100).toFixed(1) : 0;
                    
                    return (
                      <div 
                        key={rarity} 
                        className={`rarity-stat rarity-${rarity.toLowerCase()}`}
                        style={{ '--rarity-color': config?.color || '#8B7D6B' }}
                      >
                        <span className="rarity-stat-name">{rarity}</span>
                        <span className="rarity-stat-count">{count}</span>
                        <span className="rarity-stat-percent">({percentage}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Pull History List */}
          <div className="history-content">
            {pullHistory.length === 0 ? (
              <div className="empty-history">
                <FaEgg className="empty-icon" />
                <h3>No Pull History</h3>
                <p>Your gacha pull history will appear here after you make your first pull.</p>
              </div>
            ) : (
              <div className="history-list">
                {pullHistory.map((entry, index) => {
                  const pool = GACHA_POOLS[entry.poolId];
                  const hasRareOrHigher = entry.eggs.some(egg => 
                    ['RARE', 'EPIC', 'LEGENDARY'].includes(egg.rarity)
                  );
                  
                  return (
                    <motion.div
                      key={entry.id}
                      className={`history-entry ${hasRareOrHigher ? 'has-rare' : ''}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {/* Entry Header */}
                      <div className="entry-header">
                        <div className="entry-info">
                          <span className="entry-type">
                            {entry.pullType === 'single' ? 'Single Pull' : '10-Pull'}
                          </span>
                          <span className="entry-pool">{pool?.name || 'Unknown Pool'}</span>
                        </div>
                        <div className="entry-time">
                          <FaClock className="time-icon" />
                          <span className="time-ago">{formatTimeAgo(entry.timestamp)}</span>
                          <span className="time-full">{formatDate(entry.timestamp)}</span>
                        </div>
                      </div>

                      {/* Entry Results */}
                      <div className="entry-results">
                        <div className="results-grid">
                          {entry.eggs.map((egg, eggIndex) => {
                            const config = RARITY_CONFIG[egg.rarity];
                            return (
                              <div 
                                key={eggIndex}
                                className={`result-egg rarity-${egg.rarity.toLowerCase()}`}
                                style={{ '--rarity-color': config?.color || '#8B7D6B' }}
                                title={`${egg.name} (${egg.rarity})`}
                              >
                                <span className="result-art">{egg.art}</span>
                                <span className="result-name">{egg.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="history-actions">
            <button className="history-close-action" onClick={onClose}>
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GachaHistoryModal; 