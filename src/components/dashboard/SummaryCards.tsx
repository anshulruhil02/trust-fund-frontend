// src/components/dashboard/SummaryCards.tsx
'use client';

import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  Savings,
} from '@mui/icons-material';

import { formatCurrencyWithHiding, formatPercentageWithHiding } from '@/utils/balanceUtils';

interface SummaryCardData {
  title: string;
  value: number;
  currency?: string;
  subtitle: string;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  isPositive?: boolean;
}

interface SummaryCardsProps {
  totalPortfolioValue: number;
  totalDeposits: number;
  totalReturns: number;
  returnPercentage: number;
  isBalancesHidden?: boolean;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalPortfolioValue,
  totalDeposits,
  totalReturns,
  returnPercentage,
  isBalancesHidden = false,
}) => {
  const formatCurrency = (amount: number, showCents: boolean = true): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: showCents ? 2 : 0,
      maximumFractionDigits: showCents ? 2 : 0,
    }).format(amount);
  };

  const formatPercentage = (percentage: number): string => {
    return `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`;
  };

  const summaryData: SummaryCardData[] = [
    {
      title: 'Total Portfolio Value',
      value: totalPortfolioValue,
      subtitle: `${formatPercentage(returnPercentage)} All Time`,
      change: returnPercentage,
      icon: <AccountBalance sx={{ fontSize: 28 }} />,
      isPositive: returnPercentage > 0,
    },
    {
      title: 'Total Deposits',
      value: totalDeposits,
      subtitle: 'Principal investment',
      icon: <Savings sx={{ fontSize: 28 }} />,
    },
    {
      title: 'Total Returns',
      value: totalReturns,
      subtitle: 'Unrealized gains',
      icon: <TrendingUp sx={{ fontSize: 28 }} />,
      isPositive: totalReturns > 0,
    },
  ];

  const SummaryCard: React.FC<{ data: SummaryCardData }> = ({ data }) => {
    const getChangeColor = (isPositive: boolean | undefined) => {
      if (isPositive === undefined) return 'text.secondary';
      return isPositive ? 'success.main' : 'error.main';
    };

    const getValueColor = (isPositive: boolean | undefined, isReturns: boolean = false) => {
      if (isReturns && isPositive !== undefined) {
        return isPositive ? 'success.main' : 'error.main';
      }
      return 'text.primary';
    };

    const isReturnsCard = data.title === 'Total Returns';

    return (
      <Card
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 3,
          },
        }}
      >
        <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  mb: 1,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {data.title}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: getValueColor(data.isPositive, isReturnsCard),
                  mb: 1,
                }}
              >
                {formatCurrencyWithHiding(data.value, isBalancesHidden)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: getChangeColor(data.isPositive),
                    fontWeight: 500,
                  }}
                >
                  {data.subtitle}
                </Typography>
                {data.change !== undefined && (
                  <Chip
                    label={formatPercentageWithHiding(data.change, isBalancesHidden)}
                    size="small"
                    sx={{
                      backgroundColor: data.isPositive ? 'success.light' : 'error.light',
                      color: data.isPositive ? 'success.dark' : 'error.dark',
                      fontWeight: 600,
                      height: 20,
                      '& .MuiChip-label': {
                        px: 1,
                        fontSize: '0.75rem',
                      },
                    }}
                  />
                )}
              </Box>
            </Box>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: 'grey.100',
                color: 'grey.600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {data.icon}
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box 
      sx={{ 
        display: 'flex',
        gap: 3,
        width: '100%',
        flexDirection: { xs: 'column', md: 'row' }
      }}
    >
      {summaryData.map((data, index) => (
        <Box 
          key={index} 
          sx={{ 
            flex: 1,
            minWidth: 0 // Important for flex items
          }}
        >
          <SummaryCard data={data} />
        </Box>
      ))}
    </Box>
  );
};

export default SummaryCards;