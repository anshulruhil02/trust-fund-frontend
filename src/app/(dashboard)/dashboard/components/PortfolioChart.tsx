// src/components/dashboard/PortfolioChart.tsx
'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { PortfolioData } from '@/types/trust-fund';

interface PortfolioChartProps {
  data: PortfolioData[]
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: {
    value: number;
    // You can add other properties from the payload here if you use them
    // e.g., name: string; color: string;
  }[];
  label?: string;
}

type TimePeriod = '1W' | '1M' | 'YTD' | '1Y' | '5Y' | 'ALL';

const PortfolioChart: React.FC<PortfolioChartProps> = ({
  data
}) => {
  const theme = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('1Y');

  const handlePeriodChange = (
    event: React.MouseEvent<HTMLElement>,
    newPeriod: TimePeriod | null,
  ) => {
    if (newPeriod !== null) {
      setSelectedPeriod(newPeriod);
    }
  };

  // Filter data based on selected period
  const getFilteredData = () => {
    const now = new Date();
    const currentTime = now.getTime();
    
    let cutoffTime: number;
    
    switch (selectedPeriod) {
      case '1W':
        cutoffTime = currentTime - (7 * 24 * 60 * 60 * 1000);
        break;
      case '1M':
        cutoffTime = currentTime - (30 * 24 * 60 * 60 * 1000);
        break;
      case 'YTD':
        const yearStart = new Date(now.getFullYear(), 0, 1);
        cutoffTime = yearStart.getTime();
        break;
      case '1Y':
        cutoffTime = currentTime - (365 * 24 * 60 * 60 * 1000);
        break;
      case '5Y':
        cutoffTime = currentTime - (5 * 365 * 24 * 60 * 60 * 1000);
        break;
      case 'ALL':
      default:
        return data;
    }
    
    return data.filter(item => item.timestamp >= cutoffTime);
  };

  const filteredData = getFilteredData();

  // Calculate performance for the selected period
  const getPerformanceForPeriod = () => {
    if (filteredData.length < 2) return 0;
    
    const firstValue = filteredData[0].value;
    const lastValue = filteredData[filteredData.length - 1].value;
    
    return ((lastValue - firstValue) / firstValue) * 100;
  };

  const currentPerformance = getPerformanceForPeriod();

  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const formatTooltipValue = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: 'background.paper',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          p: 2,
          boxShadow: 2,
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
          {label}
        </Typography>
        <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 600 }}>
          {formatTooltipValue(payload[0].value)}
        </Typography>
      </Box>
    );
  }
  return null;
};

  const getYAxisDomain = () => {
    const values = filteredData.map(d => d.value);
    if (values.length === 0) return [0, 100];
    
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1; // 10% padding
    return [min - padding, max + padding];
  };

  const timePeriods: TimePeriod[] = ['1W', '1M', 'YTD', '1Y', '5Y', 'ALL'];

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            Portfolio Value Over Time
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Historical portfolio performance
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: currentPerformance > 0 ? 'success.main' : 'error.main',
                fontWeight: 600,
              }}
            >
              {currentPerformance > 0 ? '+' : ''}{currentPerformance.toFixed(2)}% ({selectedPeriod})
            </Typography>
          </Box>
        </Box>

        {/* Time Period Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <ToggleButtonGroup
            value={selectedPeriod}
            exclusive
            onChange={handlePeriodChange}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                border: 'none',
                borderRadius: 1,
                px: 2,
                py: 0.5,
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'text.secondary',
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              },
              '& .MuiToggleButtonGroup-grouped': {
                margin: 0.5,
                '&:not(:first-of-type)': {
                  borderLeft: 'none',
                },
                '&:first-of-type': {
                  borderLeft: 'none',
                },
              },
            }}
          >
            {timePeriods.map((period) => (
              <ToggleButton key={period} value={period}>
                {period}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {/* Chart */}
        <Box sx={{ height: 400, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={theme.palette.divider}
                opacity={0.5}
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: theme.palette.text.secondary,
                }}
                dy={10}
              />
              <YAxis
                domain={getYAxisDomain()}
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: theme.palette.text.secondary,
                }}
                tickFormatter={formatCurrency}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={theme.palette.success.main}
                strokeWidth={3}
                dot={{
                  fill: theme.palette.success.main,
                  strokeWidth: 0,
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                  fill: theme.palette.success.main,
                  strokeWidth: 2,
                  stroke: theme.palette.background.paper,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PortfolioChart;