// src/hooks/useCreateTrust.ts
'use client';

import { useState, useCallback } from 'react';
import {
  CreateTrustState,
  CreateTrustFormData,
  CreateTrustStep,
  TrustSettings,
  Trustee,
  GovernanceSettings,
  DepositSettings,
  TrustCreationResult,
} from '@/types/create-trust';
import { useWalletAddressManager } from './useWalletAddressManager';

// Initial form data
const initialFormData: CreateTrustFormData = {
  settings: {
      // Required original fields
      trustName: '',
      purposeStatement: '',
      duration: 'perpetual',
      beneficiaryAddress: '',
      emergencyClause: false,
      revocable: false,

      // Required new payout fields
      payoutAmount: 0,
      payoutCurrency: 'USDC',
      payoutFrequency: 'monthly',

      // Optional fields with sensible defaults
      beneficiaryName: '',
      payoutMethod: 'in-kind',
      assetTargets: [
          {
              id: 'eth',
              symbol: 'ETH',
              name: 'Ethereum',
              icon: '⟠',
              removable: false,
              percentage: 100
          },
          {
              id: 'btc',
              symbol: 'BTC',
              name: 'Bitcoin',
              icon: '₿',
              removable: false,
              percentage: 0
          }
      ],
      rebalancingStrategy: 'manual',
      numberOfTrustees: 3,
      quorumRequired: 2,
      trusteePermissions: {
          canDissolve: false,
          canChangeBeneficiary: false,
          canAdjustPayouts: false,
          canAddRemoveTrustees: false,
          canModifyAssetAllocation: false,
          canRemoveTrustee: false,
          canDisablePayouts: false,
      }
  },
  trustees: [],
  governance: {
    quorumThreshold: 1,
    votingPeriod: 7,
    executionDelay: 1,
    proposalThreshold: 1,
  },
  deposit: {
    initialDeposit: 0,
    currency: 'USDC',
    fundingSource: 'wallet',
    recurringDeposits: false,
  },
};

// Initial steps - simplified without validation
const initialSteps: CreateTrustStep[] = [
  {
    id: 1,
    name: 'settings',
    title: 'Settings',
    description: 'Configure your trust settings and beneficiary details',
    isCompleted: false,
    isActive: true,
  },
  {
    id: 2,
    name: 'trustees',
    title: 'Trustees',
    description: 'Add trustees and configure multi-signature requirements',
    isCompleted: false,
    isActive: false,
  },
  {
    id: 3,
    name: 'deposit',
    title: 'Deposit',
    description: 'Set up initial funding and recurring deposits',
    isCompleted: false,
    isActive: false,
  },
  {
    id: 4,
    name: 'review',
    title: 'Review',
    description: 'Review all settings and deploy your trust',
    isCompleted: false,
    isActive: false,
  },
];

