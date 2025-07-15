// src/app/create-fund/components/CreateTrustHeader.tsx
'use client';
import React from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  LinearProgress,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Settings,
  People,
  AccountBalance,
  Preview,
  CheckCircle,
  Error,
  Warning,
  Close,
} from '@mui/icons-material';
import Link from 'next/link';
import { CreateTrustStep } from '@/types/create-trust';

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
      case 1: return <Settings />;
      case 2: return <People />;
      case 3: return <AccountBalance />;
      case 4: return <Preview />;
      default: return <Settings />;
    }
  };

  const getStepColor = (step: CreateTrustStep) => {
    if (step.isCompleted) return 'success';
    if (step.isActive) return 'primary';
    return 'inherit';
  };

  const currentStepData = steps.find(step => step.id === currentStep);

  return (
    <Box>
      {/* Top Header with Logo and Wallet */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2,
          px: 4,
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        {/* Logo and Back Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  backgroundColor: 'primary.main',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                  W
                </Typography>
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 'bold',
                  color: 'text.primary',
                }}
              >
                WorthyTrust.
              </Typography>
            </Box>
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
            backgroundColor: 'grey.200',
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
            },
          }}
        />
      </Box>

      {/* Step Navigation */}
      <Box sx={{ px: 4, py: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          {steps.map((step, index) => {
            const isClickable = step.isCompleted || step.isActive || index < currentStep - 1;

            return (
              <Box
                key={step.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  flex: 1,
                  cursor: isClickable && onStepClick ? 'pointer' : 'default',
                  opacity: step.isActive || step.isCompleted ? 1 : 0.6,
                }}
                onClick={() => isClickable && onStepClick?.(step.id)}
              >
                {/* Step Circle */}
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: step.isCompleted
                      ? 'success.main'
                      : step.isActive
                      ? 'primary.main'
                      : 'grey.300',
                    color: step.isCompleted || step.isActive
                      ? 'white'
                      : 'text.secondary',
                    mb: 1,
                    position: 'relative',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': isClickable ? {
                      transform: 'scale(1.05)',
                      boxShadow: 2,
                    } : {},
                  }}
                >
                  {step.isCompleted ? (
                    <CheckCircle sx={{ fontSize: 24 }} />
                  ) : (
                    getStepIcon(step.id)
                  )}

                  {/* Step Number Badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      backgroundColor: 'background.paper',
                      border: 2,
                      borderColor: step.isCompleted
                        ? 'success.main'
                        : step.isActive
                        ? 'primary.main'
                        : 'grey.300',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: '0.625rem',
                        fontWeight: 'bold',
                        color: step.isCompleted
                          ? 'success.main'
                          : step.isActive
                          ? 'primary.main'
                          : 'text.secondary',
                      }}
                    >
                      {step.id}
                    </Typography>
                  </Box>
                </Box>

                {/* Step Label */}
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: step.isActive ? 600 : 500,
                    color: step.isActive ? 'primary.main' : 'text.secondary',
                    textAlign: 'center',
                    mb: 0.5,
                  }}
                >
                  {step.title}
                </Typography>

                {/* Validation Indicators - removed since validation is handled in parent */}
                {/* <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {hasErrors && (
                    <Chip
                      size="small"
                      label={`${step.validation.errors.length} error${step.validation.errors.length > 1 ? 's' : ''}`}
                      color="error"
                      sx={{ fontSize: '0.625rem', height: 16 }}
                    />
                  )}
                  {hasWarnings && (
                    <Chip
                      size="small"
                      label={`${step.validation.warnings.length} warning${step.validation.warnings.length > 1 ? 's' : ''}`}
                      color="warning"
                      sx={{ fontSize: '0.625rem', height: 16 }}
                    />
                  )}
                </Box> */}

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 24,
                      left: '50%',
                      width: `calc(100% - 48px)`,
                      height: 2,
                      backgroundColor: step.isCompleted ? 'success.main' : 'grey.300',
                      zIndex: 0,
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default CreateTrustHeader;