export type ProposalScope = 'trust' | 'global';

// Defines the possible actions a proposal can represent
export type ProposalAction = 
  | 'dissolve' 
  | 'change_beneficiary' 
  | 'adjust_payouts' 
  | 'manage_trustees' 
  | 'asset_allocation' 
  | 'remove_trustee' 
  | 'disable_payouts';

// This is the main interface for holding all the data
// we collect during the proposal creation flow.
export interface NewProposalData {
  scope: ProposalScope;
  action: ProposalAction | null;
  title: string;
  description: string;
}


export interface Proposal extends NewProposalData {
  id: string;
  status: 'active' | 'pending';
  votesFor: number;
  votesAgainst: number;
  totalVotesRequired: number;
  endDate: Date;
}