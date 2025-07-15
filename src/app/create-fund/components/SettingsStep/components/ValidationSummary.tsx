import React from 'react';
import { Alert, Box, Typography } from '@mui/material';
import { StepValidation } from '@/types/create-trust';

interface ValidationSummaryProps {
  validation: StepValidation;
}

const ValidationSummary: React.FC<ValidationSummaryProps> = ({ validation }) => {
  if (!validation || (validation.errors.length === 0 && validation.warnings.length === 0)) {
    return null;
  }

  return (
    <Alert 
      severity={validation.errors.length > 0 ? "error" : "warning"}
      sx={{ borderRadius: 3 }}
    >
      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
        {validation.errors.length > 0 ? 'Please address the following issues:' : 'Please consider:'}
      </Typography>
      <Box component="ul" sx={{ m: 0, pl: 2 }}>
        {[...validation.errors, ...validation.warnings].map((message, index) => (
          <li key={index}>
            <Typography variant="body2">{message}</Typography>
          </li>
        ))}
      </Box>
    </Alert>
  );
};

export default ValidationSummary;