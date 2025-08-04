// src/app/create-fund/components/CreateTrustHeader.tsx
"use client";
import React from "react";
import { Box, Typography, Button, LinearProgress, Chip } from "@mui/material";
import Image from "next/image";
import {
  Settings,
  People,
  VerifiedUser,
  AccountBalance,
  CheckCircle,
} from "@mui/icons-material";
import Link from "next/link";
import { CreateTrustStep } from "@/types/create-trust";

interface CreateTrustHeaderProps {
  steps: CreateTrustStep[];
  currentStep: number;
  progressPercentage: number;
  onStepClick?: (stepNumber: number) => void;
  walletConnected: boolean;
  onConnectWallet?: () => void;
}

const CreateTrustHeader: React.FC<CreateTrustHeaderProps> = ({
  steps,
  currentStep,
  progressPercentage,
  onStepClick,
  walletConnected,
  onConnectWallet,
}) => {
  const getStepIcon = (stepId: number) => {
    switch (stepId) {
      case 1:
        return <Settings />;
      case 2:
        return <People />;
      case 3:
        return <VerifiedUser />; // Changed from AccountBalance to VerifiedUser for confirmation
      case 4:
        return <AccountBalance />; // Moved to step 4 for deposit
      default:
        return <Settings />;
    }
  };

  const getStepTitle = (stepId: number) => {
    switch (stepId) {
      case 1:
        return "Settings";
      case 2:
        return "Trustees";
      case 3:
        return "Confirmation";
      case 4:
        return "Deposit";
      default:
        return "Settings";
    }
  };

  return (
    <Box>
      {/* Top Header with Logo and Wallet */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 2,
          px: 4,
          borderBottom: "1px solid",
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        {/* Logo and Back Button */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <Image
              src="/images/worthytrust-logo.png"
              alt="WorthyTrust"
              height={40}
              width={200}
              style={{ width: "auto", height: "40px" }}
              priority
            />
          </Link>
        </Box>

        {/* Wallet Connection */}
        <Box>
          {walletConnected ? (
            <Chip
              label="Wallet Connected"
              color="success"
              variant="filled"
              sx={{ fontWeight: 600 }}
            />
          ) : (
            <Button
              variant="contained"
              onClick={onConnectWallet}
              sx={{ fontWeight: 600 }}
            >
              Connect Wallet
            </Button>
          )}
        </Box>
      </Box>

      {/* Progress Bar */}
      <Box sx={{ px: 4, py: 2 }}>
        <LinearProgress
          variant="determinate"
          value={progressPercentage}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: "grey.200",
            "& .MuiLinearProgress-bar": {
              borderRadius: 3,
            },
          }}
        />
      </Box>

      {/* Step Navigation */}
      <Box sx={{ px: 4, py: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            position: "relative",
          }}
        >
          {/* Connecting Line Background */}
          <Box
            sx={{
              position: "absolute",
              top: 24,
              left: "12.5%", // Start from first step center
              right: "12.5%", // End at last step center
              height: 2,
              backgroundColor: "grey.300",
              zIndex: 0,
            }}
          />

          {Array.from({ length: 4 }, (_, index) => {
            const stepNumber = index + 1;
            const step = steps.find(s => s.id === stepNumber);
            const isCompleted = stepNumber < currentStep;
            const isActive = stepNumber === currentStep;
            const isClickable = isCompleted || isActive || stepNumber < currentStep;

            return (
              <Box
                key={stepNumber}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flex: 1,
                  cursor: isClickable && onStepClick ? "pointer" : "default",
                  opacity: isActive || isCompleted ? 1 : 0.6,
                  position: "relative",
                  zIndex: 1,
                }}
                onClick={() => isClickable && onStepClick?.(stepNumber)}
              >
                {/* Step Circle */}
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isCompleted
                      ? "success.main"
                      : isActive
                      ? "primary.main"
                      : "grey.300",
                    color: isCompleted || isActive ? "white" : "text.secondary",
                    mb: 1,
                    position: "relative",
                    transition: "all 0.2s ease-in-out",
                    "&:hover": isClickable
                      ? {
                          transform: "scale(1.05)",
                          boxShadow: 2,
                        }
                      : {},
                  }}
                >
                  {isCompleted ? (
                    <CheckCircle sx={{ fontSize: 24 }} />
                  ) : (
                    getStepIcon(stepNumber)
                  )}

                  {/* Step Number Badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: -4,
                      right: -4,
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      backgroundColor: "background.paper",
                      border: 2,
                      borderColor: isCompleted
                        ? "success.main"
                        : isActive
                        ? "primary.main"
                        : "grey.300",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: "0.625rem",
                        fontWeight: "bold",
                        color: isCompleted
                          ? "success.main"
                          : isActive
                          ? "primary.main"
                          : "text.secondary",
                      }}
                    >
                      {stepNumber}
                    </Typography>
                  </Box>
                </Box>

                {/* Step Label */}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "primary.main" : "text.secondary",
                    textAlign: "center",
                    mb: 0.5,
                  }}
                >
                  {getStepTitle(stepNumber)}
                </Typography>

                {/* Progress Line to Next Step */}
                {stepNumber < 4 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 24,
                      left: "50%",
                      width: "100%",
                      height: 2,
                      backgroundColor: isCompleted ? "success.main" : "grey.300",
                      zIndex: -1,
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>

        {/* Step Description */}
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {currentStep === 1 && "Configure your trust settings and basic information"}
            {currentStep === 2 && "Add trustees and configure their permissions"}
            {currentStep === 3 && "Review trustee confirmations and deploy your trust"}
            {currentStep === 4 && "Add initial assets to fund your trust"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateTrustHeader;