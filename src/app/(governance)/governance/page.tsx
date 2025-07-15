// src/app/(governance)/governance/page.tsx
'use client';

import React from 'react';
import { Box, Container, Stack } from '@mui/material';
import { ProposalsSection } from './components/ProposalsSection';
import { RecentActivityCard } from './components/RecentActivityCard';
import { HelpInfoCard } from './components/HelpInfoCard';
// Import the custom hook to consume the context
import { useProposals } from './ProposalContext';

export default function GovernancePage() {
  // Get the proposals list from the context provided by the layout.
  // This hook will automatically cause the component to re-render when the list changes.
  const { proposals } = useProposals();

  // The page is now clean and only responsible for displaying data.
  const trustLevelProposals = proposals.filter(p => p.scope === 'trust');
  const globalProposals = proposals.filter(p => p.scope === 'global');

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* The Header and Modal are handled by the layout now */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* Left Column */}
        <Box sx={{ width: { xs: '100%', md: '66.66%' } }}>
          <ProposalsSection title="Trust Level Proposals" proposals={trustLevelProposals} />
          <ProposalsSection title="Global Proposals" proposals={globalProposals} />
        </Box>

        {/* Right Column */}
        <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
          <Stack spacing={3}>
            <RecentActivityCard />
            <HelpInfoCard />
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}
