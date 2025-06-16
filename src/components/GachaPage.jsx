import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlus, 
  FaHistory, 
  FaInfoCircle, 
  FaChevronDown, 
  FaTicketAlt,
  FaEgg,
  FaGrinStars,
  FaStar,
  FaGem
} from 'react-icons/fa';
import './GachaPage.css';
import { usePlayer } from '../context/PlayerContext.jsx';
import { 
  GACHA_POOLS, 
  performSingleRoll, 
  performTenPull, 
  createPullHistoryEntry 
} from '../gameData/gachaSystem';
import { EGG_BLUEPRINTS, RARITY_CONFIG } from '../gameData/eggBlueprints';
import TicketExchangeModal from './TicketExchangeModal';
import GachaDetailsModal from './GachaDetailsModal';
import GachaHistoryModal from './GachaHistoryModal';

/**
 * GachaPage Component - Immersive Card-Summoning Experience
 * Features: Full-screen stage, central summoning crystal, beautiful animations
 * NOW FULLY CONNECTED TO GLOBAL STATE
 */
const GachaPage = () => {
  // Global state from PlayerContext
  const {
    gachaTickets,
    chickCoin,
    pullHistory,
    pityCounters,
    spendGachaTickets,
    addGachaTickets,
    spendChickCoin,
    addEgg,
    addPullHistoryEntry,
    updatePityCounter
  } = usePlayer();

  // State management
  const [activePool, setActivePool] = useState('beginners_luck');
  const [isPoolDropdownOpen, setIsPoolDropdownOpen] = useState(false);
  
  // Modal states
  const [isTicketExchangeOpen, setIsTicketExchangeOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  
  // Gacha State Machine
  const [gachaState, setGachaState] = useState('idle'); // 'idle', 'drawing', 'revealing', 'claiming'
  const [summonedCards, setSummonedCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState(new Set());
  const [pullResults, setPullResults] = useState([]); // Store actual egg IDs
  const [currentDrawCount, setCurrentDrawCount] = useState(1); // Track number of cards being drawn

  // Pool data from gacha system
  const pools = GACHA_POOLS;

  // Generate real gacha results using the gacha system
  const generateGachaResults = (count, poolId) => {
    if (count === 1) {
      // Single pull
      const eggId = performSingleRoll(poolId);
      return eggId ? [eggId] : [];
    } else {
      // Ten pull with pity system
      const currentPity = pityCounters[poolId] || 0;
      const result = performTenPull(poolId, currentPity);
      
      // Update pity counter
      updatePityCounter(poolId, result.pityCounter);
      
      return result.eggs;
    }
  };

  // Handle pool selection
  const handlePoolSelect = (poolId) => {
    setActivePool(poolId);
    setIsPoolDropdownOpen(false);
  };

  // Handle ticket exchange
  const handleTicketExchange = (ticketAmount, costAmount) => {
    const success = spendChickCoin(costAmount);
    if (success) {
      addGachaTickets(ticketAmount);
    }
  };

  // Handle single draw
  const handleSingleDraw = () => {
    if (gachaState !== 'idle' || gachaTickets < 1) return;
    
    // Spend tickets
    const success = spendGachaTickets(1);
    if (!success) return;
    
    startSummoningSequence(1);
  };

  // Handle ten draw
  const handleTenDraw = () => {
    if (gachaState !== 'idle' || gachaTickets < 10) return;
    
    // Spend tickets
    const success = spendGachaTickets(10);
    if (!success) return;
    
    startSummoningSequence(10);
  };

  // Start the summoning sequence with real gacha results
  const startSummoningSequence = (cardCount) => {
    setGachaState('drawing');
    setFlippedCards(new Set());
    setCurrentDrawCount(cardCount);
    
    // Generate real results using gacha system
    const eggIds = generateGachaResults(cardCount, activePool);
    setPullResults(eggIds);
    
    // Convert egg IDs to card format for animation
    const results = eggIds.map((eggId, index) => ({
      id: `card_${Date.now()}_${index}`,
      eggId: eggId,
      rarity: 'unknown', // Will be revealed on flip
      color: '#ffffff',
      name: 'Mystery Egg',
      icon: 'FaEgg'
    }));
    
    // Create pull history entry
    const historyEntry = createPullHistoryEntry(
      eggIds, 
      cardCount === 1 ? 'single' : 'ten', 
      activePool
    );
    addPullHistoryEntry(historyEntry);
    
    // Phase A: Drawing animation with light beams (3 seconds)
    setTimeout(() => {
      setSummonedCards(results);
      setGachaState('revealing');
    }, 3000);
  };

  // Handle card flip with real egg reveal
  const handleCardFlip = (cardId) => {
    if (gachaState !== 'revealing') return;
    
    const newFlippedCards = new Set(flippedCards);
    newFlippedCards.add(cardId);
    setFlippedCards(newFlippedCards);
  };

  // Handle claim all - add eggs to inventory
  const handleClaimAll = () => {
    if (gachaState !== 'revealing') return;
    
    setGachaState('claiming');
    
    // Add all eggs to player inventory using the stored results
    pullResults.forEach(eggId => {
      addEgg(eggId);
    });
    
    // Return to idle after animation
    setTimeout(() => {
      setGachaState('idle');
      setSummonedCards([]);
      setFlippedCards(new Set());
      setPullResults([]);
      setCurrentDrawCount(1);
    }, 2000);
  };

  return (
    <div className="gacha-stage">
      {/* Immersive Background */}
      <div className="stage-background">
        <div className="stars-layer"></div>
        <div className="gradient-overlay"></div>
      </div>

      {/* Main UI */}
      <motion.div 
        className="main-ui"
        animate={{ 
          opacity: gachaState === 'drawing' ? 0.3 : 1,
          filter: gachaState === 'drawing' ? 'blur(2px)' : 'blur(0px)'
        }}
        transition={{ duration: 0.5 }}
      >
        {/* Top-Left Corner - Pool Selector */}
        <div className="pool-selector-corner">
          <motion.div 
            className="pool-dropdown"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button 
              className="pool-current"
              onClick={() => setIsPoolDropdownOpen(!isPoolDropdownOpen)}
              disabled={gachaState !== 'idle'}
            >
              <div className="pool-info">
                <span className="pool-name">{pools[activePool]?.name}</span>
                <span className="pool-desc">{pools[activePool]?.description}</span>
              </div>
              <motion.div
                animate={{ rotate: isPoolDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaChevronDown />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {isPoolDropdownOpen && (
                <motion.div
                  className="pool-options"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {Object.values(pools).map(pool => (
                    <button
                      key={pool.id}
                      className={`pool-option ${activePool === pool.id ? 'active' : ''}`}
                      onClick={() => handlePoolSelect(pool.id)}
                    >
                      <span className="pool-name">{pool.name}</span>
                      <span className="pool-desc">{pool.description}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Top-Right Corner - Details & History */}
        <div className="action-buttons-corner">
          <motion.button 
            className="corner-btn details-btn"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            disabled={gachaState !== 'idle'}
            onClick={() => setIsDetailsModalOpen(true)}
          >
            <FaInfoCircle />
          </motion.button>
          
          <motion.button 
            className="corner-btn history-btn"
            whileHover={{ scale: 1.1, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            disabled={gachaState !== 'idle'}
            onClick={() => setIsHistoryModalOpen(true)}
          >
            <FaHistory />
          </motion.button>
        </div>

        {/* Ticket Display - Top Center */}
        <div className="tickets-display-top">
          <motion.div 
            className="ticket-counter"
            whileHover={{ scale: 1.05 }}
          >
            <FaTicketAlt className="ticket-icon" />
            <span className="ticket-count">{gachaTickets}</span>
            <motion.button 
              className="ticket-add-btn"
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.8 }}
              disabled={gachaState !== 'idle'}
              onClick={() => setIsTicketExchangeOpen(true)}
            >
              <FaPlus />
            </motion.button>
          </motion.div>
        </div>

        {/* Central Content Container */}
        <div className="central-content">
          {/* The Centerpiece - Summoning Crystal */}
          <div className="summoning-altar">
            <motion.div 
              className="summoning-crystal"
              onClick={handleSingleDraw}
              style={{ cursor: gachaState === 'idle' ? 'pointer' : 'default' }}
              animate={{ 
                scale: gachaState === 'drawing' ? [1, 1.2, 1] : 1,
                rotateY: gachaState === 'drawing' ? [0, 360] : 0
              }}
              transition={{ 
                duration: gachaState === 'drawing' ? 3 : 0,
                repeat: gachaState === 'drawing' ? Infinity : 0
              }}
            >
              <div className="crystal-core">
                <motion.div
                  className="crystal-egg"
                  animate={{ 
                    scale: gachaState === 'drawing' ? [1, 1.3, 1] : 1,
                    filter: gachaState === 'drawing' ? 
                      ['brightness(1)', 'brightness(2)', 'brightness(1)'] : 'brightness(1)'
                  }}
                  transition={{ 
                    duration: 1,
                    repeat: gachaState === 'drawing' ? Infinity : 0
                  }}
                >
                  <FaEgg style={{ zIndex: 1 }} />
                </motion.div>

                {/* Floating Orbs */}
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="floating-orb"
                    animate={{
                      rotate: 360,
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      rotate: { duration: 8 + i, repeat: Infinity, ease: "linear" },
                      scale: { duration: 2 + i * 0.5, repeat: Infinity }
                    }}
                    style={{
                      '--orb-delay': `${i * 60}deg`,
                      zIndex: 3
                    }}
                  >
                    <FaGem />
                  </motion.div>
                ))}

                {/* Tap to Summon Text */}
                {gachaState === 'idle' && (
                  <motion.div
                    className="tap-to-summon"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Tap to Summon
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Bottom Center - Main Action Buttons */}
          <div className="main-actions">
            <motion.button
              className="draw-btn single-draw"
              whileHover={{ 
                scale: gachaState === 'idle' ? 1.05 : 1,
                boxShadow: gachaState === 'idle' ? "0 10px 30px rgba(76, 175, 80, 0.3)" : "none"
              }}
              whileTap={{ scale: gachaState === 'idle' ? 0.95 : 1 }}
              onClick={handleSingleDraw}
              disabled={gachaState !== 'idle' || gachaTickets < 1}
            >
              <div className="btn-content">
                <span className="btn-title">Summon x1</span>
                <span className="btn-cost">1 Ticket</span>
              </div>
              <motion.div
                className="btn-glow"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>

            <motion.button
              className="draw-btn ten-draw"
              whileHover={{ 
                scale: gachaState === 'idle' ? 1.05 : 1,
                boxShadow: gachaState === 'idle' ? "0 10px 30px rgba(212, 175, 55, 0.3)" : "none"
              }}
              whileTap={{ scale: gachaState === 'idle' ? 0.95 : 1 }}
              onClick={handleTenDraw}
              disabled={gachaState !== 'idle' || gachaTickets < 10}
            >
              <div className="btn-content">
                <span className="btn-title">Summon x10</span>
                <span className="btn-cost">10 Tickets</span>
                <span className="btn-guarantee">✨ Guarantees RARE or higher!</span>
              </div>
              <motion.div
                className="btn-glow golden"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Light Beam Animation */}
      <AnimatePresence>
        {gachaState === 'drawing' && (
          <div className="light-beam-container">
            {Array.from({ length: currentDrawCount }).map((_, index) => (
              <motion.div
                key={`beam-${index}`}
                className="light-beam"
                initial={{ 
                  x: 0, 
                  y: 0, 
                  scale: 0,
                  opacity: 0 
                }}
                animate={{ 
                  x: [0, Math.cos(index * 60 * Math.PI / 180) * 300, 0],
                  y: [0, Math.sin(index * 60 * Math.PI / 180) * 300, 0],
                  scale: [0, 1, 0.8],
                  opacity: [0, 1, 0.8]
                }}
                transition={{ 
                  duration: 2.5,
                  ease: "easeInOut",
                  delay: index * 0.1
                }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 100
                }}
              >
                <div className="beam-trail">
                  <FaStar className="beam-star" />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Card Reveal Ceremony */}
      <AnimatePresence>
        {gachaState === 'revealing' && (
          <motion.div
            className="card-reveal-ceremony"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className={`cards-grid ${pullResults.length === 1 ? 'single-pull' : ''}`}>
              {summonedCards.map((card, index) => {
                const isFlipped = flippedCards.has(card.id);
                const eggData = EGG_BLUEPRINTS[card.eggId];
                const rarityColor = eggData?.rarity ? RARITY_CONFIG[eggData.rarity]?.color || '#ffffff' : '#ffffff';
                
                return (
                  <motion.div
                    key={card.id}
                    className={`reveal-card ${isFlipped ? 'flipped' : ''}`}
                    initial={{ scale: 0, rotateY: 0 }}
                    animate={{ 
                      scale: 1, 
                      rotateY: isFlipped ? 180 : 0,
                      boxShadow: !isFlipped ? [
                        `0 0 20px ${rarityColor}`,
                        `0 0 40px ${rarityColor}`,
                        `0 0 20px ${rarityColor}`
                      ] : 'none'
                    }}
                    transition={{ 
                      delay: index * 0.1,
                      duration: 0.6,
                      type: "spring",
                      boxShadow: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                    onClick={() => handleCardFlip(card.id)}
                    style={{ '--rarity-color': rarityColor }}
                  >
                    <div className="card-front">
                      <FaEgg className="card-icon" />
                      <span className="card-name">Mystery</span>
                    </div>
                    <div className="card-back">
                      <div className="card-content">
                        <div className="result-egg">
                          {eggData?.art || '🥚'}
                        </div>
                        <span className="card-name">{eggData?.name || 'Unknown Egg'}</span>
                        <span className="card-rarity">{eggData?.rarity || 'COMMON'}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Claim All Button */}
            {flippedCards.size === summonedCards.length && summonedCards.length > 0 && (
              <motion.button
                className="claim-all-btn"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={handleClaimAll}
              >
                <FaGrinStars className="claim-icon" />
                Claim All
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <TicketExchangeModal
        isOpen={isTicketExchangeOpen}
        onClose={() => setIsTicketExchangeOpen(false)}
        currentChickCoin={chickCoin}
        currentTickets={gachaTickets}
        onExchange={handleTicketExchange}
      />

      <GachaDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        activePool={activePool}
      />

      <GachaHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        pullHistory={pullHistory}
      />
    </div>
  );
};

export default GachaPage; 