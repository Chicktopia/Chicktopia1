import React, { useState, useEffect } from 'react';
import { FaCoins, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, SystemProgram, Transaction, PublicKey } from '@solana/web3.js';
import GameModal from './GameModal';
import './AddCoinsModal.css';

/**
 * AddCoinsModal Component - Comprehensive ChickCoin purchase modal
 * Features real-time SOL to ChickCoin conversion with risk disclosure
 * Follows earthen claymorphism design principles
 */
const AddCoinsModal = ({ isOpen, onClose, onPurchaseConfirm }) => {
  // Wallet and connection hooks
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  
  // State for SOL input and calculated ChickCoin output
  const [solAmount, setSolAmount] = useState('');
  const [chickCoinAmount, setChickCoinAmount] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // State for transaction processing
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [transactionMessage, setTransactionMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Exchange rate constant
  const EXCHANGE_RATE = 1000000; // 1 SOL = 1,000,000 ChickCoin

  // Real-time calculation of ChickCoin based on SOL input
  useEffect(() => {
    const solValue = parseFloat(solAmount) || 0;
    setChickCoinAmount(Math.floor(solValue * EXCHANGE_RATE));
  }, [solAmount]);

  // Handle SOL input changes
  const handleSolInputChange = (e) => {
    const value = e.target.value;
    // Allow only positive numbers with up to 9 decimal places
    if (value === '' || /^\d*\.?\d{0,9}$/.test(value)) {
      setSolAmount(value);
    }
  };

  // Handle quick select buttons
  const handleQuickSelect = (amount) => {
    setSolAmount(amount.toString());
  };

  // Handle Get ChickCoin button click
  const handleGetChickCoin = () => {
    if (parseFloat(solAmount) > 0) {
      setShowConfirmation(true);
    }
  };

  // Handle confirmation modal with real blockchain transaction
  const handleConfirmPurchase = async () => {
    // Pre-flight checks
    if (!publicKey) {
      setErrorMessage("Wallet not connected!");
      setShowErrorModal(true);
      return;
    }

    if (!solAmount || parseFloat(solAmount) <= 0) {
      setErrorMessage("Invalid SOL amount!");
      setShowErrorModal(true);
      return;
    }

    // Add a loading state to disable UI
    setIsProcessing(true);

    try {
      // Define the recipient and amount
      const recipient = new PublicKey('C7yPSTrdkHu3Hm2xybSnYQv4RziEKrKvzeWsowhdCGzy');
      const solAmountFloat = parseFloat(solAmount);
      const amountInLamports = Math.floor(solAmountFloat * LAMPORTS_PER_SOL);

      console.log(`Initiating transaction: ${solAmountFloat} SOL (${amountInLamports} lamports) to ${recipient.toString()}`);

      // Create the transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipient,
          lamports: amountInLamports,
        })
      );

      // Set the recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      console.log("Sending transaction for user signing...");

      // Send the transaction to the wallet for signing
      const signature = await sendTransaction(transaction, connection);
      console.log("Transaction sent with signature:", signature);

      setTransactionMessage("Transaction sent! Confirming on blockchain...");

      // Confirm the transaction on the blockchain
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error(`Transaction failed: ${confirmation.value.err}`);
      }

      console.log("Transaction successfully confirmed!");

      // Grant in-game currency ONLY AFTER successful confirmation
      onPurchaseConfirm(chickCoinAmount);
      
      // Show success modal
      setTransactionMessage(`Purchase Successful! ${chickCoinAmount.toLocaleString()} ChickCoin has been added to your account.`);
      setShowSuccessModal(true);
      setShowConfirmation(false);

    } catch (error) {
      console.error("Transaction failed:", error);
      
      // Handle specific errors
      let userErrorMessage = "Transaction failed. Please try again.";
      
      if (error.message.includes("User rejected the request") || 
          error.message.includes("User declined") ||
          error.message.includes("rejected")) {
        userErrorMessage = "Transaction cancelled by user.";
      } else if (error.message.includes("Insufficient funds")) {
        userErrorMessage = "Insufficient SOL balance to complete this transaction.";
      } else if (error.message.includes("Network")) {
        userErrorMessage = "Network error. Please check your connection and try again.";
      }
      
      setErrorMessage(userErrorMessage);
      setShowErrorModal(true);
    } finally {
      // Remove loading state
      setIsProcessing(false);
    }
  };

  // Handle modal close and reset
  const handleClose = () => {
    setSolAmount('');
    setChickCoinAmount(0);
    setShowConfirmation(false);
    onClose();
  };

  // Format numbers with commas for display
  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  // Main modal content JSX
  const modalContent = (
    <div className="add-coins-modal-content">
      {/* Exchange Rate Display */}
      <div className="exchange-rate-section">
        <div className="exchange-rate-display">
          <FaCoins className="rate-icon" />
          <span className="rate-text">1 SOL = 1,000,000 ChickCoin</span>
        </div>
      </div>

      {/* Conversion Section */}
      <div className="conversion-section">
        <div className="input-group">
          <label className="input-label">
            <span className="sol-symbol">◎</span>
            Enter SOL Amount:
          </label>
          <input
            type="text"
            className="sol-input"
            value={solAmount}
            onChange={handleSolInputChange}
            placeholder="0.0"
            autoFocus
          />
        </div>

        <div className="output-group">
          <label className="output-label">You will receive:</label>
          <div className="chickcoin-output">
            <FaCoins className="output-icon" />
            <span className="output-amount">{formatNumber(chickCoinAmount)} ChickCoin</span>
          </div>
        </div>

        {/* Quick Select Buttons */}
        <div className="quick-select-section">
          <span className="quick-select-label">Quick Select:</span>
          <div className="quick-select-buttons">
            <button 
              className="quick-select-btn"
              onClick={() => handleQuickSelect(0.1)}
            >
              [ 0.1 SOL ]
            </button>
            <button 
              className="quick-select-btn"
              onClick={() => handleQuickSelect(0.5)}
            >
              [ 0.5 SOL ]
            </button>
            <button 
              className="quick-select-btn"
              onClick={() => handleQuickSelect(1)}
            >
              [ 1 SOL ]
            </button>
          </div>
        </div>
      </div>

      {/* Risk Disclosure Section */}
      <div className="risk-disclosure-section">
        <div className="risk-header">
          <FaExclamationTriangle className="warning-icon" />
          <span className="risk-title">Alpha Testing Notice:</span>
        </div>
        <div className="risk-content">
          <p>• This is an early Alpha version. Features are for testing purposes and may change.</p>
          <p>• <strong>Test Phase Data Reset:</strong> To ensure a fair and balanced official launch, all game data, including items and ChickCoin, will be periodically reset during the Alpha/Beta testing phases after major updates.</p>
          <p>• <strong>One-Way Exchange Only:</strong> Currently, you can only exchange SOL for in-game ChickCoin. This transaction is non-refundable and cannot be reversed.</p>
          <p>• <strong>Our Mainnet Promise:</strong> We solemnly promise that once the game is officially launched on Mainnet, all player data will be permanent and will <strong>never</strong> be reset.</p>
          <p className="risk-thanks">Thank you for helping us build Chicktopia!</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons-section">
        <button 
          className="cancel-btn"
          onClick={handleClose}
        >
          [ Cancel ]
        </button>
        <button 
          className="get-chickcoin-btn"
          onClick={handleGetChickCoin}
          disabled={!solAmount || parseFloat(solAmount) <= 0 || isProcessing}
        >
          {isProcessing ? (
            <>
              <FaSpinner className="spinning-icon" /> Processing...
            </>
          ) : (
            "[ Get ChickCoin! ]"
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Main Add Coins Modal */}
      <GameModal
        isOpen={isOpen && !showConfirmation}
        title="Add ChickCoin"
        icon={<FaCoins />}
        message={modalContent}
        onClose={handleClose}
        // Using custom content, so no default buttons
        customButtons={[]}
      />

      {/* Confirmation Modal */}
      <GameModal
        isOpen={showConfirmation}
        title="Confirm Purchase"
        icon={<FaCoins />}
        message={`Are you sure you want to exchange ${solAmount} SOL for ${formatNumber(chickCoinAmount)} ChickCoin?`}
        customButtons={[
          {
            text: "[ Cancel ]",
            onClick: () => setShowConfirmation(false),
            className: "cancel"
          },
          {
            text: isProcessing ? (
              <>
                <FaSpinner className="spinning-icon" /> Processing...
              </>
            ) : (
              "[ Confirm ]"
            ),
            onClick: handleConfirmPurchase,
            className: "confirm",
            disabled: isProcessing
          }
        ]}
        onClose={() => setShowConfirmation(false)}
      />

      {/* Transaction Success Modal */}
      <GameModal
        isOpen={showSuccessModal}
        title="Transaction Successful!"
        icon={<FaCoins />}
        type="success"
        message={transactionMessage}
        buttonText="[ Awesome! ]"
        onClose={() => {
          setShowSuccessModal(false);
          handleClose();
        }}
      />

      {/* Transaction Error Modal */}
      <GameModal
        isOpen={showErrorModal}
        title="Transaction Failed"
        icon={<FaExclamationTriangle />}
        type="error"
        message={errorMessage}
        buttonText="[ Try Again ]"
        onClose={() => setShowErrorModal(false)}
      />
    </>
  );
};

export default AddCoinsModal; 