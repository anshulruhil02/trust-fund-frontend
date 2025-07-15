// src/utils/trustValidation.ts
import { 
  TrustSettings, 
  Trustee, 
  GovernanceSettings, 
  DepositSettings, 
  StepValidation,
  ValidationRule,
  StepValidationRules 
} from '@/types/create-trust';

// Ethereum address validation
export const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Email validation
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Trust name validation
export const isValidTrustName = (name: string): boolean => {
  return name.length >= 3 && name.length <= 100 && /^[a-zA-Z0-9\s\-_']+$/.test(name);
};

// Amount validation
export const isValidAmount = (amount: unknown, min: number = 0): boolean => {
  const numericAmount = toNumber(amount);
  return numericAmount !== null && Number.isFinite(numericAmount) && numericAmount > min;
};

// Date validation (future date)
export const isValidFutureDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  const now = new Date();
  return date > now;
};

// Validation rules for each step
export const validationRules: StepValidationRules = {
  settings: {
    trustName: [
      { required: true, message: 'Trust name is required' },
      { minLength: 3, message: 'Trust name must be at least 3 characters' },
      { maxLength: 100, message: 'Trust name must be less than 100 characters' },
      { pattern: /^[a-zA-Z0-9\s\-_']+$/, message: 'Trust name contains invalid characters' }
    ],
    purposeStatement: [
      { required: true, message: 'Purpose statement is required' },
      { minLength: 10, message: 'Purpose statement must be at least 10 characters' },
      { maxLength: 1000, message: 'Purpose statement must be less than 1000 characters' }
    ],
    beneficiaryAddress: [
      { required: true, message: 'Beneficiary address is required' },
      { custom: isValidEthereumAddress, message: 'Invalid Beneficiary Ethereum address format' }
    ],
    creatorAddress: [
      { required: true, message: 'Creator address is required' },
      { custom: isValidEthereumAddress, message: 'Invalid Creator Ethereum address format' }
    ],
     payoutAmount: [
      { required: true, message: 'Payout amount is required' },
      { custom: (value: number) => isValidAmount(value, 0), message: 'Payout amount must be greater than 0' }
    ],
    payoutFrequency: [
      { required: true, message: 'Payout frequency is required' }
    ],
    payoutCurrency: [
      { required: true, message: 'Payout currency is required' }
    ],
    payoutMethod: [
      { required: true, message: 'Payout method is required' }
    ],
    endDate: [
      { custom: (value: string) => !value || isValidFutureDate(value), message: 'End date must be in the future' }
    ]
  },
  trustees: {
    trustees: [
      { required: true, message: 'At least one trustee is required' },
      { custom: (trustees: Trustee[]) => trustees.length >= 1, message: 'Minimum of 1 trustee required' },
      { custom: (trustees: Trustee[]) => trustees.length <= 10, message: 'Maximum of 10 trustees allowed' }
    ]
  },
  governance: {
    quorumThreshold: [
      { required: true, message: 'Quorum threshold is required' },
      { custom: (value: number) => value >= 1, message: 'Quorum must be at least 1' }
    ],
    votingPeriod: [
      { required: true, message: 'Voting period is required' },
      { custom: (value: number) => value >= 1 && value <= 30, message: 'Voting period must be between 1-30 days' }
    ],
    executionDelay: [
      { required: true, message: 'Execution delay is required' },
      { custom: (value: number) => value >= 0 && value <= 7, message: 'Execution delay must be between 0-7 days' }
    ]
  },
  deposit: {
    initialDeposit: [
      { required: true, message: 'Initial deposit is required' },
      { custom: (value: number) => isValidAmount(value, 0.001), message: 'Initial deposit must be at least 0.001' }
    ],
    recurringAmount: [
      { custom: (value: number) => !value || isValidAmount(value, 0), message: 'Recurring amount must be greater than 0' }
    ]
  }
};

// Validate individual field
export const validateField = (fieldName: string, value: any, rules: ValidationRule[]): string[] => {
  const errors: string[] = [];

  for (const rule of rules) {
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors.push(rule.message);
      continue;
    }

    if (!value && !rule.required) {
      continue; // Skip validation for optional empty fields
    }

    if (rule.minLength && typeof value === 'string' && value.length < rule.minLength) {
      errors.push(rule.message);
    }

    if (rule.maxLength && typeof value === 'string' && value.length > rule.maxLength) {
      errors.push(rule.message);
    }

    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      errors.push(rule.message);
    }

    if (rule.custom && !rule.custom(value)) {
      errors.push(rule.message);
    }
  }

  return errors;
};

