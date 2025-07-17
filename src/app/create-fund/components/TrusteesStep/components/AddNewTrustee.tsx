// src/app/create-fund/components/TrusteesStep/components/AddNewTrustee.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button,
  Checkbox,
  FormControlLabel,
  Divider,
  Alert
} from '@mui/material';
import { PersonAdd } from '@mui/icons-material';
import { Trustee, TrusteePermissions, StepValidation } from '@/types/create-trust';
import { isValidEmail } from '@/utils/trustValidation';
import { WalletAddressManager } from '@/hooks/useWalletAddressManager';

interface AddNewTrusteeProps {
  onAddTrustee: (trustee: Omit<Trustee, 'id'>) => void;
  validation?: StepValidation;
  walletAddressManager: WalletAddressManager; // Use centralized manager
}

const AddNewTrustee: React.FC<AddNewTrusteeProps> = ({
  onAddTrustee,
  validation,
  walletAddressManager,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [permissions, setPermissions] = useState<TrusteePermissions>({
    canDissolve: false,
    canChangeBeneficiary: false,
    canAdjustPayouts: false,
    canAddRemoveTrustees: false,
    canModifyAssetAllocation: false,
    canRemoveTrustee: false,
    canDisablePayouts: false,
  });

  // Permission options for the UI
  const permissionOptions = [
    { key: 'canDissolve', label: 'Can dissolve trust (Make Revocable)' },
    { key: 'canChangeBeneficiary', label: 'Can change beneficiary' },
    { key: 'canAdjustPayouts', label: 'Can adjust payouts (max 10%)' },
    { key: 'canAddRemoveTrustees', label: 'Can add/remove trustees' },
    { key: 'canModifyAssetAllocation', label: 'Can modify asset allocation' },
    { key: 'canRemoveTrustee', label: 'Can remove Trustee' },
    { key: 'canDisablePayouts', label: 'Can Disable Payouts' },
  ];

  // Real-time field validation using wallet address manager
  const fieldValidation = useMemo(() => {
    const errors: { [key: string]: string } = {};
    const warnings: { [key: string]: string } = {};
    
    // Name validation
    if (name && name.trim().length > 0 && name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    if (name && name.trim().length > 50) {
      errors.name = 'Name must be less than 50 characters';
    }

    // Email validation
    if (email && email.trim().length > 0 && !isValidEmail(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

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

    return { errors, warnings };
  }, [name, email, walletAddress, walletAddressManager]);

  // Handle permission changes
  const handlePermissionChange = (key: keyof TrusteePermissions) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPermissions(prev => ({
      ...prev,
      [key]: event.target.checked,
    }));
  };

  // Handle form submission
  const handleAddTrustee = () => {
    // Final validation before submitting using centralized manager
    if (!walletAddress.trim()) {
      return;
    }

    const addressValidation = walletAddressManager.validateNewAddress(
      walletAddress.trim(), 
      'trustee'
    );

    if (!addressValidation.isValid) {
      return;
    }

    if (email.trim() && !isValidEmail(email.trim())) {
      return;
    }

    if (name.trim() && name.trim().length < 2) {
      return;
    }

    const newTrustee: Omit<Trustee, 'id'> = {
      address: walletAddress.trim(),
      name: name.trim() || undefined,
      email: email.trim() || undefined,
      role: 'trustee',
      isConfirmed: false,
      permissions: permissions,  
    };

    onAddTrustee(newTrustee);

    // Clear form after adding
    setName('');
    setEmail('');
    setWalletAddress('');
    setPermissions({
      canDissolve: false,
      canChangeBeneficiary: false,
      canAdjustPayouts: false,
      canAddRemoveTrustees: false,
      canModifyAssetAllocation: false,
      canRemoveTrustee: false,
      canDisablePayouts: false,
    });
  };

  // Check if form is valid for submission
  const isFormValid = useMemo(() => {
    if (!walletAddress.trim()) return false;
    
    const addressValidation = walletAddressManager.validateNewAddress(
      walletAddress.trim(), 
      'trustee'
    );
    
    return (
      addressValidation.isValid &&
      (!email.trim() || isValidEmail(email.trim())) &&
      (!name.trim() || name.trim().length >= 2) &&
      Object.keys(fieldValidation.errors).length === 0
    );
  }, [walletAddress, email, name, walletAddressManager, fieldValidation.errors]);

  // Get field error from validation (for external validation errors)
  const getFieldError = (fieldName: string): string | undefined => {
    return validation?.errors.find(error => 
      error.toLowerCase().includes(fieldName.toLowerCase())
    );
  };

  const isFieldError = (fieldName: string): boolean => {
    return !!getFieldError(fieldName);
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent sx={{ p: 4 }}>
        {/* Section Header */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 2, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              fontWeight: 600
            }}
          >
            <PersonAdd color="primary" />
            Add New Trustee
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Invite trustees to help manage this trust
          </Typography>
        </Box>

        {/* Address validation warnings */}
        {fieldValidation.warnings.walletAddress && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            {fieldValidation.warnings.walletAddress}
          </Alert>
        )}

        {/* Basic Information */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Trustee Information
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              md: '1fr 1fr 1fr' 
            }, 
            gap: 3, 
            mb: 3
          }}>
            {/* Name Field */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Name (Optional)
              </Typography>
              <TextField
                fullWidth
                placeholder="Trustee name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!fieldValidation.errors.name || isFieldError('trustee name')}
                helperText={
                  fieldValidation.errors.name || 
                  getFieldError('trustee name') ||
                  'Optional: Display name for this trustee'
                }
              />
            </Box>

            {/* Email Field */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Email (Optional)
              </Typography>
              <TextField
                fullWidth
                type="email"
                placeholder="trustee@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!fieldValidation.errors.email || isFieldError('trustee email')}
                helperText={
                  fieldValidation.errors.email || 
                  getFieldError('trustee email') ||
                  'Optional: Email for notifications'
                }
              />
            </Box>

            {/* Wallet Address Field */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Wallet Address *
              </Typography>
              <TextField
                fullWidth
                placeholder="0x..."
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                error={
                  !!fieldValidation.errors.walletAddress || 
                  isFieldError('trustee address') || 
                  isFieldError('wallet address')
                }
                helperText={
                  fieldValidation.errors.walletAddress ||
                  getFieldError('trustee address') || 
                  getFieldError('wallet address') || 
                  'Required: Valid Ethereum address (0x...)'
                }
                required
              />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Permissions Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Trustee Permissions
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            Select the permissions this trustee will have. These cannot be changed after the invitation is accepted.
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
            gap: 2 
          }}>
            {permissionOptions.map((option) => (
              <FormControlLabel
                key={option.key}
                control={
                  <Checkbox
                    checked={permissions[option.key as keyof TrusteePermissions]}
                    onChange={handlePermissionChange(option.key as keyof TrusteePermissions)}
                  />
                }
                label={
                  <Typography variant="body2">
                    {option.label}
                  </Typography>
                }
                sx={{ m: 0 }}
              />
            ))}
          </Box>
        </Box>

        {/* Send Invitation Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleAddTrustee}
            disabled={!isFormValid}
            sx={{ 
              minWidth: 160,
              py: 2,
              fontWeight: 600
            }}
          >
            Send Invitation
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AddNewTrustee;