// src/components/dashboard/AssetAllocation.tsx
'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  Avatar,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
} from '@mui/icons-material';
import { AssetAllocation as AssetAllocationType } from '@/types/trust-fund';
import { formatCurrencyWithHiding, formatCryptoWithHiding, formatPercentageWithHiding } from '@/utils/balanceUtils';

interface AssetAllocationProps {
  assets: AssetAllocationType[];
  isBalancesHidden?: boolean;
}

const AssetAllocation: React.FC<AssetAllocationProps> = ({ 
  assets, 
  isBalancesHidden = false 
}) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (percentage: number): string => {
    return `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`;
  };

  const getAssetColor = (symbol: string): string => {
    const colors: { [key: string]: string } = {
      'ETH': '#627EEA',
      'BTC': '#F7931A',
      'LINK': '#2A5ADA',
      'USDC': '#2775CA',
      'USDT': '#26A17B',
      'ADA': '#0033AD',
      'DOT': '#E6007A',
      'SOL': '#9945FF',
    };
    return colors[symbol] || '#1976d2';
  };

  const AssetItem: React.FC<{ asset: AssetAllocationType }> = ({ asset }) => {
    const isPositive = asset.change24h > 0;

    return (
      <ListItem
        sx={{
          py: 2.5,
          px: 0,
          borderBottom: '1px solid',
          borderColor: 'divider',
          '&:last-child': {
            borderBottom: 'none',
          },
          '&:hover': {
            backgroundColor: 'action.hover',
            borderRadius: 1,
          },
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          {/* Left side - Asset info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            {/* Asset symbol badge */}
            <Avatar
              sx={{
                width: 40,
                height: 40,
                backgroundColor: getAssetColor(asset.symbol),
                fontSize: '0.875rem',
                fontWeight: 700,
                color: 'white',
              }}
            >
              {asset.symbol}
            </Avatar>

            {/* Asset details */}
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600, 
                    color: 'text.primary',
                  }}
                >
                  {asset.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    fontWeight: 500,
                  }}
                >
                  {asset.allocation.toFixed(1)}% allocation
                </Typography>
              </Box>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                }}
              >
                {formatCryptoWithHiding(asset.amount, asset.symbol, isBalancesHidden)}
              </Typography>
            </Box>
          </Box>

          {/* Right side - Value and change */}
          <Box sx={{ textAlign: 'right' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                color: 'text.primary',
                mb: 0.5,
              }}
            >
              {formatCurrencyWithHiding(asset.value ?? 0, isBalancesHidden)}
            </Typography>
            
            <Chip
              icon={isPositive ? <TrendingUp sx={{ fontSize: 16 }} /> : <TrendingDown sx={{ fontSize: 16 }} />}
              label={formatPercentageWithHiding(asset.change24h ?? 0, isBalancesHidden)}
              size="small"
              sx={{
                backgroundColor: isPositive ? 'success.light' : 'error.light',
                color: isPositive ? 'success.dark' : 'error.dark',
                fontWeight: 600,
                '& .MuiChip-icon': {
                  color: isPositive ? 'success.dark' : 'error.dark',
                },
                '& .MuiChip-label': {
                  fontSize: '0.75rem',
                },
              }}
            />
          </Box>
        </Box>
      </ListItem>
    );
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Asset Allocation
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Current portfolio composition
          </Typography>
        </Box>

        {/* Assets List */}
        <List sx={{ p: 0 }}>
          {assets.map((asset, index) => (
            <AssetItem key={asset.symbol} asset={asset} />
          ))}
        </List>

        {/* Total allocation check */}
        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Total Allocation
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {assets.reduce((sum, asset) => sum + asset.allocation, 0).toFixed(1)}%
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AssetAllocation;