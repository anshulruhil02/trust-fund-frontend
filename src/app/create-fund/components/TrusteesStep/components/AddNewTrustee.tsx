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
  walletAddressManager: WalletAddressManager;
  sharedPermissions: TrusteePermissions; // New prop for shared permissions
}

const AddNewTrustee: React.FC<AddNewTrusteeProps> = ({
  onAddTrustee,
  validation,
  walletAddressManager,
  sharedPermissions,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

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

    // Email validation - only validate if email is provided
    if (email && email.trim().length > 0 && !isValidEmail(email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    // Wallet address validation - only validate if address is provided
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

  // Handle form submission
  const handleAddTrustee = () => {
    // Require either name or email to be provided
    if (!name.trim() && !email.trim()) {
      return;
    }

    // Validate wallet address only if provided
    if (walletAddress.trim()) {
      const addressValidation = walletAddressManager.validateNewAddress(
        walletAddress.trim(), 
        'trustee'
      );

      if (!addressValidation.isValid) {
        return;
      }
    }

    // Validate email only if provided
    if (email.trim() && !isValidEmail(email.trim())) {
      return;
    }

    // Validate name only if provided
    if (name.trim() && name.trim().length < 2) {
      return;
    }

    const newTrustee: Omit<Trustee, 'id'> = {
      address: walletAddress.trim() || '', // Empty string if no wallet address
      name: name.trim() || undefined,
      email: email.trim() || undefined,
      role: 'trustee',
      isConfirmed: !!walletAddress.trim(), // Only confirmed if wallet address is provided
      permissions: sharedPermissions, // Use shared permissions
    };

    onAddTrustee(newTrustee);

    // Clear form after adding
    setName('');
    setEmail('');
    setWalletAddress('');
  };

  // Check if form is valid for submission
  const isFormValid = useMemo(() => {
    // Require at least name or email
    const hasIdentity = name.trim() || email.trim();
    if (!hasIdentity) return false;
    
    // Validate wallet address only if provided
    if (walletAddress.trim()) {
      const addressValidation = walletAddressManager.validateNewAddress(
        walletAddress.trim(), 
        'trustee'
      );
      
      if (!addressValidation.isValid) return false;
    }
    
    // Check other field validations
    return (
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
            Add trustees to help manage this trust. Trustees need either a name and email, and can optionally have a wallet address.
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
                Name
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
                  'Display name for this trustee'
                }
              />
            </Box>

            {/* Email Field */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Email
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
                  'Email for notifications'
                }
              />
            </Box>

            {/* Wallet Address Field */}
            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Wallet Address (Optional)
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
                  'Optional: Ethereum address for immediate confirmation'
                }
              />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Permissions Info Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Trustee Permissions
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Provide at least a name and email to add a trustee. Trustees with wallet addresses are automatically confirmed and ready to participate.
            </Typography>
          </Alert>

          {/* Current Permissions Summary */}
          <Box sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Current Permission Settings
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {Object.values(sharedPermissions).some(p => p) 
                ? `Trustees will have ${Object.values(sharedPermissions).filter(p => p).length} permission${Object.values(sharedPermissions).filter(p => p).length === 1 ? '' : 's'} enabled.`
                : 'Trustees will have view-only access (no special permissions).'
              }
              {walletAddress.trim() ? ' This trustee will be automatically confirmed.' : ' Trustees without wallet addresses will need to be confirmed later.'}
            </Typography>
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
            Add Trustee
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AddNewTrustee;