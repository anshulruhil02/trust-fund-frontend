// src/types/trust-fund.ts

export interface TrustFund {
  id: string;
  name: string;
  totalValue: number;
  currency: string;
  beneficiary: string;
  releaseSchedule: 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually';
  nextRelease: string;
  amountPerRelease: number;
  fundsRemaining: number;
  status: 'Active' | 'Paused' | 'Completed';
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: 'Release' | 'Deposit' | 'Staking' | 'Transfer';
  amount: number;
  currency: string;
  date: string;
  status: 'Pending' | 'Completed' | 'Failed';
  recipient?: string;
  description?: string;
  txHash?: string;
}

export interface AssetAllocation {
  symbol: string;
  name: string;
  amount: number;
  value: number;
  allocation: number; // percentage
  change24h: number; // percentage
}

export interface PortfolioData {
  date: string;
  value: number;
  timestamp: number;
}

export interface DashboardSummary {
  totalPortfolioValue: number;
  totalDeposits: number;
  totalReturns: number;
  returnPercentage: number;
  nextPayment: {
    amount: number;
    date: string;
    type: string;
  };
}

export interface WalletState {
  isConnected: boolean;
  address?: string;
  balance?: number;
  isLoading: boolean;
}