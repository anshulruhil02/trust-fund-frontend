// src/app/(dashboard)/layout.tsx
'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
// Make sure this path is correct based on your final folder structure
import DashboardHeader from './dashboard/components/DashboardHeader'; 

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // State management is moved from the page to the layout
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isBalancesHidden, setIsBalancesHidden] = useState(false);

  const handleWalletConnect = () => {
    setIsWalletConnected(true);
    setWalletAddress('0x742d35Cc6634C0532925a3b8D8B8b35A2E6f2A3B');
  };

  const handleWalletDisconnect = () => {
    setIsWalletConnected(false);
    setWalletAddress('');
  };

  const handleToggleBalances = () => {
    setIsBalancesHidden(!isBalancesHidden);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* The Header is rendered here, in the layout */}
      <DashboardHeader
        isWalletConnected={isWalletConnected}
        walletAddress={walletAddress}
        onWalletConnect={handleWalletConnect}
        onWalletDisconnect={handleWalletDisconnect}
        isBalancesHidden={isBalancesHidden}
        onToggleBalances={handleToggleBalances}
      />
      
      {/* The page content is rendered here */}
      <main>{children}</main>
    </Box>
  );
}
