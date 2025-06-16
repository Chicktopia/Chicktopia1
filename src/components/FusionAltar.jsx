import React, { useState } from 'react';
import './FusionAltar.css';
import { usePlayer } from '../context/PlayerContext.jsx';
import { getEggBlueprint, canFuseEggs, getFusionResult } from '../gameData/eggBlueprints';
import EggSelectionModal from './EggSelectionModal';
import GameModal from './GameModal';

/**
 * FusionAltar Component - Allows players to fuse 3 identical eggs into a higher rarity egg
 * Uses the blueprint system to determine fusion results
 */
const FusionAltar = () => {
  const { myEggs, setMyEggs } = usePlayer();
  
  // Fusion altar state - 3 offering slots + 1 result slot
  const [fusionSlots, setFusionSlots] = useState([
    { id: 1, eggId: null },
    { id: 2, eggId: null },
    { id: 3, eggId: null }
  ]);

  // Modal states
  const [eggSelectionModal, setEggSelectionModal] = useState({
    isOpen: false,
    targetSlotId: null
  });

  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  // Show modal helper
  const showModal = (title, message, type = 'info') => {
    setModal({ isOpen: true, title, message, type });
  };

  // Close modal helper
  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  // Handle clicking on an empty fusion slot
  const handleSlotClick = (slotId) => {
    setEggSelectionModal({
      isOpen: true,
      targetSlotId: slotId
    });
  };

  // Handle egg selection for fusion slot
  const handleEggSelectForFusion = (slotId, eggId) => {
    // Find the selected egg
    const selectedEgg = myEggs.find(egg => egg.id === eggId);
    if (!selectedEgg) {
      showModal('Error', 'Selected egg not found!', 'error');
      return;
    }

    // Update fusion slot with egg ID and blueprint ID
    setFusionSlots(prev => 
      prev.map(slot => 
        slot.id === slotId 
          ? { ...slot, eggId: eggId, blueprintId: selectedEgg.blueprintId }
          : slot
      )
    );

    // Remove egg from inventory
    setMyEggs(prev => prev.filter(egg => egg.id !== eggId));

    // Close modal
    setEggSelectionModal({ isOpen: false, targetSlotId: null });
  };

  // Remove egg from fusion slot (return to inventory)
  const handleRemoveFromSlot = (slotId) => {
    const slot = fusionSlots.find(s => s.id === slotId);
    if (!slot || !slot.eggId) return;

    // Find the egg instance that was in this slot
    const eggInstance = { id: slot.eggId, blueprintId: slot.blueprintId };

    // Return egg to inventory
    setMyEggs(prev => [...prev, eggInstance]);

    // Clear fusion slot
    setFusionSlots(prev => 
      prev.map(s => 
        s.id === slotId 
          ? { ...s, eggId: null, blueprintId: null }
          : s
      )
    );
  };

  // Check if fusion is possible
  const canFuse = () => {
    // All slots must be filled
    const filledSlots = fusionSlots.filter(slot => slot.eggId !== null);
    if (filledSlots.length !== 3) return false;

    // Create egg instances for fusion check
    const eggInstances = filledSlots.map(slot => ({
      id: slot.eggId,
      blueprintId: slot.blueprintId
    }));

    return canFuseEggs(eggInstances);
  };

  // Handle fusion process
  const handleFusion = () => {
    if (!canFuse()) {
      showModal('Cannot Fuse', 'You need 3 identical eggs to perform fusion!', 'warning');
      return;
    }

    // Get the blueprint ID from the first slot (they're all the same)
    const firstSlot = fusionSlots.find(slot => slot.eggId !== null);
    const fusionResult = getFusionResult(firstSlot.blueprintId);

    if (!fusionResult) {
      showModal('Fusion Failed', 'These eggs cannot be fused further!', 'error');
      return;
    }

    // Create new fused egg instance
    const newEggId = `egg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fusedEgg = {
      id: newEggId,
      blueprintId: fusionResult
    };

    // Add fused egg to inventory
    setMyEggs(prev => [...prev, fusedEgg]);

    // Clear all fusion slots
    setFusionSlots([
      { id: 1, eggId: null },
      { id: 2, eggId: null },
      { id: 3, eggId: null }
    ]);

    // Get result egg name for success message
    const resultBlueprint = getEggBlueprint(fusionResult);
    const resultName = resultBlueprint ? resultBlueprint.name : 'Unknown Egg';

    showModal('Fusion Successful!', `Your eggs have been fused into a ${resultName}! ✨`, 'success');
  };

  // Close egg selection modal
  const closeEggSelectionModal = () => {
    setEggSelectionModal({ isOpen: false, targetSlotId: null });
  };

  return (
    <div className="fusion-altar">
      <h3 className="fusion-title">Egg Fusion Altar</h3>
      
      {/* Offering Slots */}
      <div className="fusion-offering-slots">
        {fusionSlots.map(slot => {
          const hasEgg = slot.eggId !== null;
          const blueprint = hasEgg ? getEggBlueprint(slot.blueprintId) : null;
          
          return (
            <div 
              key={slot.id}
              className={`fusion-slot offering-slot ${hasEgg ? 'filled' : 'empty'}`}
              onClick={() => hasEgg ? handleRemoveFromSlot(slot.id) : handleSlotClick(slot.id)}
            >
              {hasEgg && blueprint ? (
                <div className="fusion-egg">
                  <div className="fusion-egg-art">{blueprint.art}</div>
                  <div className="fusion-egg-name">{blueprint.name}</div>
                </div>
              ) : (
                <div className="fusion-slot-placeholder">
                  <span className="fusion-plus">+</span>
                  <span className="fusion-text">Place Egg</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Result Preview */}
      <div className="fusion-result-area">
        <div className="fusion-arrow">↓</div>
        <div className="fusion-result-slot">
          {canFuse() ? (
            (() => {
              const firstSlot = fusionSlots.find(slot => slot.eggId !== null);
              const fusionResult = getFusionResult(firstSlot.blueprintId);
              const resultBlueprint = fusionResult ? getEggBlueprint(fusionResult) : null;
              
              return resultBlueprint ? (
                <div className="fusion-result-preview">
                  <div className="fusion-result-art">{resultBlueprint.art}</div>
                  <div className="fusion-result-name">{resultBlueprint.name}</div>
                </div>
              ) : (
                <div className="fusion-result-placeholder">
                  <span>?</span>
                </div>
              );
            })()
          ) : (
            <div className="fusion-result-placeholder">
              <span>?</span>
            </div>
          )}
        </div>
      </div>

      {/* Fusion Button */}
      <button 
        className={`fusion-button ${canFuse() ? 'active' : 'inactive'}`}
        onClick={handleFusion}
        disabled={!canFuse()}
      >
        Fuse Eggs ✨
      </button>

      {/* Egg Selection Modal */}
      {eggSelectionModal.isOpen && (
        <EggSelectionModal
          isOpen={eggSelectionModal.isOpen}
          onClose={closeEggSelectionModal}
          onSelectEgg={(eggId) => handleEggSelectForFusion(eggSelectionModal.targetSlotId, eggId)}
          eggs={myEggs}
          title="Select Egg for Fusion"
        />
      )}

      {/* Notification Modal */}
      {modal.isOpen && (
        <GameModal
          isOpen={modal.isOpen}
          onClose={closeModal}
          title={modal.title}
          message={modal.message}
          type={modal.type}
        />
      )}
    </div>
  );
};

export default FusionAltar; 