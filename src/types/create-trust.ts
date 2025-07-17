// src/types/create-trust.ts

export interface AssetTarget {
  id: string;
  symbol: string;
  name: string;
  percentage: number;
  icon: string;
  removable?: boolean;
}

export interface TrusteePermissions {
  canDissolve: boolean;
  canChangeBeneficiary: boolean;
  canAdjustPayouts: boolean;
  canAddRemoveTrustees: boolean;
  canModifyAssetAllocation: boolean;
  canRemoveTrustee: boolean;
  canDisablePayouts: boolean;
}



export interface TrustSettings {
  trustName: string;
  purposeStatement: string;
  duration: 'perpetual' | 'fixed';
  endDate?: string;
  beneficiaryAddress: string;
  beneficiaryName?: string;
  emergencyClause: boolean;
  revocable: boolean;
  
  // NEW fields for asset allocation (ADD these)
  assetTargets?: AssetTarget[];           // Creation targets
  rebalancingStrategy?: 'manual' | 'auto' | 'none';
  
  // NEW fields for payout settings
  payoutFrequency?: 'monthly' | 'quarterly' | 'annually';
  payoutAmount?: number;
  payoutCurrency: 'USD' | 'USDC' | 'USDT' | 'ETH' | 'BTC';
  payoutMethod: 'in-kind' | 'cash';
  firstPaymentDate?: {
    month: number;
    year: number;
  };

    // Beneficiary & Trustee control fields
  creatorAddress?: string;
  distributionMethod?: string;
  numberOfTrustees?: number;
  quorumRequired?: number;
  trusteePermissions?: TrusteePermissions;
}


export interface Trustee {
  id: string;
  address: string;
  name?: string;
  email?: string;
  role: 'creator' | 'trustee' | 'guardian';
  isConfirmed: boolean;
  permissions?: TrusteePermissions;
}


export interface GovernanceSettings {
  quorumThreshold: number; // Number of trustees required for quorum
  votingPeriod: number; // Days
  executionDelay: number; // Days
  proposalThreshold: number; // Minimum trustees to create proposal
}

export interface DepositSettings {
  initialDeposit: number;
  currency: 'ETH' | 'USDC' | 'USDT' | 'BTC';
  fundingSource: 'wallet' | 'bank_transfer' | 'crypto_transfer';
  recurringDeposits: boolean;
  recurringAmount?: number;
  recurringFrequency?: 'monthly' | 'quarterly' | 'annually';
}

export interface CreateTrustFormData {
  settings: TrustSettings;
  trustees: Trustee[];
  governance: GovernanceSettings;
  deposit: DepositSettings;
}

export interface StepValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface CreateTrustStep {
  id: number;
  name: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface CreateTrustState {
  currentStep: number;
  steps: CreateTrustStep[];
  formData: CreateTrustFormData;
  isSubmitting: boolean;
  submitError?: string;
  walletConnected: boolean;
}

// Form validation types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message: string;
}

export interface FieldValidation {
  [fieldName: string]: ValidationRule[];
}

export interface StepValidationRules {
  settings: FieldValidation;
  trustees: FieldValidation;
  governance: FieldValidation;
  deposit: FieldValidation;
}

// Smart contract deployment types
export interface ContractDeployment {
  status: 'pending' | 'deploying' | 'completed' | 'failed';
  contractAddress?: string;
  transactionHash?: string;
  estimatedGas?: number;
  actualGas?: number;
  deploymentFee?: number;
}

export interface TrustCreationResult {
  success: boolean;
  trustId?: string;
  contractAddress?: string;
  transactionHash?: string;
  error?: string;
}
// In your types file
export interface StepValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}