export const useCreateTrust = () => {
  // State
  const [state, setState] = useState<CreateTrustState>({
    currentStep: 1,
    steps: initialSteps,
    formData: initialFormData,
    isSubmitting: false,
    walletConnected: false,
  });

  // Wallet address management - now properly memoized
  const walletAddressManager = useWalletAddressManager(
    state.formData.trustees,
    state.formData.settings,
    undefined // TODO: Replace with actual connected wallet address
  );

  // Update form data - CLEAN VERSION (no side effects)
  const updateFormData = useCallback((
    section: keyof CreateTrustFormData,
    data: Partial<TrustSettings | Trustee[] | GovernanceSettings | DepositSettings>
  ) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [section]: section === 'trustees' ? data : { ...prev.formData[section], ...data }
      }
    }));
  }, []);

  // Go to next step - simplified (no validation)
  const nextStep = useCallback(() => {
    setState(prev => {
      const newCurrentStep = Math.min(prev.currentStep + 1, prev.steps.length);
      
      return {
        ...prev,
        currentStep: newCurrentStep,
        steps: prev.steps.map(step => ({
          ...step,
          isCompleted: step.id < newCurrentStep,
          isActive: step.id === newCurrentStep,
        }))
      };
    });
    
    return true;
  }, []);

  // Go to previous step
  const previousStep = useCallback(() => {
    setState(prev => {
      const newCurrentStep = Math.max(prev.currentStep - 1, 1);
      
      return {
        ...prev,
        currentStep: newCurrentStep,
        steps: prev.steps.map(step => ({
          ...step,
          isCompleted: step.id < newCurrentStep,
          isActive: step.id === newCurrentStep,
        }))
      };
    });
  }, []);

  // Go to specific step
  const goToStep = useCallback((stepNumber: number) => {
    if (stepNumber < 1 || stepNumber > initialSteps.length) {
      return false;
    }

    setState(prev => ({
      ...prev,
      currentStep: stepNumber,
      steps: prev.steps.map(step => ({
        ...step,
        isCompleted: step.id < stepNumber,
        isActive: step.id === stepNumber,
      }))
    }));
    
    return true;
  }, []);

  // Add trustee - CLEAN VERSION (just adds, no side effects)
  const addTrustee = useCallback((trustee: Omit<Trustee, 'id'>) => {
    const newTrustee: Trustee = {
      ...trustee,
      id: Date.now().toString(),
    };

    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        trustees: [...prev.formData.trustees, newTrustee]
      }
    }));
  }, []);

  // Remove trustee
  const removeTrustee = useCallback((trusteeId: string) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        trustees: prev.formData.trustees.filter(t => t.id !== trusteeId)
      }
    }));
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setState({
      currentStep: 1,
      steps: initialSteps,
      formData: initialFormData,
      isSubmitting: false,
      walletConnected: false,
    });
  }, []);

  // Submit trust creation
  const submitTrust = useCallback(async (): Promise<TrustCreationResult> => {
    setState(prev => ({ ...prev, isSubmitting: true, submitError: undefined }));

    try {
      console.log('Deploying trust with data:', state.formData);

      // Simulate deployment delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock successful deployment
      const result: TrustCreationResult = {
        success: true,
        trustId: `trust_${Date.now()}`,
        contractAddress: '0x1234567890123456789012345678901234567890',
        transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      };

      setState(prev => ({ ...prev, isSubmitting: false }));
      return result;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setState(prev => ({ 
        ...prev, 
        isSubmitting: false, 
        submitError: errorMessage 
      }));

      return {
        success: false,
        error: errorMessage,
      };
    }
  }, [state.formData]);

  // Set wallet connection status
  const setWalletConnected = useCallback((connected: boolean) => {
    setState(prev => ({ ...prev, walletConnected: connected }));
  }, []);

  // Computed recommendations (don't modify formData)
  const governanceRecommendations = useCallback(() => {
    const trusteeCount = state.formData.trustees.length;
    return {
      recommendedQuorum: Math.ceil(trusteeCount / 2),
      maxQuorum: trusteeCount,
      recommendedProposalThreshold: 1,
      maxProposalThreshold: trusteeCount,
    };
  }, [state.formData.trustees.length]);

  return {
    // State - return individual properties instead of spreading
    currentStep: state.currentStep,
    steps: state.steps,
    formData: state.formData,
    isSubmitting: state.isSubmitting,
    walletConnected: state.walletConnected,
    submitError: state.submitError,
    currentStepData: state.steps.find(step => step.id === state.currentStep),
    
    // Form actions
    updateFormData,
    nextStep,
    previousStep,
    goToStep,
    
    // Trustee actions
    addTrustee,
    removeTrustee,
    
    // Submission
    submitTrust,
    resetForm,
    
    // Wallet
    setWalletConnected,
    
    // Wallet address management
    walletAddressManager,
    
    // Recommendations (computed, not stored)
    governanceRecommendations,
    
    // Computed values
    isFirstStep: state.currentStep === 1,
    isLastStep: state.currentStep === state.steps.length,
    completedStepsCount: state.steps.filter(step => step.isCompleted).length,
    progressPercentage: (state.steps.filter(step => step.isCompleted).length / state.steps.length) * 100,
  };
};