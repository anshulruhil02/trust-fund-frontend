'use client';

import React, { ReactNode } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { arbitrumSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { walletConnect, injected } from 'wagmi/connectors';
import { createWeb3Modal } from '@web3modal/wagmi/react';

// Get the Project ID from your environment variables
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

// --- NEW: Add a check for the Project ID ---
if (!projectId) {
  throw new Error("NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set in .env file");
}

// 1. Define metadatam
const metadata = {
  name: 'WorthyTrust',
  description: 'A platform for on-chain trust funds with accountability',
  url: 'http://localhost:3000', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

// 2. Create wagmi config
const config = createConfig({
  chains: [arbitrumSepolia],
  transports: {
    [arbitrumSepolia.id]: http()
  },
  connectors: [
    walletConnect({ projectId, metadata, showQrModal: false }),
    injected({ shimDisconnect: true }),
  ]
});

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true
});

// Create a new QueryClient for React Query
const queryClient = new QueryClient();

// Create the provider component
export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}