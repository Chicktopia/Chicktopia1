import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import all the components we've created
import TopNav from './components/TopNav';
import BottomNavigation from './components/BottomNavigation';
import HomePage from './components/HomePage';
import HatcheryPage from './components/HatcheryPage';
import BackpackPage from './components/BackpackPage';
import CoopPage from './components/CoopPage';
import GachaPage from './components/GachaPage';
import DevTool from './components/DevTool';
import DetailsPanel from './components/DetailsPanel';
import { PlayerProvider, usePlayer } from './context/PlayerContext.jsx';

/**
 * Global Modal Container - Handles modals that should appear across all pages
 */
const GlobalModals = () => {
  const { selectedChickenId, deselectChicken } = usePlayer();

  return (
    <>
      {/* Global ChickenDetails Modal */}
      <DetailsPanel
        isOpen={selectedChickenId !== null}
        chickenId={selectedChickenId}
        onClose={deselectChicken}
      />
    </>
  );
};

/**
 * Main App Component - Chicktopia Router
 * Handles routing between different pages while maintaining consistent layout
 */
function App() {
  return (
    <PlayerProvider>
      <Router>
        <div className="app">
          {/* Fixed Top Navigation Bar */}
          <TopNav />

          {/* Main Content Area - Routes */}
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/hatchery" element={<HatcheryPage />} />
              <Route path="/coop" element={<CoopPage />} />
              <Route path="/backpack" element={<BackpackPage />} />
              <Route path="/gacha" element={<GachaPage />} />
            </Routes>
          </main>
        </div>

        {/* Bottom Navigation Bar - Rendered outside app container for proper fixed positioning */}
        <BottomNavigation />
        
        {/* Global Developer Tool - Fixed to bottom-right corner */}
        <DevTool />

        {/* Global Modals - Rendered at top level to work across all pages */}
        <GlobalModals />
      </Router>
    </PlayerProvider>
  );
}

export default App;
