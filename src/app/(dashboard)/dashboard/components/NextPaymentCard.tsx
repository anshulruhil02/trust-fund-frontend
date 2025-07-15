// src/components/dashboard/NextPaymentCard.tsx
'use client';

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Avatar,
  Chip,
} from '@mui/material';
import {
  CardGiftcard,
  Download,
  Schedule,
} from '@mui/icons-material';
import { formatCurrencyWithHiding } from '@/utils/balanceUtils';

interface NextPaymentCardProps {
  amount: number;
  date: string;
  type: string;
  onClaim?: () => void;
  isClaimable?: boolean;
  isBalancesHidden?: boolean;
}

const NextPaymentCard: React.FC<NextPaymentCardProps> = ({
  amount,
  date,
  type,
  onClaim = () => {},
  isClaimable = true,
  isBalancesHidden = false,
}) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    // If it's already formatted (like "Nov 14, 2025"), return as is
    if (dateString.includes(',')) {
      return dateString;
    }
    
    // Otherwise, format the date
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysUntilPayment = (): number => {
    const today = new Date();
    const paymentDate = new Date(date);
    const diffTime = paymentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntil = getDaysUntilPayment();
  const isOverdue = daysUntil < 0;
  const isToday = daysUntil === 0;

  const getStatusChip = () => {
    if (isOverdue) {
      return (
        <Chip
          label="Available Now"
          size="small"
          sx={{
            backgroundColor: 'success.light',
            color: 'success.dark',
            fontWeight: 600,
          }}
        />
      );
    } else if (isToday) {
      return (
        <Chip
          label="Due Today"
          size="small"
          sx={{
            backgroundColor: 'warning.light',
            color: 'warning.dark',
            fontWeight: 600,
          }}
        />
      );
    } else if (daysUntil <= 7) {
      return (
        <Chip
          label={`${daysUntil} days`}
          size="small"
          sx={{
            backgroundColor: 'info.light',
            color: 'info.dark',
            fontWeight: 600,
          }}
        />
      );
    }
    return null;
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <CardContent sx={{ p: 4 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
          {/* Left side - Payment info */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {/* Gift icon */}
            <Avatar
              sx={{
                width: 56,
                height: 56,
                backgroundColor: 'grey.100',
                color: 'grey.600',
              }}
            >
              <CardGiftcard sx={{ fontSize: 28 }} />
            </Avatar>

            {/* Payment details */}
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  color: 'text.primary',
                  mb: 0.5,
                }}
              >
                Next Payment
              </Typography>
              
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: 'text.primary',
                  mb: 1,
                }}
              >
                {formatCurrencyWithHiding(amount, isBalancesHidden)}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography 
                    variant="body2" 
                    sx={{ color: 'text.secondary' }}
                  >
                    {formatDate(date)} • {type}
                  </Typography>
                </Box>
                {getStatusChip()}
              </Box>
            </Box>
          </Box>

          {/* Right side - Claim button */}
          <Box>
            <Button
              variant="contained"
              size="large"
              startIcon={<Download />}
              onClick={onClaim}
              disabled={!isClaimable}
              sx={{
                backgroundColor: 'success.main',
                color: 'white',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                minWidth: 250,
                '&:hover': {
                  backgroundColor: 'success.dark',
                },
                '&:disabled': {
                  backgroundColor: 'action.disabledBackground',
                  color: 'action.disabled',
                },
              }}
            >
              Claim All Available Distributions
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NextPaymentCard;