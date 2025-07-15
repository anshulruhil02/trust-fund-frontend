// src/components/dashboard/DashboardHeader.tsx
'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  AccountBalanceWallet,
  Visibility,
  VisibilityOff,
  Share,
  Gavel, // <-- IMPORT NEW ICON
} from '@mui/icons-material';
import Link from 'next/link';

interface DashboardHeaderProps {
  isWalletConnected?: boolean;
  walletAddress?: string;
  onWalletConnect?: () => void;
  onWalletDisconnect?: () => void;
  isBalancesHidden?: boolean;
  onToggleBalances?: () => void;
  // No longer need activeTab or onTabChange
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isWalletConnected = false,
  walletAddress = '',
  onWalletConnect = () => {},
  onWalletDisconnect = () => {},
  isBalancesHidden = false,
  onToggleBalances = () => {},
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 2 }}>
        {/* Left side - Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* ... (no changes to the left side) */}
          <Link href="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 32, height: 32, backgroundColor: 'primary.main', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>W</Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>WorthyTrust.</Typography>
            </Box>
          </Link>
          <Box sx={{ ml: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary' }}>Your WorthyTrust Fund</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>Portfolio Dashboard</Typography>
          </Box>
        </Box>

        {/* Right side - Action buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={isBalancesHidden ? <VisibilityOff /> : <Visibility />}
            onClick={onToggleBalances}
            sx={{ textTransform: 'none' }}
          >
            {isBalancesHidden ? 'Show Balances' : 'Hide Balances'}
          </Button>
          
          {/* --- NEW GOVERNANCE BUTTON --- */}
          {/* It's wrapped in a Link for client-side navigation */}
          <Link href="/governance" passHref>
            <Button
              variant="outlined"
              startIcon={<Gavel />}
              sx={{ textTransform: 'none' }}
            >
              Governance
            </Button>
          </Link>
          {/* --- END OF NEW BUTTON --- */}

          <Button
            variant="outlined"
            startIcon={<Share />}
            sx={{ textTransform: 'none' }}
          >
            Share
          </Button>

          {/* Wallet Connection (no changes here) */}
          {isWalletConnected ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                icon={<AccountBalanceWallet />}
                label={formatAddress(walletAddress)}
                variant="filled"
                color="success"
                onClick={handleMenuClick}
                sx={{ cursor: 'pointer' }}
              />
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => { navigator.clipboard.writeText(walletAddress); handleMenuClose(); }}>Copy Address</MenuItem>
                <MenuItem onClick={() => { onWalletDisconnect(); handleMenuClose(); }}>Disconnect Wallet</MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button variant="contained" startIcon={<AccountBalanceWallet />} onClick={onWalletConnect} sx={{ textTransform: 'none', px: 3 }}>
              Connect Wallet
            </Button>
          )}
        </Box>
      </Toolbar>
      {/* The Tab bar has been completely removed from here */}
    </AppBar>
  );
};

export default DashboardHeader;