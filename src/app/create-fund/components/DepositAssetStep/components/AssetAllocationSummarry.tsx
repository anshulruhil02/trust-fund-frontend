// src/app/create-fund/components/DepositStep/components/AssetAllocationSummary.tsx
'use client';

import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import { PieChart, TrendingUp } from '@mui/icons-material';
import { DepositSettings, StepValidation } from '@/types/create-trust';

interface AssetAllocationSummaryProps {
  deposit: Partial<DepositSettings>;
  onUpdate: (deposit: Partial<DepositSettings>) => void;
  validation?: StepValidation;
}

const AssetAllocationSummary: React.FC<AssetAllocationSummaryProps> = ({
  deposit,
  onUpdate,
  validation,
}) => {
  // Mock asset data based on your UI mockup
  const mockAssets = [
    {
      id: 'eth',
      symbol: 'ETH',
      name: 'Ethereum',
      icon: '⟠',
      percentage: 60,
      color: '#627EEA'
    },
    {
      id: 'btc',
      symbol: 'BTC', 
      name: 'Bitcoin',
      icon: '₿',
      percentage: 40,
      color: '#F7931A'
    }
  ];

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent sx={{ p: 4 }}>
        {/* Section Header */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 2, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              fontWeight: 600
            }}
          >
            <PieChart color="primary" />
            Asset Allocation Summary
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Review your selected assets and percentages
          </Typography>
        </Box>

        {/* Asset List */}
        <List sx={{ p: 0 }}>
          {mockAssets.map((asset) => (
            <ListItem 
              key={asset.id}
              sx={{ 
                px: 0, 
                py: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-child': {
                  borderBottom: 'none'
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 48 }}>
                <Box sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: asset.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.2rem',
                  fontWeight: 'bold'
                }}>
                  {asset.icon}
                </Box>
              </ListItemIcon>
              
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {asset.symbol}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {asset.name}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    Asset allocation percentage
                  </Typography>
                }
              />
              
              <Box sx={{ textAlign: 'right' }}>
                <Chip
                  label={`${asset.percentage}%`}
                  color="primary"
                  variant="outlined"
                  sx={{ 
                    fontWeight: 600,
                    fontSize: '1rem',
                    minWidth: 80
                  }}
                />
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.secondary' }}>
                  of total allocation
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>

        {/* Placeholder for future enhancements */}
        <Box sx={{ mt: 4, p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
            💡 Asset allocation functionality coming soon...
            <br />
            Will include: initial deposit amounts, asset rebalancing options, and allocation adjustments
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AssetAllocationSummary;