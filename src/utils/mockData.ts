// src/utils/mockData.ts
import { 
  TrustFund, 
  Transaction, 
  AssetAllocation, 
  PortfolioData, 
  DashboardSummary 
} from '@/types/trust-fund';

export const mockTrustFunds: TrustFund[] = [
  {
    id: '1',
    name: "Emma's Education Fund",
    totalValue: 25000,
    currency: 'USDC',
    beneficiary: 'Emma Thompson',
    releaseSchedule: 'Monthly',
    nextRelease: '2025-08-15',
    amountPerRelease: 1000,
    fundsRemaining: 24000,
    status: 'Active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Emergency Family Fund',
    totalValue: 50000,
    currency: 'ETH',
    beneficiary: 'John Smith',
    releaseSchedule: 'Quarterly',
    nextRelease: '2025-09-01',
    amountPerRelease: 2500,
    fundsRemaining: 47500,
    status: 'Active',
    createdAt: '2024-03-01',
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'Release',
    amount: 1000,
    currency: 'USDC',
    date: '2025-07-15',
    status: 'Completed',
    recipient: 'Emma Thompson',
    description: 'Monthly education allowance',
  },
  {
    id: '2',
    type: 'Deposit',
    amount: 5000,
    currency: 'USDC',
    date: '2025-07-10',
    status: 'Completed',
    description: 'Initial fund contribution',
  },
  {
    id: '3',
    type: 'Release',
    amount: 2500,
    currency: 'ETH',
    date: '2025-06-01',
    status: 'Completed',
    recipient: 'John Smith',
    description: 'Quarterly family allowance',
  },
  {
    id: '4',
    type: 'Staking',
    amount: 12500,
    currency: 'ETH',
    date: '2025-07-31',
    status: 'Pending',
    description: 'ETH Staking Rewards',
  },
];

export const mockAssetAllocation: AssetAllocation[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    amount: 653.45,
    value: 2456789.12,
    allocation: 86.3,
    change24h: 15.2,
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    amount: 3.89,
    value: 234567.89,
    allocation: 8.2,
    change24h: 39.4,
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    amount: 4532.1,
    value: 89234.56,
    allocation: 3.1,
    change24h: 12.4,
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    amount: 66800.93,
    value: 66800.93,
    allocation: 2.4,
    change24h: 0.1,
  },
];

export const mockPortfolioData: PortfolioData[] = [
  // More historical data for better filtering demonstration
  { date: 'Jan 2024', value: 2400000, timestamp: 1704067200000 },
  { date: 'Feb 2024', value: 2420000, timestamp: 1706745600000 },
  { date: 'Mar 2024', value: 2450000, timestamp: 1709251200000 },
  { date: 'Apr 2024', value: 2480000, timestamp: 1711929600000 },
  { date: 'May 2024', value: 2520000, timestamp: 1714521600000 },
  { date: 'Jun 2024', value: 2580000, timestamp: 1717200000000 },
  { date: 'Jul 2024', value: 2650000, timestamp: 1719792000000 },
  { date: 'Aug 2024', value: 2680000, timestamp: 1722470400000 },
  { date: 'Sep 2024', value: 2720000, timestamp: 1725148800000 },
  { date: 'Oct 2024', value: 2750000, timestamp: 1727740800000 },
  { date: 'Nov 2024', value: 2780000, timestamp: 1730419200000 },
  { date: 'Dec 2024', value: 2800000, timestamp: 1733011200000 },
  { date: 'Jan 2025', value: 2810000, timestamp: 1735689600000 },
  { date: 'Feb 2025', value: 2820000, timestamp: 1738368000000 },
  { date: 'Mar 2025', value: 2830000, timestamp: 1740787200000 },
  { date: 'Apr 2025', value: 2835000, timestamp: 1743465600000 },
  { date: 'May 2025', value: 2845000, timestamp: 1746057600000 },
  { date: 'Jun 2025', value: 2846000, timestamp: 1748736000000 },
  { date: 'Jul 2025', value: 2847392.50, timestamp: 1751328000000 },
];

export const mockDashboardSummary: DashboardSummary = {
  totalPortfolioValue: 2847392.50,
  totalDeposits: 2500000.00,
  totalReturns: 347392.50,
  returnPercentage: 13.9,
  nextPayment: {
    amount: 45000.00,
    date: 'Nov 14, 2025',
    type: 'Quarterly Distribution',
  },
};

export const mockUpcomingPayments = [
  {
    id: '1',
    date: 'Nov 14, 2025',
    type: 'Quarterly Distribution',
    amount: 45000.00,
    status: 'Pending',
  },
  {
    id: '2',
    date: 'Jan 31, 2024',
    type: 'ETH Staking Rewards',
    amount: 12500.00,
    status: 'Pending',
  },
  {
    id: '3',
    date: 'Jan 1, 2024',
    type: 'BTC Deposit',
    amount: 1300000.00,
    status: 'Pending',
  },
];

export const mockPaymentHistory = [
  {
    id: '1',
    date: 'Dec 14, 2023',
    type: 'Quarterly Distribution',
    amount: 42000.00,
    status: 'Completed',
  },
  {
    id: '2',
    date: 'Nov 30, 2023',
    type: 'Staking Rewards',
    amount: 11800.00,
    status: 'Completed',
  },
  {
    id: '3',
    date: 'Nov 14, 2023',
    type: 'Quarterly Distribution',
    amount: 38500.00,
    status: 'Completed',
  },
  {
    id: '4',
    date: 'Oct 31, 2023',
    type: 'Staking Rewards',
    amount: 10200.00,
    status: 'Completed',
  },
];

export const mockDeposits = [
  {
    id: '1',
    date: 'Dec 19, 2023',
    type: 'Wire Transfer',
    amount: 250000.00,
    status: 'Completed',
  },
  {
    id: '2',
    date: 'Nov 14, 2023',
    type: 'Crypto Transfer',
    amount: 500000.00,
    status: 'Completed',
  },
  {
    id: '3',
    date: 'Sep 30, 2023',
    type: 'Wire Transfer',
    amount: 750000.00,
    status: 'Completed',
  },
  {
    id: '4',
    date: 'Sep 14, 2023',
    type: 'Initial Deposit',
    amount: 1000000.00,
    status: 'Completed',
  },
];

export const mockActivityLog = [
  {
    id: '1',
    type: 'rebalance',
    title: 'Rebalanced Portfolio',
    description: 'Adjusted ETH allocation from 84% to 86%',
    date: 'Jan 7, 2024',
  },
  {
    id: '2',
    type: 'staking',
    title: 'Staking Reward',
    description: 'Received 2.4 ETH staking rewards',
    date: 'Jan 6, 2024',
  },
  {
    id: '3',
    type: 'yield',
    title: 'Yield Claim',
    description: 'Claimed $8,750 from Uniswap LP',
    date: 'Jan 4, 2024',
  },
  {
    id: '4',
    type: 'purchase',
    title: 'Asset Purchase',
    description: 'Purchased 150 LINK tokens',
    date: 'Jan 2, 2024',
  },
  {
    id: '5',
    type: 'distribution',
    title: 'Distribution',
    description: 'Quarterly distribution processed',
    date: 'Dec 31, 2023',
  },
];