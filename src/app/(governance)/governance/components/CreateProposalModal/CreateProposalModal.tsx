// src/app/governance/components/CreateProposalModal/CreateProposalModal.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Box, Typography, Modal, Paper, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
// Using your new, centralized types path
import { NewProposalData } from '../../../../../types/proposal'; 

// Import the step components
import { Step1_SelectAction } from './Step1_SelectAction';
import { Step2_ConfigureDetails } from './Step2_ConfigureDetails';
import { Step3_ReviewSubmit } from './Step3_ReviewSubmit';

interface CreateProposalModalProps {
  open: boolean;
  onClose: () => void;
  onAddProposal: (data: NewProposalData) => void;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

// Re-added the initial state definition
const initialProposalData: NewProposalData = {
  scope: 'trust',
  action: null,
  title: '',
  description: '',
};

export const CreateProposalModal: React.FC<CreateProposalModalProps> = ({ open, onClose, onAddProposal }) => {
  const [step, setStep] = useState(1);
  const [proposalData, setProposalData] = useState<NewProposalData>(initialProposalData);

  // Re-added the useEffect to reset the form state when the modal opens
  useEffect(() => {
    if (open) {
      setStep(1);
      setProposalData(initialProposalData);
    }
  }, [open]);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);
  const handleSubmit = () => {
    console.log('Submitting proposal with data:', proposalData);
    onAddProposal(proposalData);
    onClose(); // Close modal on submit
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <Step1_SelectAction onNext={handleNext} data={proposalData} setData={setProposalData} />;
      case 2:
        return <Step2_ConfigureDetails onNext={handleNext} onBack={handleBack} data={proposalData} setData={setProposalData} />;
      case 3:
        return <Step3_ReviewSubmit onSubmit={handleSubmit} onBack={handleBack} data={proposalData} />;
      default:
        return null;
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Paper sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
              Create New Proposal
            </Typography>
            <Typography color="text.secondary">
              Step {step} of 3: {step === 1 ? 'Select Action' : step === 2 ? 'Configure Details' : 'Review & Submit'}
            </Typography>
          </Box>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
        <Box>
          {renderStepContent()}
        </Box>
      </Paper>
    </Modal>
  );
};
