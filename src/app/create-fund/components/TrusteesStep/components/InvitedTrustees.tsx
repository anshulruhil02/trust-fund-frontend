// src/app/create-fund/components/TrusteesStep/components/InvitedTrustees.tsx
'use client';

import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material';
import { 
  Group, 
  PersonRemove, 
  CheckCircle, 
  HourglassEmpty,
  Warning
} from '@mui/icons-material';
import { Trustee, StepValidation } from '@/types/create-trust';
import { WalletAddressManager } from '@/hooks/useWalletAddressManager';

interface InvitedTrusteesProps {
  trustees: Trustee[];
  onRemoveTrustee: (trusteeId: string) => void;
  onUpdateTrustee: (trusteeId: string, updates: Partial<Trustee>) => void;
  validation?: StepValidation;
  walletAddressManager: WalletAddressManager; // Add wallet address manager
}

const InvitedTrustees: React.FC<InvitedTrusteesProps> = ({
  trustees,
  onRemoveTrustee,
  onUpdateTrustee,
  validation,
  walletAddressManager,
}) => {
  // Handle remove trustee with logging for debugging
  const handleRemoveTrustee = (trusteeId: string) => {
    console.log('Removing trustee with ID:', trusteeId);
    onRemoveTrustee(trusteeId);
  };

  // Get trustee initials for avatar
  const getTrusteeInitials = (trustee: Trustee): string => {
    if (trustee.name) {
      const names = trustee.name.split(' ');
      if (names.length >= 2) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
      }
      return trustee.name[0].toUpperCase();
    }
    return trustee.address.slice(2, 3).toUpperCase();
  };

  // Get trustee display name
  const getTrusteeDisplayName = (trustee: Trustee): string => {
    return trustee.name || `${trustee.address.slice(0, 6)}...${trustee.address.slice(-4)}`;
  };

  // Get status information
  const getStatusInfo = (trustee: Trustee) => {
    if (trustee.isConfirmed) {
      return {
        label: 'Confirmed',
        color: 'success' as const,
        icon: <CheckCircle sx={{ fontSize: 16 }} />
      };
    }
    return {
      label: 'Pending',
      color: 'warning' as const,
      icon: <HourglassEmpty sx={{ fontSize: 16 }} />
    };
  };

  // Get granted permissions list
  const getGrantedPermissions = (trustee: Trustee): string[] => {
    if (!trustee.permissions) return [];
    
    const permissionLabels: { [key: string]: string } = {
      canDissolve: 'Can dissolve trust',
      canChangeBeneficiary: 'Can change beneficiary',
      canAdjustPayouts: 'Can adjust payouts',
      canAddRemoveTrustees: 'Can add/remove trustees',
      canModifyAssetAllocation: 'Can modify asset allocation',
      canRemoveTrustee: 'Can remove trustees',
      canDisablePayouts: 'Can disable payouts',
    };

    return Object.entries(trustee.permissions)
      .filter(([_, value]) => value === true)
      .map(([key, _]) => permissionLabels[key])
      .filter(Boolean);
  };

  // Check for address conflicts using wallet address manager
  const getAddressWarning = (trustee: Trustee): string | null => {
    const usage = walletAddressManager.getAddressUsage(trustee.address);
    const otherRoles = usage.filter(u => !(u.type === 'trustee' && u.id === trustee.id));
    
    if (otherRoles.length > 0) {
      const roles = otherRoles.map(u => u.type).join(', ');
      return `This address is also used as: ${roles}`;
    }
    
    return null;
  };

  // Empty state component
  const EmptyState = () => (
    <Box sx={{ 
      py: 8, 
      textAlign: 'center', 
      color: 'text.secondary',
      backgroundColor: 'grey.50',
      borderRadius: 2
    }}>
      <Group sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
      <Typography variant="h6" sx={{ mb: 1 }}>
        No trustees added yet
      </Typography>
      <Typography variant="body2">
        Add trustees above to help manage your trust
      </Typography>
    </Box>
  );

  // Trustee card component
  const TrusteeCard = ({ trustee }: { trustee: Trustee }) => {
    const statusInfo = getStatusInfo(trustee);
    const grantedPermissions = getGrantedPermissions(trustee);
    const addressWarning = getAddressWarning(trustee);
    const canEdit = !trustee.isConfirmed; // Can only edit pending invitations

    return (
      <Card sx={{ 
        mb: 3, 
        borderRadius: 2, 
        border: '1px solid',
        borderColor: trustee.isConfirmed ? 'success.light' : 'warning.light',
        '&:hover': {
          boxShadow: 2
        }
      }}>
        <CardContent sx={{ p: 3 }}>
          {/* Address Warning Alert */}
          {addressWarning && (
            <Alert 
              severity="warning" 
              icon={<Warning />}
              sx={{ mb: 2 }}
            >
              {addressWarning}
            </Alert>
          )}

          {/* Trustee Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ 
                bgcolor: trustee.isConfirmed ? 'success.main' : 'warning.main', 
                width: 48, 
                height: 48,
                fontSize: '1.2rem',
                fontWeight: 600
              }}>
                {getTrusteeInitials(trustee)}
              </Avatar>
              
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {getTrusteeDisplayName(trustee)}
                </Typography>
                {trustee.email && (
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {trustee.email}
                  </Typography>
                )}
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  {trustee.address}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip 
                label={statusInfo.label}
                icon={statusInfo.icon}
                size="small"
                color={statusInfo.color}
                variant="outlined"
              />
              
              <Tooltip title={canEdit ? "Cancel invitation" : "Remove trustee"}>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleRemoveTrustee(trustee.id)}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'error.light',
                      color: 'error.contrastText'
                    }
                  }}
                >
                  <PersonRemove />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Debug Info - Remove this in production */}
          <Box sx={{ mb: 2, p: 1, backgroundColor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Debug: Trustee ID = {trustee.id}
            </Typography>
          </Box>

          {/* Permissions Section */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Granted Permissions
            </Typography>
            
            {grantedPermissions.length > 0 ? (
              <List dense sx={{ p: 0 }}>
                {grantedPermissions.map((permission, index) => (
                  <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={
                        <Typography variant="body2">
                          {permission}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ 
                py: 2, 
                px: 3, 
                backgroundColor: 'grey.50', 
                borderRadius: 1,
                textAlign: 'center'
              }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  No permissions granted
                </Typography>
              </Box>
            )}
          </Box>

          {/* Status-specific messages */}
          {!trustee.isConfirmed && (
            <Box sx={{ 
              mt: 2, 
              p: 2, 
              backgroundColor: 'warning.50', 
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'warning.200'
            }}>
              <Typography variant="body2" sx={{ color: 'warning.dark' }}>
                📧 Invitation sent - awaiting trustee acceptance
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent sx={{ p: 4 }}>
        {/* Section Header */}
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
          <Group color="primary" />
          Invited Trustees ({trustees.length})
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
          Manage trustees and their permissions
        </Typography>

        {/* Content */}
        {trustees.length === 0 ? (
          <EmptyState />
        ) : (
          <Box>
            {trustees.map((trustee) => (
              <TrusteeCard key={trustee.id} trustee={trustee} />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default InvitedTrustees;