import React from 'react';
import ChickenCard from './ChickenCard'; // Import the ChickenCard component
import './ChickenGrid.css'; // Import component-specific styles
import { usePlayer } from '../context/PlayerContext.jsx';
import { getChickenBlueprint } from '../gameData/chickenBlueprints';

/**
 * ChickenGrid Component - Main content area displaying player's chickens
 * UPDATED: Now uses global state and blueprint system to display real chicken collection
 * @param {function} onChickenClick - Callback function when a chicken card is clicked
 */
const ChickenGrid = ({ onChickenClick }) => {
  
  // Get chickens from global player state
  const { myChickens } = usePlayer();

  // Convert chicken instances to display format
  const getChickenDisplayData = (chickenInstance) => {
    const blueprint = getChickenBlueprint(chickenInstance.blueprintId);
    if (!blueprint) return null;

    // Determine status based on fullness level
    let status = 'Normal';
    const fullness = chickenInstance.fullness || 85;
    if (fullness > 70) {
      status = 'Full';
    } else if (fullness >= 30) {
      status = 'Normal';
    } else {
      status = 'Hungry';
    }

    return {
      id: chickenInstance.id,
      nickname: chickenInstance.nickname, // Personal nickname from instance
      name: chickenInstance.speciesName || blueprint.name, // Species name from instance or blueprint
      level: chickenInstance.level,
      status: status,
      blueprint: blueprint,
      instance: chickenInstance
    };
  };

  // Convert all chicken instances to display format
  const chickens = myChickens
    .map(getChickenDisplayData)
    .filter(chicken => chicken !== null);

  // Handler for chicken card clicks
  const handleChickenClick = (chicken) => {
    console.log(`Clicked on chicken: ${chicken.name}`);
    // Call the parent callback if provided
    if (onChickenClick) {
      onChickenClick(chicken);
    }
  };

  return (
    <section className="chickens-section">
      <div className="chickens-container">
        {/* Section Title */}
        <div className="section-header">
          <h2 className="section-title">My Chickens</h2>
          <p className="section-subtitle">
            {chickens.length} {chickens.length === 1 ? 'chicken' : 'chickens'} in your coop
          </p>
        </div>

        {/* Responsive Grid of Chicken Cards */}
        <div className="chickens-grid">
          {chickens.map((chicken) => (
            <ChickenCard
              key={chicken.id}
              nickname={chicken.nickname}
              name={chicken.name}
              level={chicken.level}
              status={chicken.status}
              blueprint={chicken.blueprint}
              instance={chicken.instance}
              onClick={() => handleChickenClick(chicken)}
            />
          ))}
        </div>

        {/* Empty State Message (shown when no chickens) */}
        {chickens.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-content">
              <span className="empty-emoji">🥚</span>
              <h3 className="empty-title">No chickens yet!</h3>
              <p className="empty-description">
                Visit the Incubator to hatch your first chicken.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ChickenGrid; 