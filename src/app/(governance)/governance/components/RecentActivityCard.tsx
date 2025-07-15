// src/app/governance/components/RecentActivityCard.tsx
'use client';
import React from 'react';
import { Box, Typography, Paper, Stack } from '@mui/material';
import { History } from '@mui/icons-material';

// Mock data representing the activity log
const mockActivity = [
  {
    type: 'Proposal Executed',
    details: 'Add New Trustee',
    time: '2 days ago',
    color: 'success.main',
  },
  {
    type: 'Vote Cast',
    details: 'Monthly Payout Increase',
    time: '3 days ago',
    color: 'primary.main',
  },
  {
    type: 'Proposal Created',
    details: 'Update Beneficiary',
    time: '5 days ago',
    color: 'secondary.main',
  },
];

export const RecentActivityCard = () => {
  return (
    <Paper sx={{ p: 2.5, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <History sx={{ color: 'text.secondary' }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Recent Activity
        </Typography>
      </Box>
      <Box sx={{ position: 'relative' }}>
        {/* Vertical timeline bar */}
        <Box 
          sx={{
            position: 'absolute',
            left: '6px',
            top: '8px',
            bottom: '8px',
            width: '2px',
            backgroundColor: 'divider',
            transform: 'translateX(-50%)',
          }}
        />
        <Stack spacing={2}>
          {mockActivity.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, position: 'relative' }}>
              {/* Timeline dot */}
              <Box 
                sx={{ 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  backgroundColor: item.color,
                  mt: '6px', // Align with the first line of text
                  zIndex: 1,
                }} 
              />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>{item.type}</Typography>
                <Typography variant="body2" color="text.secondary">{item.details}</Typography>
                <Typography variant="caption" color="text.secondary">{item.time}</Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
};
