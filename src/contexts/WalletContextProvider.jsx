import React, { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';

// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';

/**
 * WalletContextProvider Component - Provides Solana wallet functionality to the entire app
 * Supports Phantom and Solflare wallets with auto-connect functionality
 * Uses Devnet for development - change to Mainnet-beta for production
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components to wrap with wallet context
 */
export const WalletContextProvider = ({ children }) => {
    // Network configuration - using Mainnet for production
    const network = WalletAdapterNetwork.Mainnet;
    
    // Use custom Helius RPC endpoint for Mainnet
    const endpoint = 'https://mainnet.helius-rpc.com/?api-key=4fb05a4e-b999-4375-b303-6d4a57ad32d4';

    // Supported wallet adapters - Phantom and Solflare are the most popular
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter({ network }),
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}; 