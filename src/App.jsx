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
import WelcomeModal from './components/WelcomeModal';
import { PlayerProvider, usePlayer } from './context/PlayerContext.jsx';
import { WalletContextProvider } from './contexts/WalletContextProvider';

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
 * Main App Content - Component that has access to PlayerContext
 */
const AppContent = () => {
  const { 
    isWelcomeModalOpen, 
    isWelcomeModalReopened, 
    closeWelcomeModal,
    isModalActive,
    startNewGame
  } = usePlayer();

  // Robust check: Does a save file actually exist in localStorage?
  // This is the most reliable way to determine if a game has been started
  const hasActiveGame = React.useMemo(() => {
    try {
      const saveData = localStorage.getItem('chicktopia-savegame');
      return saveData !== null;
    } catch (error) {
      console.warn('Error checking save data:', error);
      return false; // If error, assume no save file (show welcome modal)
    }
  }, []); // Only check once on component mount

  return (
    <>
      {/* If there is NO active game, show the Welcome Modal */}
      {!hasActiveGame && (
        <WelcomeModal 
          isOpen={true}
          onStartPlaying={startNewGame}
          isReopened={false}
        />
      )}

      {/* Reopened Welcome Modal - Shows when manually opened via About button */}
      {hasActiveGame && isWelcomeModalOpen && (
        <WelcomeModal 
          isOpen={isWelcomeModalOpen}
          onStartPlaying={closeWelcomeModal} // Close the reopened modal
          isReopened={isWelcomeModalReopened}
        />
      )}

      {/* If active game EXISTS, show the main game content */}
      {hasActiveGame && !isWelcomeModalOpen && (
        <>
          <div className={`app main-app-container ${isModalActive ? 'modal-is-open' : ''}`}>
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
          
          {/* Global Developer Tool - Fixed to bottom-right corner - Only in development mode */}
          {import.meta.env.DEV && <DevTool />}

          {/* Global Modals - Rendered at top level to work across all pages */}
          <GlobalModals />
        </>
      )}
    </>
  );
};

/**
 * Main App Component - Chicktopia Router
 * Handles routing between different pages while maintaining consistent layout
 * Also manages the Welcome Modal for first-time players
 * Now wrapped with Solana WalletContextProvider for Web3 functionality
 */
function App() {
  return (
    <WalletContextProvider>
      <PlayerProvider>
        <Router>
          <AppContent />
        </Router>
      </PlayerProvider>
    </WalletContextProvider>
  );
}

export default App;
