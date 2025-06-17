import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import './WalletConnectButton.css';

/**
 * WalletConnectButton Component - Solana wallet connection interface
 * Uses the official WalletMultiButton from @solana/wallet-adapter-react-ui
 * Handles all wallet states: Connect, Select Wallet, Connected (shows address)
 * Wraps the button with custom styling to match our earthen claymorphism theme
 */
export const WalletConnectButton = () => {

    return (
        <div className="wallet-button-container">
            {/* 
            The WalletMultiButton handles everything automatically:
            - Shows "Select Wallet" when not connected
            - Opens wallet selection modal
            - Shows truncated public key when connected
            - Provides disconnect functionality
            */}
            <WalletMultiButton />
        </div>
    );
}; 