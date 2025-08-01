// src/app/create-fund/components/DepositStep/index.tsx
'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { StepValidation } from '@/types/create-trust';

// Import sub-components (to be created)
import AssetAllocationSummary from './components/AssetAllocationSummarry';
import WalletApprovals from './components/WalletApprovals';

interface DepositStepProps {
  validation?: StepValidation;
  walletConnected: boolean;
}

const DepositStep: React.FC<DepositStepProps> = ({
  validation,
  walletConnected,
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
          Deposit Assets
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            maxWidth: 600,
            mx: 'auto'
          }}
        >
          Review allocation and deposit your assets
        </Typography>
      </Box>

      {/* Deposit Sections */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Asset Allocation Summary */}
        <AssetAllocationSummary/>

        {/* Wallet & Approvals */}
        <WalletApprovals
          validation={validation}
          walletConnected={walletConnected}
        />
      </Box>
    </Box>
  );
};

export default DepositStep;