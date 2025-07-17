// src/app/governance/components/CreateProposalModal/Step1_SelectAction.tsx
'use client';
import React from 'react';
import { Box, Typography, Button, RadioGroup, FormControlLabel, Radio, Paper } from '@mui/material';
import { NewProposalData, ProposalAction, ProposalScope } from '../../../../../types/proposal'; // Adjust path as needed
import {
    NoStroller, AttachMoney, PieChartOutline, MoneyOff,
    PersonAddOutlined, GroupsOutlined, PersonRemoveOutlined,
} from '@mui/icons-material';

interface Step1Props {
  onNext: () => void;
  data: NewProposalData;
  setData: (data: NewProposalData) => void;
}

const proposalActions = [
  { id: 'dissolve', label: 'Dissolve Trust', icon: <NoStroller /> },
  { id: 'change_beneficiary', label: 'Change Beneficiary', icon: <PersonAddOutlined /> },
  { id: 'adjust_payouts', label: 'Adjust Payouts', icon: <AttachMoney /> },
  { id: 'manage_trustees', label: 'Manage Trustees', icon: <GroupsOutlined /> },
  { id: 'asset_allocation', label: 'Asset Allocation', icon: <PieChartOutline /> },
  { id: 'remove_trustee', label: 'Remove Trustee', icon: <PersonRemoveOutlined /> },
  { id: 'disable_payouts', label: 'Disable Payouts', icon: <MoneyOff /> },
];

export const Step1_SelectAction: React.FC<Step1Props> = ({ onNext, data, setData }) => {
  const handleScopeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, scope: event.target.value as ProposalScope });
  };

  const handleActionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, action: event.target.value as ProposalAction });
  };

  return (
    <Box>
      {/* --- Proposal Scope Section --- */}
      <Typography variant="h6" sx={{ mb: 1 }}>Proposal Scope</Typography>
      <RadioGroup value={data.scope} onChange={handleScopeChange}>
        <Paper variant="outlined" sx={{ p: 1.5, mb: 1, borderRadius: 2 }}>
          <FormControlLabel value="trust" control={<Radio />} label="Trust Level" />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
            Affects only Trust Name
          </Typography>
        </Paper>
        <Paper variant="outlined" sx={{ p: 1.5, mb: 3, borderRadius: 2 }}>
          <FormControlLabel value="global" control={<Radio />} label="Global Platform" />
           <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
            Affects all trusts on the platform
          </Typography>
        </Paper>
      </RadioGroup>

      {/* --- Select Action Section --- */}
      <Typography variant="h6" sx={{ mb: 2 }}>Select Action</Typography>
      <RadioGroup value={data.action} onChange={handleActionChange}>
        {/* We now use a Box with CSS Grid instead of the MUI Grid component */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr', // Creates two equal columns
            gap: 2, // Sets the space between items
          }}
        >
          {proposalActions.map((action) => (
            <Paper
              key={action.id}
              variant="outlined"
              sx={{ 
                p: 1.5, 
                borderRadius: 2,
                borderColor: data.action === action.id ? 'primary.main' : 'divider',
                borderWidth: data.action === action.id ? '2px' : '1px',
              }}
            >
              <FormControlLabel
                value={action.id}
                control={<Radio sx={{ mr: 1 }} />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {action.icon}
                    <Typography variant="body1">{action.label}</Typography>
                  </Box>
                }
                sx={{ width: '100%', m: 0 }}
              />
            </Paper>
          ))}
        </Box>
      </RadioGroup>
      
      {/* --- Navigation --- */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        <Button 
          variant="contained" 
          onClick={onNext}
          disabled={!data.action}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};
