// src/app/create-fund/components/TrusteesStep/components/TrusteePermissions.tsx
'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Checkbox,
  FormControlLabel,
  Divider,
  Alert
} from '@mui/material';
import { Security } from '@mui/icons-material';
import { TrusteePermissions as TrusteePermissionsType, StepValidation } from '@/types/create-trust';

interface TrusteePermissionsProps {
  permissions: TrusteePermissionsType;
  onUpdatePermissions: (permissions: TrusteePermissionsType) => void;
  validation?: StepValidation;
  trusteeCount: number;
}

const TrusteePermission: React.FC<TrusteePermissionsProps> = ({
  permissions,
  onUpdatePermissions,
  validation,
  trusteeCount,
}) => {
  // Permission options for the UI
  const permissionOptions = [
    { 
      key: 'canDissolve', 
      label: 'Can dissolve trust (Make Revocable)',
      description: 'Allows trustees to dissolve the trust completely'
    },
    { 
      key: 'canChangeBeneficiary', 
      label: 'Can change beneficiary',
      description: 'Allows trustees to modify trust beneficiaries'
    },
    { 
      key: 'canAdjustPayouts', 
      label: 'Can adjust payouts (max 20%)',
      description: 'Allows trustees to modify payout schedules within limits'
    },
    { 
      key: 'canAddRemoveTrustees', 
      label: 'Can add/remove trustees',
      description: 'Allows trustees to invite new trustees or remove existing ones'
    },
    { 
      key: 'canDisablePayouts', 
      label: 'Can disable payouts',
      description: 'Allows trustees to temporarily halt trust payouts'
    },
  ];

  // Handle permission changes
  const handlePermissionChange = (key: keyof TrusteePermissionsType) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onUpdatePermissions({
      ...permissions,
      [key]: event.target.checked,
    });
  };

  // Get field error from validation
  const getFieldError = (fieldName: string): string | undefined => {
    return validation?.errors.find(error => 
      error.toLowerCase().includes(fieldName.toLowerCase())
    );
  };

  const hasPermissionsError = !!getFieldError('permissions');

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
            <Security color="primary" />
            Trustee Permissions
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {trusteeCount > 0 
              ? `These permissions will apply to all ${trusteeCount} trustee${trusteeCount === 1 ? '' : 's'}`
              : 'These permissions will apply to all trustees you invite'
            }
          </Typography>
        </Box>

        {/* Validation Error Alert */}
        {hasPermissionsError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {getFieldError('permissions')}
          </Alert>
        )}

        {/* No Trustees Warning */}
        {trusteeCount === 0 && (
          <Alert severity="info" sx={{ mb: 3 }}>
            Add trustees above to configure their shared permissions
          </Alert>
        )}

        <Divider sx={{ mb: 4 }} />

        {/* Permissions Section */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Shared Permissions
          </Typography>
          <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
            Select the permissions that all trustees will have. These settings apply universally and cannot be customized per trustee.
          </Typography>
          
          <Box sx={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}>
            {permissionOptions.map((option) => (
              <Box key={option.key}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions[option.key as keyof TrusteePermissionsType]}
                      onChange={handlePermissionChange(option.key as keyof TrusteePermissionsType)}
                      disabled={trusteeCount === 0}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {option.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {option.description}
                      </Typography>
                    </Box>
                  }
                  sx={{ m: 0, alignItems: 'flex-start' }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Permission Summary */}
        {trusteeCount > 0 && (
          <Box sx={{ mt: 4, p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Permission Summary
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {Object.values(permissions).some(p => p) 
                ? `All trustees will have ${Object.values(permissions).filter(p => p).length} permission${Object.values(permissions).filter(p => p).length === 1 ? '' : 's'} enabled.`
                : 'All trustees will have no special permissions (view-only access).'
              }
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TrusteePermission;