// src/hooks/useTrust.ts
import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

// You'll need to create these ABIs from your contracts
const TRUST_FACTORY_ABI = [
  {
    "inputs": [
      {"name": "_name", "type": "string"},
      {"name": "_purpose", "type": "string"},
      {"name": "_beneficiaries", "type": "address[]"},
      {"name": "_allocations", "type": "uint256[]"},
      {"name": "_trustees", "type": "address[]"}
    ],
    "name": "createTrust",
    "outputs": [{"name": "trustAddress", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const TRUST_FUND_ABI = [
  {
    "inputs": [],
    "name": "depositETH",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "token", "type": "address"},
      {"name": "amount", "type": "uint256"}
    ],
    "name": "depositToken",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

interface CreateTrustParams {
  name: string;
  purpose: string;
  beneficiaries: { address: string; allocation: number; name?: string; email?: string }[];
  trustees: { address: string; name?: string; email?: string; permissions?: any }[];
  payoutSettings?: {
    frequency: string;
    amount: number;
    currency: string;
    method: string;
    firstPaymentDate?: Date;
  };
}

export function useTrust() {
  const { address } = useAccount();
  const [isCreating, setIsCreating] = useState(false);
  const [isDepositing, setIsDepositing] = useState(false);

  const { writeContract: writeFactory, data: factoryTxHash } = useWriteContract();
  const { writeContract: writeTrust, data: depositTxHash } = useWriteContract();

  // Wait for transaction confirmations
  const { isLoading: isFactoryLoading, isSuccess: isFactorySuccess } = useWaitForTransactionReceipt({
    hash: factoryTxHash,
  });

  const { isLoading: isDepositLoading, isSuccess: isDepositSuccess } = useWaitForTransactionReceipt({
    hash: depositTxHash,
  });

  const createTrust = async (params: CreateTrustParams) => {
    if (!address) throw new Error('Wallet not connected');
    
    setIsCreating(true);
    try {
      // Prepare data for smart contract
      const beneficiaryAddresses = params.beneficiaries.map(b => b.address);
      const allocations = params.beneficiaries.map(b => b.allocation);
      const trusteeAddresses = params.trustees.map(t => t.address);

      // Call smart contract to create trust
      writeFactory({
        address: process.env.NEXT_PUBLIC_TRUST_FACTORY_ADDRESS as `0x${string}`,
        abi: TRUST_FACTORY_ABI,
        functionName: 'createTrust',
        args: [
          params.name,
          params.purpose,
          beneficiaryAddresses,
          allocations,
          trusteeAddresses
        ],
      });

      // Wait for transaction and get contract address
      // Note: In a real app, you'd listen for the TrustCreated event to get the contract address
      // For now, we'll simulate this
      
      // Store in database
      const response = await fetch('/api/trusts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
          contractAddress: '0x' + Math.random().toString(16).slice(2, 42), // Temporary - replace with actual contract address
          creatorAddress: address,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save trust to database');
      }

      const result = await response.json();
      return result.trust;

    } catch (error) {
      console.error('Error creating trust:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const depositETH = async (trustAddress: string, amount: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    setIsDepositing(true);
    try {
      writeTrust({
        address: trustAddress as `0x${string}`,
        abi: TRUST_FUND_ABI,
        functionName: 'depositETH',
        value: parseEther(amount),
      });

    } catch (error) {
      console.error('Error depositing ETH:', error);
      throw error;
    } finally {
      setIsDepositing(false);
    }
  };

  const depositToken = async (trustAddress: string, tokenAddress: string, amount: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    setIsDepositing(true);
    try {
      writeTrust({
        address: trustAddress as `0x${string}`,
        abi: TRUST_FUND_ABI,
        functionName: 'depositToken',
        args: [tokenAddress, BigInt(amount)],
      });

    } catch (error) {
      console.error('Error depositing token:', error);
      throw error;
    } finally {
      setIsDepositing(false);
    }
  };

  const getUserTrusts = async (walletAddress: string) => {
    try {
      const response = await fetch(`/api/trusts/create?walletAddress=${walletAddress}`);
      if (!response.ok) throw new Error('Failed to fetch trusts');
      const result = await response.json();
      return result.trusts;
    } catch (error) {
      console.error('Error fetching trusts:', error);
      throw error;
    }
  };

  return {
    createTrust,
    depositETH,
    depositToken,
    getUserTrusts,
    isCreating: isCreating || isFactoryLoading,
    isDepositing: isDepositing || isDepositLoading,
    isFactorySuccess,
    isDepositSuccess,
  };
}