// src/app/create-fund/components/TrusteesStep/index.tsx
'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { Trustee, GovernanceSettings, TrusteePermissions, StepValidation } from '@/types/create-trust';
import { WalletAddressManager } from '@/hooks/useWalletAddressManager';

// Import subcomponents
import AddNewTrustee from './components/AddNewTrustee';
import InvitedTrustees from './components/InvitedTrustees';
import TrustConfiguration from './components/TrustConfiguration';
import TrusteePermission from './components/TrusteePermissions'; // New component

interface TrusteesStepProps {
  trustees: Trustee[];
  governance: Partial<GovernanceSettings>;
  sharedPermissions: TrusteePermissions; // New prop for shared permissions
  onAddTrustee: (trustee: Omit<Trustee, 'id'>) => void;
  onRemoveTrustee: (trusteeId: string) => void;
  onUpdateGovernance: (governance: Partial<GovernanceSettings>) => void;
  onUpdateSharedPermissions: (permissions: TrusteePermissions) => void; // New callback
  validation?: StepValidation;
  walletAddressManager: WalletAddressManager;
}

const TrusteesStep: React.FC<TrusteesStepProps> = ({
  trustees,
  governance,
  sharedPermissions,
  onAddTrustee,
  onRemoveTrustee,
  onUpdateGovernance,
  onUpdateSharedPermissions,
  validation,
  walletAddressManager,
}) => {
  // Handle adding trustee with shared permissions
  const handleAddTrustee = (trusteeData: Omit<Trustee, 'id'>) => {
    // Ensure the trustee uses the current shared permissions
    const trusteeWithSharedPermissions = {
      ...trusteeData,
      permissions: sharedPermissions,
    };
    onAddTrustee(trusteeWithSharedPermissions);
  };

  // Handle shared permissions update - also update existing trustees
  const handleUpdateSharedPermissions = (newPermissions: TrusteePermissions) => {
    onUpdateSharedPermissions(newPermissions);
    
    // Note: The parent component should handle updating all existing trustees' permissions
    // This ensures all trustees always have the same permissions
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
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
          Invite Trustees
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            maxWidth: 600,
            mx: 'auto'
          }}
        >
          Add trustees and configure their shared permissions
        </Typography>
      </Box>

      {/* Trustees Sections */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Add New Trustee */}
        <AddNewTrustee
          onAddTrustee={handleAddTrustee}
          validation={validation}
          walletAddressManager={walletAddressManager}
          sharedPermissions={sharedPermissions} // Pass shared permissions
        />

        {/* Invited Trustees List */}
        <InvitedTrustees
          trustees={trustees}
          onRemoveTrustee={onRemoveTrustee}
          walletAddressManager={walletAddressManager}
        />

        {/* Shared Trustee Permissions */}
        <TrusteePermission
          permissions={sharedPermissions}
          onUpdatePermissions={handleUpdateSharedPermissions}
          validation={validation}
          trusteeCount={trustees.length}
        />

        {/* Trust Configuration */}
        <TrustConfiguration
          trustees={trustees}
          governance={governance}
          onUpdateGovernance={onUpdateGovernance}
          validation={validation}
        />
      </Box>
    </Box>
  );
};

export default TrusteesStep;