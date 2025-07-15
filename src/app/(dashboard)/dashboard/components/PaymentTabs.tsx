// src/components/dashboard/PaymentTabs.tsx
'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Tabs,
  Tab,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Schedule,
  History,
  AccountBalance,
  Timeline,
  TrendingUp,
  Download,
  SwapHoriz,
  CurrencyExchange,
} from '@mui/icons-material';
import { Transaction } from '@/types/trust-fund';
import { formatCurrencyWithHiding } from '@/utils/balanceUtils';

interface PaymentData {
  id: string;
  date: string;
  type: string;
  amount: number;
  status: string;
}

interface ActivityData {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
}

interface PaymentTabsProps {
  upcomingPayments: PaymentData[];
  paymentHistory: PaymentData[];
  deposits: PaymentData[];
  activityLog: ActivityData[];
  isBalancesHidden?: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`payment-tabpanel-${index}`}
      aria-labelledby={`payment-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const PaymentTabs: React.FC<PaymentTabsProps> = ({
  upcomingPayments,
  paymentHistory,
  deposits,
  activityLog,
  isBalancesHidden = false,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusChip = (status: string) => {
    const getStatusColor = (status: string) => {
      switch (status.toLowerCase()) {
        case 'completed':
          return { bg: 'success.light', text: 'success.dark' };
        case 'pending':
          return { bg: 'warning.light', text: 'warning.dark' };
        case 'failed':
          return { bg: 'error.light', text: 'error.dark' };
        default:
          return { bg: 'grey.200', text: 'grey.800' };
      }
    };

    const colors = getStatusColor(status);
    return (
      <Chip
        label={status}
        size="small"
        sx={{
          backgroundColor: colors.bg,
          color: colors.text,
          fontWeight: 600,
          minWidth: 80,
        }}
      />
    );
  };

  // Upcoming Payments Tab
  const UpcomingPaymentsTab = () => (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
        Upcoming Payments
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        Scheduled distributions and rewards
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {upcomingPayments.map((payment) => (
              <TableRow key={payment.id} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                <TableCell>{formatDate(payment.date)}</TableCell>
                <TableCell>{payment.type}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{formatCurrencyWithHiding(payment.amount, isBalancesHidden)}</TableCell>
                <TableCell>{getStatusChip(payment.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // Payment History Tab
  const PaymentHistoryTab = () => (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
        Payment History
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        Recent completed payments
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paymentHistory.map((payment, index) => (
              <TableRow key={payment.id} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                <TableCell>{formatDate(payment.date)}</TableCell>
                <TableCell>{payment.type}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{formatCurrencyWithHiding(payment.amount, isBalancesHidden)}</TableCell>
                <TableCell>{getStatusChip(payment.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // Deposits Tab
  const DepositsTab = () => (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
        Deposit History
      </Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
        Your investment contributions
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Amount</TableCell>
              <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deposits.map((deposit, index) => (
              <TableRow key={deposit.id} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                <TableCell>{formatDate(deposit.date)}</TableCell>
                <TableCell>{deposit.type}</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>{formatCurrencyWithHiding(deposit.amount, isBalancesHidden)}</TableCell>
                <TableCell>{getStatusChip(deposit.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // Activity Log Tab
  const ActivityLogTab = () => {
    const getActivityIcon = (type: string) => {
      switch (type.toLowerCase()) {
        case 'rebalance':
          return <TrendingUp sx={{ fontSize: 20 }} />;
        case 'staking':
          return <CurrencyExchange sx={{ fontSize: 20 }} />;
        case 'yield':
          return <Download sx={{ fontSize: 20 }} />;
        case 'purchase':
          return <SwapHoriz sx={{ fontSize: 20 }} />;
        case 'distribution':
          return <AccountBalance sx={{ fontSize: 20 }} />;
        default:
          return <Timeline sx={{ fontSize: 20 }} />;
      }
    };

    const getActivityColor = (type: string) => {
      switch (type.toLowerCase()) {
        case 'rebalance':
          return 'primary.main';
        case 'staking':
          return 'success.main';
        case 'yield':
          return 'info.main';
        case 'purchase':
          return 'secondary.main';
        case 'distribution':
          return 'warning.main';
        default:
          return 'grey.500';
      }
    };

    return (
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          Activity Log
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Recent portfolio activities and transactions
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {activityLog.map((activity, index) => (
            <Box
              key={activity.id}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: getActivityColor(activity.type),
                  color: 'white',
                }}
              >
                {getActivityIcon(activity.type)}
              </Avatar>
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {activity.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {activity.description}
                </Typography>
              </Box>
              
              <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 100, textAlign: 'right' }}>
                {formatDate(activity.date)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 0 }}>
        {/* Tab Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '1rem',
                minWidth: 140,
              },
            }}
          >
            <Tab
              icon={<Schedule sx={{ fontSize: 20 }} />}
              iconPosition="start"
              label="Upcoming Payments"
            />
            <Tab
              icon={<History sx={{ fontSize: 20 }} />}
              iconPosition="start"
              label="Payment History"
            />
            <Tab
              icon={<AccountBalance sx={{ fontSize: 20 }} />}
              iconPosition="start"
              label="Deposits"
            />
            <Tab
              icon={<Timeline sx={{ fontSize: 20 }} />}
              iconPosition="start"
              label="Activity Log"
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box sx={{ px: 3, pb: 3 }}>
          <TabPanel value={activeTab} index={0}>
            <UpcomingPaymentsTab />
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <PaymentHistoryTab />
          </TabPanel>
          <TabPanel value={activeTab} index={2}>
            <DepositsTab />
          </TabPanel>
          <TabPanel value={activeTab} index={3}>
            <ActivityLogTab />
          </TabPanel>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PaymentTabs;