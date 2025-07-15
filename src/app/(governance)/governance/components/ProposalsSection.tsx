// src/app/governance/components/ProposalsSection.tsx
'use client';
import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { ProposalCard } from './ProposalCard';
import { Proposal } from '../../../../types/proposal'; // Adjust path as needed

interface ProposalsSectionProps {
  title: string;
  proposals: Proposal[]; // Accept an array of proposals
}

export const ProposalsSection: React.FC<ProposalsSectionProps> = ({ title, proposals }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" component="h3" sx={{ mb: 2 }}>
        {title}
      </Typography>
      <Stack spacing={2}>
        {proposals.length > 0 ? (
          proposals.map((proposal) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))
        ) : (
          <Typography color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
            No proposals in this section.
          </Typography>
        )}
      </Stack>
    </Box>
  );
};
