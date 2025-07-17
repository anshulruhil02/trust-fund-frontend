'use client';

import React, { useState, useCallback } from 'react';
import { Box, Container, Button, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import CreateTrustHeader from './components/CreateTrustHeader';
import SettingsStep from './components/SettingsStep';
import TrusteesStep from './components/TrusteesStep';
import DepositStep from './components/DepositAssetStep';
import ReviewStep from './components/ReviewStep';
import { useCreateTrust } from '@/hooks/useCreateTrust';
import { 
  validateSettingsStep,
  validateTrusteesStep, 
  validateGovernanceStep,
  validateDepositStep 
} from '@/utils/trustValidation';

export default function CreateFundPage() {
  const router = useRouter();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [hasAttemptedNext, setHasAttemptedNext] = useState(false);
  
  const {
    steps,
    currentStep,
    progressPercentage,
    formData,
    isSubmitting,
    isFirstStep,
    isLastStep,
    nextStep,
    previousStep,
    goToStep,
    updateFormData,
    addTrustee,
    removeTrustee,
    updateTrustee,
    setWalletConnected,
    walletAddressManager,
  } = useCreateTrust();

  // Validate current step on-demand
  const validateCurrentStep = useCallback(() => {
    switch (currentStep) {
      case 1:
        return validateSettingsStep(formData.settings);
      case 2:
        return validateTrusteesStep(formData.trustees, formData.governance);
      case 3:
        return validateGovernanceStep(formData.governance, formData.trustees.length);
      case 4:
        return validateDepositStep(formData.deposit);
      default:
        return { isValid: false, errors: ['Invalid step'], warnings: [] };
    }
  }, [currentStep, formData]);

  // Handle wallet connection
  const handleConnectWallet = () => {
    setIsWalletConnected(true);
    setWalletConnected(true);
    console.log('Connecting wallet...');
  };

  // Handle step navigation
  const handleStepClick = (stepNumber: number) => {
    if (stepNumber <= currentStep || steps[stepNumber - 1]?.isCompleted) {
      goToStep(stepNumber);
      setHasAttemptedNext(false); // Reset validation state when navigating
    }
  };

  // Handle next step with validation
  const handleNext = () => {
    setHasAttemptedNext(true);

    // TO-DO inculde with other navigation logic once the backend is setup
    if (isLastStep ) {
      handleSubmit();
    }
    
    const validation = validateCurrentStep();
    
    if (!validation.isValid) {
      setTimeout(() => {
        const firstErrorElement = document.querySelector('[data-error="true"]');
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 10);
      return; // Block navigation
    }

    if (!isLastStep) {
      nextStep();
      setHasAttemptedNext(false); // Reset for next step
    }
    //  else {
    //   handleSubmit();
    // }
  };

  // Handle previous step
  const handlePrevious = () => {
    previousStep();
    setHasAttemptedNext(false); // Reset validation state
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      console.log('Trust created successfully:');
      router.push('/dashboard');
    } catch (error) {
      console.error('Trust creation failed:', error);
    }
  };

  // Get current validation state
  const currentValidation = validateCurrentStep();

  // Render current step content
  const renderStepContent = () => {
    const baseProps = {
      validation: currentValidation,
      hasAttemptedSubmit: hasAttemptedNext,
    };

    switch (currentStep) {
      case 1:
        return (
          <SettingsStep
            settings={formData.settings}
            onUpdate={(settings) => updateFormData('settings', settings)}
            walletAddressManager={walletAddressManager}
            {...baseProps} // *** FIX: Added props here to pass validation state down ***
          />
        );
      case 2:
        return (
          <TrusteesStep
            trustees={formData.trustees}
            governance={formData.governance}
            onAddTrustee={addTrustee}
            onRemoveTrustee={removeTrustee}
            onUpdateGovernance={(governance) => updateFormData('governance', governance)}
            walletAddressManager={walletAddressManager}
            {...baseProps}
          />
        );
      case 3:
        return (
          <DepositStep
            walletConnected={isWalletConnected}
            {...baseProps}
          />
        );
      case 4:
        return (
          <ReviewStep
            formData={formData}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Header with Stepper */}
      <CreateTrustHeader
        steps={steps}
        currentStep={currentStep}
        progressPercentage={progressPercentage}
        onStepClick={handleStepClick}
        walletConnected={isWalletConnected}
        onConnectWallet={handleConnectWallet}
      />

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* ... (Alerts and other UI elements remain the same) ... */}

        {/* Step Content */}
        <Box sx={{ mb: 4 }}>
          {renderStepContent()}
        </Box>

        {/* Navigation Buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pt: 4,
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          {/* Previous Button */}
          <Button
            variant="outlined"
            onClick={handlePrevious}
            disabled={isFirstStep || isSubmitting}
            sx={{ minWidth: 120 }}
          >
            Previous
          </Button>

          {/* Step Info */}
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
              Step {currentStep} of {steps.length}
            </Box>
          </Box>

          {/* Next/Submit Button */}
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={isSubmitting}
            sx={{ minWidth: 120 }}
          >
            {isSubmitting 
              ? 'Creating...' 
              : isLastStep 
              ? 'Create Trust' 
              : 'Continue to Next Step'
            }
          </Button>
        </Box>

        {/* Step Validation Summary */}
        {hasAttemptedNext && !currentValidation.isValid && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Alert severity="info" sx={{ display: 'inline-flex' }}>
              Complete all required fields to proceed to the next step
            </Alert>
          </Box>
        )}
      </Container>
    </Box>
  );
}
