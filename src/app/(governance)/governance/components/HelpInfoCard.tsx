// src/app/governance/components/HelpInfoCard.tsx
'use client';
import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { ArticleOutlined, Code, HelpOutline, ExpandMore } from '@mui/icons-material';

export const HelpInfoCard = () => {
  return (
    <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Accordion defaultExpanded sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="help-info-content"
          id="help-info-header"
          sx={{ px: 2.5, py: 1 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <HelpOutline sx={{ color: 'text.secondary' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Help & Info
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 2.5, pt: 0, pb: 2.5 }}>
          <Stack spacing={1.5} sx={{ mb: 2 }}>
            <Box>
              <Typography variant="body1">
                <strong>Quorum Rules:</strong> 2 of 3 trustees must vote for a proposal to execute.
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1">
                <strong>Voting Period:</strong> 7 days from proposal creation.
              </Typography>
            </Box>
            <Box>
              <Typography variant="body1">
                <strong>Execution:</strong> Automatic after quorum is reached and voting period ends.
              </Typography>
            </Box>
          </Stack>
          <Stack spacing={1}>
            <Button 
              variant="outlined" 
              startIcon={<ArticleOutlined />} 
              fullWidth
              sx={{ justifyContent: 'flex-start', textTransform: 'none', px: 2 }}
            >
              View Documentation
            </Button>
            <Button 
              variant="outlined" 
              startIcon={<Code />} 
              fullWidth
              sx={{ justifyContent: 'flex-start', textTransform: 'none', px: 2 }}
            >
              Smart Contract
            </Button>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};
