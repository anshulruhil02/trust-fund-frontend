// src/hooks/useTrust.ts
import React from 'react';
import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

const FACTORY_ADDRESS = "0x5a6B2CAC942243A98Cfe3CFCB87DBBf28096E5B5" as const;

// ABI for TrustFactory contract
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
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "name": "creator", "type": "address"},
      {"indexed": true, "name": "trustAddress", "type": "address"},
      {"indexed": false, "name": "name", "type": "string"},
      {"indexed": true, "name": "trustId", "type": "uint256"}
    ],
    "name": "TrustCreated",
    "type": "event"
  }
] as const;

interface CreateTrustParams {
  name: string;
  purpose: string;
  beneficiaries: { 
    address: string; 
    allocation: number; 
    name?: string; 
    email?: string;
  }[];
  trustees: { 
    address: string; 
    name?: string; 
    email?: string; 
    permissions?: any;
  }[];
  payoutSettings?: {
    frequency: string;
    amount: number;
    currency: string;
    method: string;
    firstPaymentDate?: Date;
  };
}

interface TrustCreationResult {
  success: boolean;
  trustId?: string;
  contractAddress?: string;
  transactionHash?: string;
  error?: string;
}

export function useTrust() {
  const { address } = useAccount();
  const [isCreating, setIsCreating] = useState(false);

  const { 
    writeContract, 
    data: txHash, 
    error: writeError,
    isPending: isWritePending 
  } = useWriteContract();
  
  const { 
    isLoading: isTxLoading, 
    isSuccess: isTxSuccess, 
    error: txError,
    data: receipt 
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const createTrust = async (params: CreateTrustParams): Promise<TrustCreationResult> => {
    if (!address) {
      return { success: false, error: 'Wallet not connected' };
    }
    
    setIsCreating(true);
    
    try {
      console.log('🚀 Starting trust creation...', params);

      // Validate allocations sum to 100
      const totalAllocation = params.beneficiaries.reduce((sum, b) => sum + b.allocation, 0);
      if (totalAllocation !== 100) {
        setIsCreating(false);
        return {
          success: false,
          error: `Allocations must sum to 100%, got ${totalAllocation}%`
        };
      }

      // Prepare data for smart contract
      const beneficiaryAddresses = params.beneficiaries.map(b => b.address as `0x${string}`);
      const allocations = params.beneficiaries.map(b => BigInt(b.allocation));
      const trusteeAddresses = params.trustees.map(t => t.address as `0x${string}`);

      console.log('📝 Contract parameters:', {
        name: params.name,
        purpose: params.purpose,
        beneficiaryAddresses,
        allocations,
        trusteeAddresses
      });

      // Call smart contract
      await writeContract({
        address: FACTORY_ADDRESS,
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

      // Return success with pending transaction
      return { 
        success: true, 
        transactionHash: txHash || 'pending'
      };

    } catch (error) {
      console.error('❌ Trust creation failed:', error);
      setIsCreating(false);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  // Helper to save trust to database after blockchain success
  const saveTrustToDatabase = async (
    params: CreateTrustParams, 
    contractAddress: string, 
    transactionHash: string
  ) => {
    try {
      console.log('💾 Saving trust to database...', { contractAddress, transactionHash });

      const response = await fetch('/api/trusts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: params.name,
          purpose: params.purpose,
          contractAddress,
          creatorAddress: address,
          beneficiaries: params.beneficiaries,
          trustees: params.trustees,
          payoutSettings: params.payoutSettings,
          transactionHash,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Database save failed: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Trust saved to database:', result.trust);
      return result.trust;

    } catch (error) {
      console.error('❌ Database save failed:', error);
      throw error;
    }
  };

  // Helper to extract contract address from transaction receipt
  const extractContractAddress = (receipt: any): string | null => {
    try {
      // For demo purposes, generate a mock contract address
      // In a real implementation, you would parse the TrustCreated event
      if (receipt?.transactionHash) {
        // Generate deterministic address based on transaction hash
        const mockAddress = '0x' + receipt.transactionHash.slice(2, 42);
        return mockAddress;
      }
      return null;
    } catch (error) {
      console.error('Failed to extract contract address:', error);
      return null;
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

  // Reset creating state when transaction completes
  React.useEffect(() => {
    if (isTxSuccess || writeError || txError) {
      setIsCreating(false);
    }
  }, [isTxSuccess, writeError, txError]);

  // Combined status
  const isProcessing = isCreating || isWritePending || isTxLoading;
  const hasError = writeError || txError;

  return {
    // Main functions
    createTrust,
    getUserTrusts,
    saveTrustToDatabase,
    extractContractAddress,

    // Status
    isCreating: isProcessing,
    isTxSuccess,
    hasError,
    
    // Transaction data
    txHash,
    receipt,
    
    // Error messages
    error: hasError ? (writeError?.message || txError?.message) : null,
  };
}