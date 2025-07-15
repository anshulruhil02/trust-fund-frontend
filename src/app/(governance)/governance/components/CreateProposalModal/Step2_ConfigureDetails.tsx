// src/app/governance/components/CreateProposalModal/Step2_ConfigureDetails.tsx
'use client';
import React from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import { NewProposalData} from '../../../../../types/proposal';

interface Step2Props {
  onNext: () => void;
  onBack: () => void;
  data: NewProposalData;
  setData: (data: NewProposalData) => void;
}

export const Step2_ConfigureDetails: React.FC<Step2Props> = ({ onNext, onBack, data, setData }) => {
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 1 }}>Proposal Title</Typography>
      <TextField
        fullWidth
        name="title"
        placeholder="Enter a clear, descriptive title"
        value={data.title}
        onChange={handleTextChange}
        sx={{ mb: 3 }}
      />

      <Typography variant="h6" sx={{ mb: 1 }}>Description</Typography>
      <TextField
        fullWidth
        multiline
        rows={4}
        name="description"
        placeholder="Provide detailed explanation and rationale"
        value={data.description}
        onChange={handleTextChange}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button variant="outlined" onClick={onBack}>
          Back
        </Button>
        <Button variant="contained" onClick={onNext} disabled={!data.title || !data.description}>
          Next
        </Button>
      </Box>
    </Box>
  );
};
