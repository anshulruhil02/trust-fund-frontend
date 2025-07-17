// src/app/(dashboard)/dashboard/page.tsx
'use client';

import React from 'react';
import { Container, Box } from '@mui/material';
// Note: We no longer import DashboardHeader here
import SummaryCards from './components/SummaryCards';
import PortfolioChart from './components/PortfolioChart';
import NextPaymentCard from './components/NextPaymentCard';
import AssetAllocation from './components/AssetAllocation';
import PaymentTabs from './components/PaymentTabs';
import { 
  mockDashboardSummary, 
  mockPortfolioData, 
  mockAssetAllocation,
  mockUpcomingPayments,
  mockPaymentHistory,
  mockDeposits,
  mockActivityLog,
} from '@/utils/mockData'; // Assuming you have this mock data file

export default function DashboardPage() {
  // All state related to header (wallet, balances) has been moved to the layout.
  // This component now only cares about its own content.
  // For the MVP, we assume balance visibility is handled by components or passed down if needed.

  const handleClaimPayment = () => {
    console.log('Claiming payment...');
    alert('Payment claim initiated!');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Summary Cards */}
      <Box sx={{ mb: 4 }}>
        <SummaryCards
          totalPortfolioValue={mockDashboardSummary.totalPortfolioValue}
          totalDeposits={mockDashboardSummary.totalDeposits}
          totalReturns={mockDashboardSummary.totalReturns}
          returnPercentage={mockDashboardSummary.returnPercentage}
          isBalancesHidden={false} // This could be passed from layout if needed
        />
      </Box>

      {/* Two column layout */}
      <Box sx={{ display: 'flex', gap: 4, mb: 4, flexDirection: { xs: 'column', lg: 'row' } }}>
        <Box sx={{ flex: 2, minWidth: 0 }}>
          <PortfolioChart data={mockPortfolioData} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 300 }}>
          <AssetAllocation assets={mockAssetAllocation} isBalancesHidden={false} />
        </Box>
      </Box>

      {/* Next Payment Card */}
      <Box sx={{ mb: 4 }}>
        <NextPaymentCard
          amount={mockDashboardSummary.nextPayment.amount}
          date={mockDashboardSummary.nextPayment.date}
          type={mockDashboardSummary.nextPayment.type}
          onClaim={handleClaimPayment}
          isClaimable={true} // This could be passed from layout if needed
          isBalancesHidden={false}
        />
      </Box>

      {/* Payment Tabs */}
      <Box sx={{ mb: 4 }}>
        <PaymentTabs
          upcomingPayments={mockUpcomingPayments}
          paymentHistory={mockPaymentHistory}
          deposits={mockDeposits}
          activityLog={mockActivityLog}
          isBalancesHidden={false}
        />
      </Box>
    </Container>
  );
}
