'use client';

import React, { useState } from 'react'; // Removed useState, useEffect
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
} from '@mui/material';
import { Person, CheckCircle } from '@mui/icons-material';
import { TrustSettings, StepValidation, TrusteePermissions } from '@/types/create-trust';
import { WalletAddressManager } from '@/hooks/useWalletAddressManager';

interface BeneficiaryControlProps {
  settings: Partial<TrustSettings>;
  onUpdate: (settings: Partial<TrustSettings>) => void;
  validation?: StepValidation;
  hasAttemptedSubmit?: boolean;
  walletAddressManager: WalletAddressManager;
}

const BeneficiaryControl: React.FC<BeneficiaryControlProps> = ({
  settings,
  onUpdate,
  validation,
  hasAttemptedSubmit = false,
  walletAddressManager
}) => {
  // Mock connected wallet (in real app, this would come from wallet connection)
  const connectedWallet = '0x742d35Cc6634C05329925a3b8D4C9db96590b5b8';
  const [walletAddress, setWalletAddress] = useState('');
  // --- FIX: Read all values directly from the settings prop ---
  const creatorAddress = settings.creatorAddress || '';
  const beneficiaryAddress = settings.beneficiaryAddress || '';
  const distributionMethod = settings.distributionMethod || 'creator';
  const numberOfTrustees = settings.numberOfTrustees || 1;
  const quorumRequired = settings.quorumRequired || 1;
  const permissions = settings.trusteePermissions || {
      canDissolve: false,
      canChangeBeneficiary: false,
      canAdjustPayouts: false,
      canAddRemoveTrustees: false,
      canModifyAssetAllocation: false,
      canRemoveTrustee: false,
      canDisablePayouts: false,
  };

  // Distribution method options
  const distributionOptions = [
    { value: 'creator', label: 'All assets to creator' },
    { value: 'beneficiary', label: 'All assets to beneficiary' }
  ];

  // Trustee permission options
  const permissionOptions = [
    { key: 'canDissolve', label: 'Can dissolve trust (Make Revocable)' },
    { key: 'canChangeBeneficiary', label: 'Can change beneficiary' },
    { key: 'canAdjustPayouts', label: 'Can adjust payouts (max 10%)' },
    { key: 'canAddRemoveTrustees', label: 'Can add/remove trustees' },
    { key: 'canModifyAssetAllocation', label: 'Can modify asset allocation' },
    { key: 'canRemoveTrustee', label: 'Can remove Trustee' },
    { key: 'canDisablePayouts', label: 'Can Disable Payouts' },
  ];

  // --- FIX: Event handlers now call onUpdate directly ---
  const handlePermissionChange = (key: keyof TrusteePermissions) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newPermissions = {
      ...permissions,
      [key]: event.target.checked,
    };
    onUpdate({ trusteePermissions: newPermissions });
  };

  const useConnectedWalletAsCreator = () => {
    onUpdate({ creatorAddress: connectedWallet });
  };

  const useConnectedWalletAsBeneficiary = () => {
    onUpdate({ beneficiaryAddress: connectedWallet });
  };

  const getFieldError = (fieldName: string): string | undefined => {
    const errors: { [key: string]: string } = {};
    const warnings: { [key: string]: string } = {};
    // Wallet address validation using centralized manager
    if (walletAddress && walletAddress.trim().length > 0) {
      const addressValidation = walletAddressManager.validateNewAddress(
        walletAddress.trim(), 
        'trustee'
      );
      
      if (!addressValidation.isValid) {
        errors.walletAddress = addressValidation.error || 'Invalid address';
      } else if (addressValidation.warning) {
        warnings.walletAddress = addressValidation.warning;
      }
    }
    return undefined;
  };

  const isFieldError = (fieldName: string): boolean => {
    return !!getFieldError(fieldName);
  };

  const getAddressFeedback = (address: string): { error?: string; warning?: string } => {
    if (!address || address.trim().length === 0) {
      // Defer 'required' error to the main validation on submit
      return {}; 
    }
    // Use the manager for instant format/duplicate checks
    const validationResult = walletAddressManager.validateNewAddress(address, 'beneficiary');
    if (!validationResult.isValid) {
      return { error: validationResult.error };
    }
    if (validationResult.warning) {
      return { warning: validationResult.warning };
    }
    return {};
  };

  const creatorFeedback = getAddressFeedback(creatorAddress);
  const beneficiaryFeedback = getAddressFeedback(beneficiaryAddress);

  // Parent validation errors (from clicking "Next") should take precedence
  const finalCreatorError = hasAttemptedSubmit 
    ? validation?.errors.find(e => e.toLowerCase().includes('creator')) 
    : creatorFeedback.error;

  const finalBeneficiaryError = hasAttemptedSubmit
    ? validation?.errors.find(e => e.toLowerCase().includes('beneficiary'))
    : beneficiaryFeedback.error;

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent sx={{ p: 4 }}>
        {/* Section Header */}
        <Typography 
          variant="h5" 
          sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}
        >
          <Person color="primary" />
          Beneficiary & Trustee Control
        </Typography>

        {/* Creator Wallet Address */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Creator Wallet Address
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <TextField
              fullWidth
              value={creatorAddress}
              onChange={(e) => onUpdate({ creatorAddress: e.target.value })}
              placeholder="0x..."
              error={!!finalCreatorError}
              helperText={finalCreatorError || creatorFeedback.warning || "The wallet address of the trust's creator"}
              data-error={!!(hasAttemptedSubmit && validation?.errors.find(e => e.toLowerCase().includes('creator')))}
            />
            <Button
              variant="outlined"
              onClick={useConnectedWalletAsCreator}
              sx={{ minWidth: 200, py: 2 }}
            >
              Use Connected Wallet
            </Button>
          </Box>
        </Box>

        {/* Beneficiary Wallet Address */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Beneficiary Wallet Address
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <TextField
              fullWidth
              value={beneficiaryAddress}
              onChange={(e) => onUpdate({ beneficiaryAddress: e.target.value })}
              placeholder="0x..."
              error={!!finalBeneficiaryError}
              helperText={finalBeneficiaryError || beneficiaryFeedback.warning || "The wallet address of the beneficiary"}
               // Add a data-error attribute if the parent validation fails
              data-error={!!(hasAttemptedSubmit && validation?.errors.find(e => e.toLowerCase().includes('beneficiary')))}
            />
            <Button
              variant="outlined"
              onClick={useConnectedWalletAsBeneficiary}
              sx={{ minWidth: 200, py: 2 }}
            >
              Use Connected Wallet
            </Button>
          </Box>
        </Box>

        {/* Asset Distribution */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Asset Distribution on Trust Dissolution or Expiry
          </Typography>
          <FormControl fullWidth>
            <Select
              value={distributionMethod}
              onChange={(e) => onUpdate({ distributionMethod: e.target.value })}
            >
              {distributionOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Trustees Section */}
        <Box>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Trustees
          </Typography>
          <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
            <TextField
              label="Number of Trustees"
              fullWidth
              type="number"
              value={numberOfTrustees}
              onChange={(e) => onUpdate({ numberOfTrustees: Number(e.target.value) })}
              inputProps={{ min: 1, max: 10 }}
            />
            <TextField
              label="Quorum Required"
              fullWidth
              type="number"
              value={quorumRequired}
              onChange={(e) => onUpdate({ quorumRequired: Number(e.target.value) })}
              inputProps={{ min: 1, max: numberOfTrustees }}
              error={quorumRequired > numberOfTrustees}
              helperText={
                quorumRequired > numberOfTrustees 
                  ? 'Quorum cannot exceed number of trustees' 
                  : ''
              }
            />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Trustee Permissions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {permissionOptions.map((option) => (
                <FormControlLabel
                  key={option.key}
                  control={
                    <Checkbox
                      checked={permissions[option.key as keyof TrusteePermissions]}
                      onChange={handlePermissionChange(option.key as keyof TrusteePermissions)}
                    />
                  }
                  label={option.label}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BeneficiaryControl;