// Validate trust settings step
export const validateSettingsStep = (settings: Partial<TrustSettings>): StepValidation => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate each field
  Object.entries(validationRules.settings).forEach(([fieldName, rules]) => {
    const fieldErrors = validateField(fieldName, settings[fieldName as keyof TrustSettings], rules);
    errors.push(...fieldErrors);
  });

  // Custom validation logic
  if (settings.duration === 'fixed' && !settings.endDate) {
    errors.push('End date is required for fixed duration trusts');
  }

  if (settings.payoutAmount && settings.payoutFrequency) {
    const annualDistribution = calculateAnnualDistribution(
      settings.payoutAmount, 
      settings.payoutFrequency
    );
    if (annualDistribution > 1000000) { // $1M threshold
      warnings.push('High annual distribution amount detected');
    }
  }

  const assets = settings.assetTargets || [];
  const totalPercentage = assets.reduce(
    (sum, asset) => sum + (asset.percentage || 0),
    0
  );

  if (totalPercentage !== 100) {
    errors.push(`Total allocation must be exactly 100%, but it is currently ${totalPercentage}%.`);
  }

  if (settings.firstPaymentDate && settings.payoutFrequency) {
    const { month, year } = settings.firstPaymentDate;
    const today = new Date();
    // Set to the first day of the current month to ensure a clean comparison
    today.setDate(1); 
    today.setHours(0, 0, 0, 0);

    // Create a date object from the user's selection (month is 1-indexed in your type)
    const selectedDate = new Date(year, month - 1, 1);

    if (selectedDate < today) {
      errors.push('The first payment date cannot be in the past.');
    }
  }

  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;

  // 1. Validate Creator Address
  if (!settings.creatorAddress || settings.creatorAddress.trim() === '') {
    errors.push('Creator wallet address is required.');
  } else if (!ethAddressRegex.test(settings.creatorAddress)) {
    errors.push('Invalid creator wallet address format.');
  }

  // 2. Validate Beneficiary Address
  if (!settings.beneficiaryAddress || settings.beneficiaryAddress.trim() === '') {
    errors.push('Beneficiary wallet address is required.');
  } else if (!ethAddressRegex.test(settings.beneficiaryAddress)) {
    errors.push('Invalid beneficiary wallet address format.');
  }

  // 3. Ensure addresses are not the same
  if (
    settings.creatorAddress &&
    settings.beneficiaryAddress &&
    settings.creatorAddress.toLowerCase() === settings.beneficiaryAddress.toLowerCase()
  ) {
    errors.push('Creator and Beneficiary addresses cannot be the same.');
  }

  // 4. Validate Quorum setting
  if (
    settings.quorumRequired &&
    settings.numberOfTrustees &&
    settings.quorumRequired > settings.numberOfTrustees
  ) {
    errors.push('Quorum required cannot be greater than the number of trustees.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Validate trustees step
export const validateTrusteesStep = (
  trustees: Trustee[], 
  governance: Partial<GovernanceSettings>
): StepValidation => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic trustee validation
  const trusteeErrors = validateField('trustees', trustees, validationRules.trustees.trustees);
  errors.push(...trusteeErrors);

  // Individual trustee validation
  trustees.forEach((trustee, index) => {
    if (!isValidEthereumAddress(trustee.address)) {
      errors.push(`Trustee ${index + 1}: Invalid Ethereum address`);
    }

    if (trustee.email && !isValidEmail(trustee.email)) {
      errors.push(`Trustee ${index + 1}: Invalid email address`);
    }

    if (!trustee.name || trustee.name.trim().length < 2) {
      errors.push(`Trustee ${index + 1}: Name is required (minimum 2 characters)`);
    }
  });

  // Check for duplicate addresses
  const addresses = trustees.map(t => t.address.toLowerCase());
  const duplicates = addresses.filter((addr, index) => addresses.indexOf(addr) !== index);
  if (duplicates.length > 0) {
    errors.push('Duplicate trustee addresses are not allowed');
  }

  // Governance validation
  if (governance.quorumThreshold && governance.quorumThreshold > trustees.length) {
    errors.push('Quorum threshold cannot exceed the number of trustees');
  }

  // Warnings
  if (trustees.length === 1) {
    warnings.push('Single trustee setup reduces decentralization benefits');
  }

  if (trustees.length > 5) {
    warnings.push('Large number of trustees may slow down governance decisions');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Validate governance step
export const validateGovernanceStep = (
  governance: Partial<GovernanceSettings>,
  trusteesCount: number
): StepValidation => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate each field
  Object.entries(validationRules.governance).forEach(([fieldName, rules]) => {
    const fieldErrors = validateField(fieldName, governance[fieldName as keyof GovernanceSettings], rules);
    errors.push(...fieldErrors);
  });

  // Custom governance validation
  if (governance.quorumThreshold && governance.quorumThreshold > trusteesCount) {
    errors.push('Quorum threshold cannot exceed number of trustees');
  }

  if (governance.proposalThreshold && governance.proposalThreshold > trusteesCount) {
    errors.push('Proposal threshold cannot exceed number of trustees');
  }

  // Warnings
  if (governance.votingPeriod && governance.votingPeriod < 3) {
    warnings.push('Short voting period may not give trustees enough time to review');
  }

  if (governance.executionDelay === 0) {
    warnings.push('No execution delay reduces time for emergency intervention');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Validate deposit step
export const validateDepositStep = (deposit: Partial<DepositSettings>): StepValidation => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate each field
  Object.entries(validationRules.deposit).forEach(([fieldName, rules]) => {
    const fieldErrors = validateField(fieldName, deposit[fieldName as keyof DepositSettings], rules);
    errors.push(...fieldErrors);
  });

  // Custom deposit validation
  if (deposit.recurringDeposits && !deposit.recurringAmount) {
    errors.push('Recurring amount is required when recurring deposits are enabled');
  }

  if (deposit.recurringDeposits && !deposit.recurringFrequency) {
    errors.push('Recurring frequency is required when recurring deposits are enabled');
  }

  // Warnings
  if (deposit.initialDeposit && deposit.initialDeposit < 0.01) {
    warnings.push('Very small initial deposit may not be practical for gas costs');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Helper function to calculate annual distribution
const calculateAnnualDistribution = (amount: number, schedule: string): number => {
  switch (schedule) {
    case 'monthly': return amount * 12;
    case 'quarterly': return amount * 4;
    case 'annually': return amount;
    default: return amount * 12; // Default to monthly
  }
};

const toNumber = (value: unknown): number | null => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  }
  return null;
};

// Validate entire form
export const validateAllSteps = (
  settings: Partial<TrustSettings>,
  trustees: Trustee[],
  governance: Partial<GovernanceSettings>,
  deposit: Partial<DepositSettings>
): { [stepName: string]: StepValidation } => {
  return {
    settings: validateSettingsStep(settings),
    trustees: validateTrusteesStep(trustees, governance),
    governance: validateGovernanceStep(governance, trustees.length),
    deposit: validateDepositStep(deposit)
  };
};