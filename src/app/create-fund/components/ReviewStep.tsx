// src/app/create-fund/components/ReviewStep.tsx
'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { CreateTrustFormData } from '@/types/create-trust';

interface ReviewStepProps {
  formData: CreateTrustFormData;
  isSubmitting: boolean;
  onEdit: (stepNumber: number) => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  isSubmitting,
  onEdit,
}) => {
  return (
    <Box>
      <Typography variant="h4">Review Step</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        This step will show a summary of all trust settings for final review.
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
        Trust: {formData.settings.trustName} | Submitting: {isSubmitting ? 'Yes' : 'No'}
      </Typography>
    </Box>
  );
};

export default ReviewStep;