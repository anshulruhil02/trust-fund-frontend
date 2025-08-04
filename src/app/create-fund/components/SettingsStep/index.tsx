'use client';
import React from 'react'; // Removed useMemo
import { Box, Typography } from '@mui/material';
import { StepValidation, TrustSettings } from '@/types/create-trust';
// Import sub-components
import TrustNameDuration from './components/TrustNameDuration';
import AssetAllocation from './components/AssetAllocation';
import PayoutSettings from './components/PayoutSettings';
import BeneficiaryControl from './components/BeneficiaryControl';
import ValidationSummary from './components/ValidationSummary';
import { WalletAddressManager } from '@/hooks/useWalletAddressManager';



interface SettingsStepProps {
  settings: Partial<TrustSettings>;
  onUpdate: (settings: Partial<TrustSettings>) => void;
  validation?: StepValidation; // Prop to receive validation state from parent
  hasAttemptedSubmit?: boolean; // Prop to receive submission attempt state from parent
  walletAddressManager: WalletAddressManager;
}

const SettingsStep: React.FC<SettingsStepProps> = ({
  settings,
  onUpdate,
  validation, // Receive validation state as a prop
  hasAttemptedSubmit, // Receive submission attempt state as a prop
  walletAddressManager
}) => {

  // This function correctly merges updates.
  const handleSettingsUpdate = (updates: Partial<TrustSettings>) => {
    onUpdate({ ...settings, ...updates });
  };

  // No longer needs its own validation logic; it's all passed from the parent.

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      {/* Page Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: 'bold', mb: 2, color: 'text.primary' }}
        >
          Create Your Trust
        </Typography>
        <Typography
          variant="h6"
          sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}
        >
          Configure your trust settings and beneficiary details
        </Typography>
      </Box>

      {/* Settings Sections */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {/* Pass the validation props down to each child component */}
        <TrustNameDuration
          settings={settings}
          onUpdate={handleSettingsUpdate}
          validation={validation}
          hasAttemptedSubmit={hasAttemptedSubmit}
        />
        {/* <AssetAllocation
          settings={settings}
          onUpdate={handleSettingsUpdate}
          validation={validation}
          hasAttemptedSubmit={hasAttemptedSubmit} 
        /> */}
        <PayoutSettings
          settings={settings}
          onUpdate={handleSettingsUpdate}
          validation={validation}
          hasAttemptedSubmit={hasAttemptedSubmit}
        />
        <BeneficiaryControl
          settings={settings}
          onUpdate={handleSettingsUpdate}
          // validation={validation}
          // hasAttemptedSubmit={hasAttemptedSubmit}
          walletAddressManager={walletAddressManager}
        />

        {/* Display a summary of errors if the user has tried to submit */}
        {hasAttemptedSubmit && validation && !validation.isValid && (
          <ValidationSummary validation={validation} />
        )}
      </Box>
    </Box>
  );
};

export default SettingsStep;
