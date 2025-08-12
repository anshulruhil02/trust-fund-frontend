// src/hooks/useDeposit.ts
import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, parseUnits } from 'viem';

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

// Token addresses on Arbitrum Sepolia
const TOKEN_ADDRESSES = {
  LINK: '0xb1D4538B4571d411F07960EF2838Ce337FE1E80E',
  // Add more tokens as needed
};

export function useDeposit() {
  const { address } = useAccount();
  const [isDepositing, setIsDepositing] = useState(false);

  const { writeContract, data: txHash } = useWriteContract();
  
  const { isLoading: isTxLoading, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const depositETH = async (trustAddress: string, amount: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    setIsDepositing(true);
    try {
      writeContract({
        address: trustAddress as `0x${string}`,
        abi: TRUST_FUND_ABI,
        functionName: 'depositETH',
        value: parseEther(amount),
      });

      // Wait for transaction to be mined
      // Then record in database
      if (isTxSuccess && txHash) {
        await recordDeposit({
          trustId: 'trust-id-here', // You'll need to pass this
          depositorAddress: address,
          tokenAddress: '0x0', // ETH
          tokenSymbol: 'ETH',
          amount,
          transactionHash: txHash,
        });
      }

    } catch (error) {
      console.error('Error depositing ETH:', error);
      throw error;
    } finally {
      setIsDepositing(false);
    }
  };

  const depositLINK = async (trustAddress: string, amount: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    setIsDepositing(true);
    try {
      // Convert amount to proper units (LINK has 18 decimals)
      const amountInWei = parseUnits(amount, 18);

      writeContract({
        address: trustAddress as `0x${string}`,
        abi: TRUST_FUND_ABI,
        functionName: 'depositToken',
        args: [TOKEN_ADDRESSES.LINK, amountInWei],
      });

      // Record in database after successful transaction
      if (isTxSuccess && txHash) {
        await recordDeposit({
          trustId: 'trust-id-here', // You'll need to pass this
          depositorAddress: address,
          tokenAddress: TOKEN_ADDRESSES.LINK,
          tokenSymbol: 'LINK',
          amount,
          transactionHash: txHash,
        });
      }

    } catch (error) {
      console.error('Error depositing LINK:', error);
      throw error;
    } finally {
      setIsDepositing(false);
    }
  };

  const recordDeposit = async (depositData: {
    trustId: string;
    depositorAddress: string;
    tokenAddress: string;
    tokenSymbol: string;
    amount: string;
    transactionHash: string;
    blockNumber?: number;
  }) => {
    try {
      const response = await fetch('/api/deposits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(depositData),
      });

      if (!response.ok) {
        throw new Error('Failed to record deposit');
      }

      return await response.json();
    } catch (error) {
      console.error('Error recording deposit:', error);
      throw error;
    }
  };

  const getTrustDeposits = async (trustId: string) => {
    try {
      const response = await fetch(`/api/deposits?trustId=${trustId}`);
      if (!response.ok) throw new Error('Failed to fetch deposits');
      const result = await response.json();
      return result.deposits;
    } catch (error) {
      console.error('Error fetching deposits:', error);
      throw error;
    }
  };

  return {
    depositETH,
    depositLINK,
    getTrustDeposits,
    isDepositing: isDepositing || isTxLoading,
    isTxSuccess,
    txHash,
  };
}