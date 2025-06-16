import React from 'react';
import { motion } from 'framer-motion'; // Import framer-motion for smooth animations
import { FaClipboardList, FaGift } from 'react-icons/fa'; // Import icons from react-icons
import { useNavigate } from 'react-router-dom'; // Import navigation hook
import './FeatureCard.css'; // Import component-specific styles

/**
 * FeatureCard Component - Individual feature card with claymorphism design
 * Includes hover animations and smooth transitions using framer-motion
 * @param {Object} props - Component properties
 * @param {string} props.icon - Icon type for the card ('incubator', 'tasks', 'gacha')  
 * @param {string} props.title - Main title text
 * @param {string} props.subtitle - Subtitle/description text
 * @param {function} props.onClick - Click handler function
 */
const FeatureCard = ({ icon, title, subtitle, onClick }) => {
  
  // Function to render appropriate icon based on icon prop
  const renderIcon = () => {
    switch (icon) {
      case 'incubator':
        return <span className="feature-icon-plus">+</span>;
      case 'tasks':
        return <FaClipboardList className="feature-icon" />;
      case 'gacha':
        return <FaGift className="feature-icon" />;
      default:
        return <span className="feature-icon-plus">+</span>;
    }
  };

  return (
    <motion.div
      className="feature-card clay-card"
      onClick={onClick}
      // Framer Motion hover animation - lift and scale effect
      whileHover={{ 
        y: -8, // Move up 8px
        scale: 1.05, // Scale up by 5%
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      // Framer Motion tap animation - slight press effect
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      // Initial animation when component mounts
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Icon section at top of card */}
      <div className="feature-icon-container">
        {renderIcon()}
      </div>

      {/* Text content section */}
      <div className="feature-content">
        <h3 className="feature-title">{title}</h3>
        <p className="feature-subtitle">{subtitle}</p>
      </div>
    </motion.div>
  );
};

/**
 * FeatureCardsContainer Component - Horizontal scrollable container for feature cards
 * Contains three main feature cards: Incubator, Tasks, and Gacha Machine
 */
const FeatureCardsContainer = () => {
  const navigate = useNavigate(); // Initialize navigation hook
  
  // Sample data for the three feature cards
  const featureData = [
    {
      id: 'incubator',
      icon: 'incubator',
      title: 'Incubator',
      subtitle: '(2/4) Eggs Hatching'
    },
    {
      id: 'tasks',
      icon: 'tasks', 
      title: 'Tasks (3)',
      subtitle: 'Daily / Weekly'
    },
    {
      id: 'gacha',
      icon: 'gacha',
      title: 'Gacha Machine',
      subtitle: 'Single | 10-Pull'
    }
  ];

  // Click handler for feature cards
  const handleFeatureClick = (featureId) => {
    console.log(`Clicked on ${featureId} feature`);
    
    // Navigate to appropriate pages
    if (featureId === 'incubator') {
      navigate('/hatchery'); // Navigate to hatchery page
    } else if (featureId === 'gacha') {
      navigate('/gacha'); // Navigate to gacha page
    } else {
      // TODO: Implement navigation for other features
      console.log(`Navigation for ${featureId} not yet implemented`);
    }
  };

  return (
    <section className="features-section">
      {/* Section container with horizontal scroll */}
      <div className="features-container">
        <div className="features-scroll">
          {/* Map through feature data to create cards */}
          {featureData.map((feature) => (
            <FeatureCard
              key={feature.id}
              icon={feature.icon}
              title={feature.title}
              subtitle={feature.subtitle}
              onClick={() => handleFeatureClick(feature.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCardsContainer;
export { FeatureCard }; // Export individual card component for reuse 