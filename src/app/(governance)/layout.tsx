// src/app/(governance)/layout.tsx
'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { GovernanceHeader } from './governance/components/GovernanceHeader'; 
import { CreateProposalModal } from './governance/components/CreateProposalModal/CreateProposalModal';
import { NewProposalData, Proposal } from '../../types/proposal'; // Adjust path
// Import the context provider we created
import { ProposalContext } from './governance/ProposalContext';

// You can use this for initial testing
const MOCK_INITIAL_PROPOSALS: Proposal[] = [];

export default function GovernanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isModalOpen, setModalOpen] = useState(false);
  // The proposal list state now lives in the layout
  const [proposals, setProposals] = useState<Proposal[]>(MOCK_INITIAL_PROPOSALS);

  // This function now updates the state that is shared via context
  const handleAddProposal = (data: NewProposalData) => {
    const newProposal: Proposal = {
      ...data,
      id: `prop_${Date.now()}`,
      status: 'active',
      votesFor: 0,
      votesAgainst: 0,
      totalVotesRequired: 2,
      endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    };
    setProposals(prevProposals => [...prevProposals, newProposal]);
  };

  // The 'value' prop provides the state and the function to all children
  return (
    <ProposalContext.Provider value={{ proposals, addProposal: handleAddProposal }}>
      <Box>
        <GovernanceHeader onNewProposal={() => setModalOpen(true)} />
        
        <main>{children}</main>

        <CreateProposalModal 
          open={isModalOpen} 
          onClose={() => setModalOpen(false)} 
          onAddProposal={handleAddProposal}
        />
      </Box>
    </ProposalContext.Provider>
  );
}
