// src/app/create-fund/components/TrusteesStep/index.tsx
'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { Trustee, GovernanceSettings, StepValidation } from '@/types/create-trust';
import { WalletAddressManager } from '@/hooks/useWalletAddressManager';

// Import subcomponents
import AddNewTrustee from './components/AddNewTrustee';
import InvitedTrustees from './components/InvitedTrustees';
import TrustConfiguration from './components/TrustConfiguration';

interface TrusteesStepProps {
  trustees: Trustee[];
  governance: Partial<GovernanceSettings>;
  onAddTrustee: (trustee: Omit<Trustee, 'id'>) => void;
  onRemoveTrustee: (trusteeId: string) => void;
  onUpdateGovernance: (governance: Partial<GovernanceSettings>) => void;
  validation?: StepValidation;
  walletAddressManager: WalletAddressManager; // New prop
}

const TrusteesStep: React.FC<TrusteesStepProps> = ({
  trustees,
  governance,
  onAddTrustee,
  onRemoveTrustee,
  onUpdateGovernance,
  validation,
  walletAddressManager,
}) => {
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
          Add trustees and configure their permissions
        </Typography>
      </Box>

      {/* Trustees Sections */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Add New Trustee */}
        <AddNewTrustee
          onAddTrustee={onAddTrustee}
          validation={validation}
          walletAddressManager={walletAddressManager} // Pass address manager
        />

        {/* Invited Trustees List */}
        <InvitedTrustees
          trustees={trustees}
          onRemoveTrustee={onRemoveTrustee}
          walletAddressManager={walletAddressManager} // Pass address manager
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