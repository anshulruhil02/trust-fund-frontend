// src/app/governance/components/ProposalCard.tsx
'use client';
import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { ChangeCircleOutlined } from '@mui/icons-material'; // Example Icon
import { Proposal } from '../../../../types/proposal'; // Adjust path as needed

interface ProposalCardProps {
  proposal: Proposal;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({ proposal }) => {
  // Helper to calculate days remaining
  const getDaysRemaining = (endDate: Date) => {
    const diff = endDate.getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days` : 'Ended';
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, display: 'flex', gap: 2, alignItems: 'center', borderRadius: 2 }}>
      <ChangeCircleOutlined sx={{ color: 'text.secondary' }} />
      <Box sx={{ flexGrow: 1 }}>
        <Typography sx={{ fontWeight: 500 }}>{proposal.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {proposal.description}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {getDaysRemaining(proposal.endDate)}
        </Typography>
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Chip 
          label={proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)} 
          color={proposal.status === 'active' ? 'primary' : 'warning'}
          size="small" 
        />
        <Typography variant="body2" sx={{ mt: 1, fontWeight: 500 }}>
          {proposal.votesFor} / {proposal.totalVotesRequired}
        </Typography>
      </Box>
    </Paper>
  );
};
