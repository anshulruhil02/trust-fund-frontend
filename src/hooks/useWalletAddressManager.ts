// src/hooks/useWalletAddressManager.ts
'use client';

import { useMemo, useCallback } from 'react';
import { Trustee, TrustSettings } from '@/types/create-trust';
import { isValidEthereumAddress } from '@/utils/trustValidation';

export interface WalletAddressManager {
  // All addresses currently in use
  usedAddresses: string[];
  
  // Addresses by category
  trusteeAddresses: string[];
  beneficiaryAddress: string | null;
  creatorAddress: string | null;
  
  // Validation functions
  isAddressInUse: (address: string) => boolean;
  isAddressDuplicate: (address: string, excludeId?: string) => boolean;
  getAddressUsage: (address: string) => Array<{
    type: 'trustee' | 'beneficiary' | 'creator';
    id?: string;
    name?: string;
  }>;
  
  // Validation with context
  validateNewAddress: (address: string, type: 'trustee' | 'beneficiary' | 'creator', excludeId?: string) => {
    isValid: boolean;
    error?: string;
    warning?: string;
  };
}

export const useWalletAddressManager = (
  trustees: Trustee[],
  settings: Partial<TrustSettings>,
  connectedWalletAddress?: string
): WalletAddressManager => {
  
  // Extract all addresses - memoized
  const addressData = useMemo(() => {
    const trusteeAddresses = trustees
      .map(t => t.address.toLowerCase())
      .filter(addr => isValidEthereumAddress(addr));
    
    const beneficiaryAddress = settings.beneficiaryAddress?.toLowerCase() || null;
    const creatorAddress = settings.creatorAddress?.toLowerCase() || connectedWalletAddress?.toLowerCase() || null;
    
    // Combine all addresses
    const usedAddresses = [
      ...trusteeAddresses,
      ...(beneficiaryAddress ? [beneficiaryAddress] : []),
      ...(creatorAddress ? [creatorAddress] : [])
    ].filter((addr, index, arr) => arr.indexOf(addr) === index); // Remove duplicates
    
    return {
      trusteeAddresses,
      beneficiaryAddress,
      creatorAddress,
      usedAddresses
    };
  }, [trustees, settings.beneficiaryAddress, settings.creatorAddress, connectedWalletAddress]);

  // Check if address is in use - memoized callback
  const isAddressInUse = useCallback((address: string): boolean => {
    return addressData.usedAddresses.includes(address.toLowerCase());
  }, [addressData.usedAddresses]);

  // Check if address is duplicate - memoized callback
  const isAddressDuplicate = useCallback((address: string, excludeId?: string): boolean => {
    const normalizedAddress = address.toLowerCase();
    
    // Check trustees (excluding the one being edited)
    const duplicateInTrustees = trustees.some(trustee => 
      trustee.address.toLowerCase() === normalizedAddress && 
      (!excludeId || trustee.id !== excludeId)
    );
    
    // Check beneficiary
    const duplicateInBeneficiary = addressData.beneficiaryAddress === normalizedAddress;
    
    // Check creator
    const duplicateInCreator = addressData.creatorAddress === normalizedAddress;
    
    return duplicateInTrustees || duplicateInBeneficiary || duplicateInCreator;
  }, [trustees, addressData.beneficiaryAddress, addressData.creatorAddress]);

  // Get detailed usage information for an address - memoized callback
  const getAddressUsage = useCallback((address: string) => {
    const normalizedAddress = address.toLowerCase();
    const usage: Array<{
      type: 'trustee' | 'beneficiary' | 'creator';
      id?: string;
      name?: string;
    }> = [];

    // Check trustees
    trustees.forEach(trustee => {
      if (trustee.address.toLowerCase() === normalizedAddress) {
        usage.push({
          type: 'trustee',
          id: trustee.id,
          name: trustee.name || `Trustee ${trustee.address.slice(0, 6)}...`
        });
      }
    });

    // Check beneficiary
    if (addressData.beneficiaryAddress === normalizedAddress) {
      usage.push({
        type: 'beneficiary',
        name: settings.beneficiaryName || 'Beneficiary'
      });
    }

    // Check creator
    if (addressData.creatorAddress === normalizedAddress) {
      usage.push({
        type: 'creator',
        name: 'Trust Creator'
      });
    }

    return usage;
  }, [trustees, addressData.beneficiaryAddress, addressData.creatorAddress, settings.beneficiaryName]);

  // Comprehensive validation with context - memoized callback
  const validateNewAddress = useCallback((
    address: string, 
    type: 'trustee' | 'beneficiary' | 'creator', 
    excludeId?: string
  ) => {
    const normalizedAddress = address.trim().toLowerCase();
    
    // Basic format validation
    if (!isValidEthereumAddress(normalizedAddress)) {
      return {
        isValid: false,
        error: 'Please enter a valid Ethereum address (0x...)'
      };
    }

    // Check for duplicates
    if (isAddressDuplicate(normalizedAddress, excludeId)) {
      const usage = getAddressUsage(normalizedAddress);
      const existingUsage = usage.filter(u => 
        !(u.type === type && u.id === excludeId) // Exclude current item being edited
      );

      if (existingUsage.length > 0) {
        const usageDescriptions = existingUsage.map(u => {
          switch (u.type) {
            case 'trustee':
              return `trustee (${u.name})`;
            case 'beneficiary':
              return 'beneficiary';
            case 'creator':
              return 'trust creator';
            default:
              return u.type;
          }
        });

        return {
          isValid: false,
          error: `This address is already used as ${usageDescriptions.join(', ')}`
        };
      }
    }

    // Specific validations based on type
    switch (type) {
      case 'trustee':
        // Warn if trustee is also beneficiary or creator
        const trusteeUsage = getAddressUsage(normalizedAddress);
        const nonTrusteeUsage = trusteeUsage.filter(u => u.type !== 'trustee');
        
        if (nonTrusteeUsage.length > 0) {
          const roles = nonTrusteeUsage.map(u => u.type).join(', ');
          return {
            isValid: true,
            warning: `This address is also the ${roles}. Consider using different addresses for different roles.`
          };
        }
        break;

      case 'beneficiary':
        // Check if beneficiary is also a trustee
        if (addressData.trusteeAddresses.includes(normalizedAddress)) {
          return {
            isValid: true,
            warning: 'The beneficiary is also a trustee. This may create conflicts of interest.'
          };
        }
        break;

      case 'creator':
        // Check if creator is also a trustee or beneficiary
        const creatorUsage = getAddressUsage(normalizedAddress);
        const otherRoles = creatorUsage.filter(u => u.type !== 'creator');
        
        if (otherRoles.length > 0) {
          const roles = otherRoles.map(u => u.type).join(', ');
          return {
            isValid: true,
            warning: `You are also the ${roles}. This is allowed but may affect trust governance.`
          };
        }
        break;
    }

    return { isValid: true };
  }, [isAddressDuplicate, getAddressUsage, addressData.trusteeAddresses]);

  // Return memoized object to prevent recreation
  return useMemo(() => ({
    ...addressData,
    isAddressInUse,
    isAddressDuplicate,
    getAddressUsage,
    validateNewAddress
  }), [addressData, isAddressInUse, isAddressDuplicate, getAddressUsage, validateNewAddress]);
};