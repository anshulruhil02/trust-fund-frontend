// src/app/(governance)/governance/context/ProposalContext.tsx
'use client';

import { createContext, useContext } from 'react';
import { Proposal, NewProposalData } from '../../../types/proposal'; // Adjust path

// Define the shape of the data and functions our context will provide
interface IProposalContext {
  proposals: Proposal[];
  addProposal: (data: NewProposalData) => void;
}

// Create the context with a default value
export const ProposalContext = createContext<IProposalContext>({
  proposals: [],
  addProposal: () => console.error('addProposal function not implemented'),
});

// Create a custom hook for easier consumption of the context
export const useProposals = () => {
  return useContext(ProposalContext);
};
