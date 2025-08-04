"use client";

import React, { useState, useCallback } from "react";
import { Box, Container, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import CreateTrustHeader from "./components/CreateTrustHeader";
import SettingsStep from "./components/SettingsStep";
import TrusteesStep from "./components/TrusteesStep";
import DepositStep from "./components/DepositAssetStep";
import { useCreateTrust } from "@/hooks/useCreateTrust";
import { TrusteePermissions } from "@/types/create-trust";
import TrusteeConfirmationStep from "./components/TrustConfirmStep";

// Validation imports are no longer strictly needed but can be kept for later
// import {
//   validateSettingsStep,
//   validateTrusteesStep,
//   validateGovernanceStep,
//   validateDepositStep
// } from '@/utils/trustValidation';

export default function CreateFundPage() {
  const router = useRouter();
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  // State for shared trustee permissions
  const [sharedPermissions, setSharedPermissions] =
    useState<TrusteePermissions>({
      canDissolve: false,
      canChangeBeneficiary: false,
      canAdjustPayouts: false,
      canAddRemoveTrustees: false,
      canModifyAssetAllocation: false,
      canRemoveTrustee: false,
      canDisablePayouts: false,
    });
  

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
    setWalletConnected,
    walletAddressManager,
  } = useCreateTrust();

  // --- VALIDATION LOGIC IS COMMENTED OUT ---
  // const validateCurrentStep = useCallback(() => {
  //   switch (currentStep) {
  //     case 1:
  //       return validateSettingsStep(formData.settings);
  //     case 2:
  //       return validateTrusteesStep(formData.trustees, formData.governance);
  //     case 3:
  //       return validateGovernanceStep(formData.governance, formData.trustees.length);
  //     case 4:
  //       return validateDepositStep(formData.deposit);
  //     default:
  //       return { isValid: false, errors: ['Invalid step'], warnings: [] };
  //   }
  // }, [currentStep, formData]);

  // Handle wallet connection
  const handleConnectWallet = () => {
    setIsWalletConnected(true);
    setWalletConnected(true);
    console.log("Connecting wallet...");
  };

  // Handle step navigation
  const handleStepClick = (stepNumber: number) => {
    // Simplified navigation without checking for completion
    goToStep(stepNumber);
  };

  // Handle shared permissions update
  const handleUpdateSharedPermissions = useCallback(
    (newPermissions: TrusteePermissions) => {
      setSharedPermissions(newPermissions);

      // Update all existing trustees with new shared permissions
      const updatedTrustees = formData.trustees.map((trustee) => ({
        ...trustee,
        permissions: newPermissions,
      }));

      // Update the form data with trustees having new permissions
      updateFormData("trustees", updatedTrustees);
    },
    [formData.trustees, updateFormData]
  );

  // Handle next step with validation
  const handleNext = () => {
    if (!isLastStep) {
      nextStep();
      // setHasAttemptedNext(false); // Reset for next step
    } else {
      handleSubmit();
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    previousStep();
    // setHasAttemptedNext(false); // Reset validation state
  };

  const handleResendInvites = useCallback(async () => {
    try {
      console.log("Resending invites to pending trustees...");
      // Implement actual resend logic here
      // This would typically call an API to resend invitations

      // For now, just log the pending trustees
      const pendingTrustees = formData.trustees.filter(
        (trustee) => !trustee.isConfirmed
      );
      console.log("Pending trustees:", pendingTrustees);

      // You could show a success message here
    } catch (error) {
      console.error("Failed to resend invites:", error);
    }
  }, [formData.trustees]);

  // Handle deploy trust
  const handleDeployTrust = useCallback(async () => {
    try {
      console.log("Deploying trust...");
      console.log("Final form data:", formData);
      console.log("Shared permissions:", sharedPermissions);

      // Simulate deployment delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Trust deployed successfully!");

      // Note: The TrusteeConfirmationStep will handle the success state
      // and navigation to dashboard
    } catch (error) {
      console.error("Trust deployment failed:", error);
      throw error; // Re-throw to let the component handle the error
    }
  }, [formData, sharedPermissions]);

  // Handle form submission (for final step if needed)
  // Handle form submission (for final step if needed)
  const handleSubmit = async () => {
    try {
      console.log("Form submitted from final step");

      if (currentStep === 4) {
        // Step 4 is the final step - complete setup and go to dashboard
        console.log("Setup completed successfully!");
        router.push("/dashboard");
      } else {
        // For other steps, deploy the trust
        await handleDeployTrust();
      }
    } catch (error) {
      console.error("Form submission failed:", error);
    }
  };
  // Make sure this function is defined in your CreateFundPage component
  

  // Handle manual assignment
  const handleManualAssignment = useCallback(
    (trusteeId: string, walletAddress: string) => {
      try {
        console.log("Manual assignment:", { trusteeId, walletAddress });

        // Update the trustee with the new wallet address and mark as confirmed
        const updatedTrustees = formData.trustees.map((trustee) =>
          trustee.id === trusteeId
            ? {
                ...trustee,
                address: walletAddress,
                isConfirmed: true,
              }
            : trustee
        );

        updateFormData("trustees", updatedTrustees);

        console.log("Trustee manually assigned successfully");
      } catch (error) {
        console.error("Failed to manually assign trustee:", error);
      }
    },
    [formData.trustees, updateFormData]
  );
  const getTrusteesWithConfirmationStatus = () => {
    return formData.trustees.map((trustee) => ({
      ...trustee,
      // Trustees are confirmed if they have a wallet address
      isConfirmed: !!(trustee.address && trustee.address.trim()),
    }));
  };

  // --- VALIDATION LOGIC IS COMMENTED OUT ---
  // const currentValidation = validateCurrentStep();

  // Render current step content
  const renderStepContent = () => {
    // --- VALIDATION PROPS ARE REMOVED ---
    // const baseProps = {
    //   validation: currentValidation,
    //   hasAttemptedSubmit: hasAttemptedNext,
    // };

    switch (currentStep) {
      case 1:
        return (
          <SettingsStep
            settings={formData.settings}
            onUpdate={(settings) => updateFormData("settings", settings)}
            walletAddressManager={walletAddressManager}
            // {...baseProps}
          />
        );
      case 2:
        return (
          <TrusteesStep
            trustees={formData.trustees}
            governance={formData.governance}
            sharedPermissions={sharedPermissions}
            onAddTrustee={addTrustee}
            onRemoveTrustee={removeTrustee}
            onUpdateGovernance={(governance) =>
              updateFormData("governance", governance)
            }
            onUpdateSharedPermissions={handleUpdateSharedPermissions}
            walletAddressManager={walletAddressManager}
            // {...baseProps}
          />
        );

      case 3:
        return (
          <TrusteeConfirmationStep
            trustees={getTrusteesWithConfirmationStatus()}
            onResendInvites={handleResendInvites}
            onManualAssignment={handleManualAssignment}
            onDeployTrust={handleDeployTrust} // NEW PROP
            isSubmitting={isSubmitting}
            // validation={currentValidation}
          />
        );
      case 4:
        return (
          <DepositStep
            walletConnected={isWalletConnected}
            // {...baseProps}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
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
        {/* Step Content */}
        <Box sx={{ mb: 4 }}>{renderStepContent()}</Box>

        {/* Navigation Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pt: 4,
            borderTop: "1px solid",
            borderColor: "divider",
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
          <Box sx={{ textAlign: "center" }}>
            <Box sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
              Step {currentStep} of 4
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
              ? "Processing..."
              : currentStep === 4
              ? "Complete Setup"
              : "Continue to Next Step"}
          </Button>
        </Box>

        {/* --- VALIDATION SUMMARY IS COMMENTED OUT --- */}
        {/* {hasAttemptedNext && !currentValidation.isValid && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Alert severity="info" sx={{ display: 'inline-flex' }}>
              Complete all required fields to proceed to the next step
            </Alert>
          </Box>
        )} */}
      </Container>
    </Box>
  );
}
