// src/app/governance/components/CreateProposalModal/Step3_ReviewSubmit.tsx
'use client';
import React from 'react';
import { Box, Typography, Button, Stack, Chip, Paper } from '@mui/material';
import { NewProposalData } from '../../../../../types/proposal';

interface Step3Props {
  onBack: () => void;
  onSubmit: () => void;
  data: NewProposalData;
}

// Helper to get a user-friendly label from the action ID
const getActionLabel = (actionId: string | null) => {
    switch(actionId) {
        case 'dissolve': return 'Dissolve Trust';
        case 'change_beneficiary': return 'Change Beneficiary';
        // ... add other cases here
        default: return 'N/A';
    }
}

export const Step3_ReviewSubmit: React.FC<Step3Props> = ({ onBack, onSubmit, data }) => {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>Review Your Proposal</Typography>
      
      <Typography variant="overline" color="text.secondary">Summary</Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>{data.title || "No Title"}</Typography>
        <Typography variant="body2">{data.description || "No Description"}</Typography>
      </Paper>

      <Typography variant="overline" color="text.secondary">Details</Typography>
      <Stack spacing={1.5}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography><strong>Action:</strong></Typography>
            <Typography>{getActionLabel(data.action)}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography><strong>Scope:</strong></Typography>
            <Chip label={data.scope === 'trust' ? 'Trust Level' : 'Global Platform'} size="small" />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography><strong>Estimated Gas:</strong></Typography>
            <Typography>~0.02 ETH</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography><strong>Voting Period:</strong></Typography>
            <Typography>7 days</Typography>
        </Box>
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button variant="contained" onClick={onSubmit}>
          Submit Proposal
        </Button>
      </Box>
    </Box>
  );
};
