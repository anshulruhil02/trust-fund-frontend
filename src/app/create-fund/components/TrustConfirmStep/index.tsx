// src/app/create-fund/components/TrusteeConfirmationStep/index.tsx
'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  Divider,
  Alert,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  CheckCircle,
  Schedule,
  Email,
  Settings,
  Refresh
} from '@mui/icons-material';
import { Trustee, StepValidation } from '@/types/create-trust';

interface TrusteeConfirmationStepProps {
  trustees: Trustee[];
  onResendInvites: () => void;
  onManualAssignment?: (trusteeId: string, walletAddress: string) => void;
  onDeployTrust?: () => Promise<void>;
  validation?: StepValidation;
  isSubmitting?: boolean;
}

const TrusteeConfirmationStep: React.FC<TrusteeConfirmationStepProps> = ({
  trustees,
  onResendInvites,
  onManualAssignment,
  onDeployTrust,
  validation,
  isSubmitting = false,
}) => {
  const [isResending, setIsResending] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);
  const [manualAssignmentDialog, setManualAssignmentDialog] = useState<{
    open: boolean;
    trustee: Trustee | null;
  }>({
    open: false,
    trustee: null,
  });
  const [walletAddress, setWalletAddress] = useState('');
  const [addressError, setAddressError] = useState('');

  // Calculate confirmation stats
  const confirmedTrustees = trustees.filter(trustee => trustee.isConfirmed);
  const pendingTrustees = trustees.filter(trustee => !trustee.isConfirmed);
  const totalTrustees = trustees.length;
  const confirmationRate = totalTrustees > 0 ? confirmedTrustees.length / totalTrustees : 0;

  // Handle resend invites
  const handleResendInvites = async () => {
    setIsResending(true);
    try {
      await onResendInvites();
    } finally {
      setIsResending(false);
    }
  };

  // Handle manual assignment dialog
  const handleOpenManualAssignment = (trustee: Trustee) => {
    setManualAssignmentDialog({
      open: true,
      trustee,
    });
    setWalletAddress('');
    setAddressError('');
  };

  const handleCloseManualAssignment = () => {
    setManualAssignmentDialog({
      open: false,
      trustee: null,
    });
    setWalletAddress('');
    setAddressError('');
  };

  const handleConfirmManualAssignment = () => {
    // Basic wallet address validation
    if (!walletAddress.trim()) {
      setAddressError('Wallet address is required');
      return;
    }

    if (!walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      setAddressError('Please enter a valid Ethereum address (0x...)');
      return;
    }

    if (manualAssignmentDialog.trustee && onManualAssignment) {
      onManualAssignment(manualAssignmentDialog.trustee.id, walletAddress.trim());
      handleCloseManualAssignment();
    }
  };

  const handleWalletAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setWalletAddress(value);
    
    // Clear error when user starts typing
    if (addressError) {
      setAddressError('');
    }
  };

  // Get initials for avatar
  const getInitials = (name?: string, address?: string): string => {
    if (name && name.trim()) {
      return name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (address) {
      return address.slice(2, 4).toUpperCase();
    }
    return '??';
  };

  // Format wallet address
  const formatAddress = (address: string): string => {
    if (!address || address.trim() === '') {
      return 'No wallet address';
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Get status details
  const getStatusDetails = (trustee: Trustee) => {
    if (trustee.isConfirmed) {
      return {
        icon: <CheckCircle sx={{ fontSize: 16 }} />,
        label: 'Ready',
        color: 'success' as const,
        timeText: 'Confirmed' // This would come from actual data
      };
    } else {
      return {
        icon: <Schedule sx={{ fontSize: 16 }} />,
        label: 'Pending',
        color: 'warning' as const,
        timeText: 'Needs wallet address' // This would come from actual data
      };
    }
  };

  // Check if we can proceed (all trustees must be confirmed to deploy)
  const canProceed = confirmedTrustees.length === totalTrustees && totalTrustees > 0;

  // Handle deploy trust
  const handleDeployTrust = async () => {
    if (!canProceed || !onDeployTrust) return;
    
    setIsDeploying(true);
    try {
      await onDeployTrust();
      setIsDeployed(true);
    } catch (error) {
      console.error('Failed to deploy trust:', error);
      // In a real app, you'd show an error message to the user
    } finally {
      setIsDeploying(false);
    }
  };

  // If deployed, show success message
  if (isDeployed) {
    return (
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 3, textAlign: 'center' }}>
        <Box sx={{ mb: 4 }}>
          <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, color: 'success.main' }}>
            Trust Deployed Successfully!
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4 }}>
            Your trust has been created on the blockchain and trustees have been notified.
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 4 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Trust Summary
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Total Trustees:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {totalTrustees}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Confirmed Trustees:
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                {confirmedTrustees.length}/{totalTrustees}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
              Your trustees can now manage the trust according to their assigned permissions.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      {/* Page Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            color: 'text.primary'
          }}
        >
          Trustee Confirmation
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            maxWidth: 500,
            mx: 'auto'
          }}
        >
          Review your trustees and proceed to fund your trust
        </Typography>
      </Box>

      {/* Invitation Status Summary */}
      <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Invitation Status
            </Typography>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {confirmedTrustees.length}/{totalTrustees}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Confirmed
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            {confirmedTrustees.length} of {totalTrustees} trustees are ready to participate
          </Typography>

          {/* Progress indicator */}
          <Box sx={{ 
            bgcolor: 'grey.200', 
            borderRadius: 1, 
            height: 8, 
            mb: 2,
            overflow: 'hidden'
          }}>
            <Box sx={{ 
              bgcolor: 'success.main', 
              height: '100%', 
              width: `${confirmationRate * 100}%`,
              transition: 'width 0.3s ease'
            }} />
          </Box>
        </CardContent>
      </Card>

      {/* Trustees List */}
      <Card sx={{ borderRadius: 3, boxShadow: 2, mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {trustees.map((trustee) => {
              const status = getStatusDetails(trustee);
              
              return (
                <Box key={trustee.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    {/* Avatar */}
                    <Avatar sx={{ 
                      width: 48, 
                      height: 48, 
                      bgcolor: trustee.isConfirmed ? 'success.main' : 'grey.400',
                      fontWeight: 'bold'
                    }}>
                      {getInitials(trustee.name, trustee.address)}
                    </Avatar>

                    {/* Trustee Info */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {trustee.name || 'Unnamed Trustee'}
                      </Typography>
                      {trustee.email && (
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                          {trustee.email}
                        </Typography>
                      )}
                      <Typography variant="body2" sx={{ 
                        color: trustee.address && trustee.address.trim() 
                          ? 'text.secondary' 
                          : 'warning.main', 
                        fontFamily: trustee.address && trustee.address.trim() 
                          ? 'monospace' 
                          : 'inherit' 
                      }}>
                        Wallet: {formatAddress(trustee.address)}
                      </Typography>
                    </Box>

                    {/* Status */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ textAlign: 'right' }}>
                        <Chip
                          icon={status.icon}
                          label={status.label}
                          color={status.color}
                          size="small"
                          sx={{ mb: 0.5 }}
                        />
                        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                          {status.timeText}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Manual Assignment Option for Pending */}
                  {!trustee.isConfirmed && (
                    <Box sx={{ ml: 7, mt: 2 }}>
                      <Button
                        variant="text"
                        size="small"
                        startIcon={<Settings />}
                        onClick={() => handleOpenManualAssignment(trustee)}
                        sx={{ color: 'text.secondary', fontSize: '0.875rem' }}
                      >
                        Add wallet address
                      </Button>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>

          {/* Resend Invites Button - Hidden since trustees are auto-confirmed */}
          {pendingTrustees.length > 0 && (
            <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Alert severity="info" sx={{ textAlign: 'left' }}>
                  <Typography variant="body2">
                    Complete trustee setup by adding wallet addresses above.
                  </Typography>
                </Alert>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Deployment Section */}
      <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Ready to deploy?
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
              Your trust will be created on the blockchain and trustees will be notified.
            </Typography>

            {/* Deployment Status */}
            {!canProceed && (
              <Alert severity="info" sx={{ mb: 4, textAlign: 'left' }}>
                <Typography variant="body2">
                  All trustees must have wallet addresses to deploy the trust. 
                  {pendingTrustees.length > 0 && ` ${pendingTrustees.length} trustee${pendingTrustees.length === 1 ? '' : 's'} still need${pendingTrustees.length === 1 ? 's' : ''} wallet addresses.`}
                </Typography>
              </Alert>
            )}

            {canProceed && (
              <Alert severity="success" sx={{ mb: 4, textAlign: 'left' }}>
                <Typography variant="body2">
                  Perfect! All trustees are ready. You can now deploy your trust.
                </Typography>
              </Alert>
            )}

            {/* Deploy Button */}
            <Button
              variant="contained"
              size="large"
              onClick={handleDeployTrust}
              disabled={!canProceed || isDeploying || isSubmitting}
              sx={{ 
                minWidth: 200,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 600
              }}
            >
              {isDeploying ? 'Deploying...' : 'Deploy Your Trust'}
            </Button>

            {/* Validation Errors */}
            {validation && validation.errors.length > 0 && (
              <Alert severity="error" sx={{ mb: 4, textAlign: 'left' }}>
                <Typography variant="body2">
                  {validation.errors.join(', ')}
                </Typography>
              </Alert>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Manual Assignment Dialog */}
      <Dialog
        open={manualAssignmentDialog.open}
        onClose={handleCloseManualAssignment}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ 
              width: 40, 
              height: 40, 
              bgcolor: 'grey.400',
              fontWeight: 'bold',
              fontSize: '0.875rem'
            }}>
              {manualAssignmentDialog.trustee && getInitials(
                manualAssignmentDialog.trustee.name, 
                manualAssignmentDialog.trustee.address
              )}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {manualAssignmentDialog.trustee?.name || 'Unnamed Trustee'}
              </Typography>
              {manualAssignmentDialog.trustee?.email && (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {manualAssignmentDialog.trustee.email}
                </Typography>
              )}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
            <Chip
              icon={<Schedule sx={{ fontSize: 16 }} />}
              label="Pending"
              color="warning"
              size="small"
            />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Needs wallet address
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            Enter the wallet address to complete this trustee's setup.
          </Typography>
          
          <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
            Enter Wallet Address
          </Typography>
          <TextField
            fullWidth
            placeholder="0x..."
            value={walletAddress}
            onChange={handleWalletAddressChange}
            error={!!addressError}
            helperText={addressError || 'Enter a valid Ethereum address (0x...)'}
            sx={{ mb: 2 }}
            autoFocus
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={handleCloseManualAssignment}
            variant="outlined"
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmManualAssignment}
            variant="contained"
            disabled={!walletAddress.trim()}
            sx={{ minWidth: 100 }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrusteeConfirmationStep;