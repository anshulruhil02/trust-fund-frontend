// src/app/page.tsx
'use client';

import React, { useState } from 'react';
import { Container, Box } from '@mui/material';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import SummaryCards from '@/components/dashboard/SummaryCards';
import PortfolioChart from '@/components/dashboard/PortfolioChart';
import NextPaymentCard from '@/components/dashboard/NextPaymentCard';
import AssetAllocation from '@/components/dashboard/AssetAllocation';
import PaymentTabs from '@/components/dashboard/PaymentTabs';
import { 
  mockDashboardSummary, 
  mockPortfolioData, 
  mockAssetAllocation,
  mockUpcomingPayments,
  mockPaymentHistory,
  mockDeposits,
  mockActivityLog,
  mockTransactions
} from '@/utils/mockData';

export default function DashboardPage() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isBalancesHidden, setIsBalancesHidden] = useState(false);

  const handleWalletConnect = () => {
    // Mock wallet connection - replace with Fireblocks integration later
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

  const handleClaimPayment = () => {
    console.log('Claiming payment...');
    // TODO: Implement actual claim logic with smart contracts
    alert('Payment claim initiated! (This will integrate with smart contracts later)');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <DashboardHeader
        isWalletConnected={isWalletConnected}
        walletAddress={walletAddress}
        onWalletConnect={handleWalletConnect}
        onWalletDisconnect={handleWalletDisconnect}
        isBalancesHidden={isBalancesHidden}
        onToggleBalances={handleToggleBalances}
      />
      
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Summary Cards */}
        <Box sx={{ mb: 4 }}>
          <SummaryCards
            totalPortfolioValue={mockDashboardSummary.totalPortfolioValue}
            totalDeposits={mockDashboardSummary.totalDeposits}
            totalReturns={mockDashboardSummary.totalReturns}
            returnPercentage={mockDashboardSummary.returnPercentage}
            isBalancesHidden={isBalancesHidden}
          />
        </Box>

        {/* Two column layout for chart and allocation */}
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 4, 
            mb: 4,
            flexDirection: { xs: 'column', lg: 'row' }
          }}
        >
          {/* Portfolio Chart - Takes 2/3 width */}
          <Box sx={{ flex: 2, minWidth: 0 }}>
            <PortfolioChart
              data={mockPortfolioData}
              performancePercentage={5.46}
            />
          </Box>

          {/* Asset Allocation - Takes 1/3 width */}
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <AssetAllocation 
              assets={mockAssetAllocation} 
              isBalancesHidden={isBalancesHidden}
            />
          </Box>
        </Box>

        {/* Next Payment Card */}
        <Box sx={{ mb: 4 }}>
          <NextPaymentCard
            amount={mockDashboardSummary.nextPayment.amount}
            date={mockDashboardSummary.nextPayment.date}
            type={mockDashboardSummary.nextPayment.type}
            onClaim={handleClaimPayment}
            isClaimable={isWalletConnected}
            isBalancesHidden={isBalancesHidden}
          />
        </Box>

        {/* Payment Tabs */}
        <Box sx={{ mb: 4 }}>
          <PaymentTabs
            upcomingPayments={mockUpcomingPayments}
            paymentHistory={mockPaymentHistory}
            deposits={mockDeposits}
            activityLog={mockActivityLog}
            isBalancesHidden={isBalancesHidden}
          />
        </Box>
      </Container>
    </Box>
  );
}