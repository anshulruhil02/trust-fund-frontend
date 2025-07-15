// src/app/page.tsx
'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import {
  AccountBalanceWallet,
  TrendingUp,
  Security,
  Speed,
} from '@mui/icons-material';
import Link from 'next/link';

export default function LandingPage() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  const handleConnectWallet = () => {
    // Mock wallet connection - replace with Fireblocks integration later
    setIsWalletConnected(true);
    setWalletAddress('0x742d35Cc6634C0532925a3b8D8B8b35A2E6f2A3B');
  };

  const handleDisconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletAddress('');
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 3,
          px: 4,
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              backgroundColor: 'primary.main',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
              W
            </Typography>
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: 'text.primary',
            }}
          >
            WorthyTrust.
          </Typography>
        </Box>

        {/* Wallet Connection */}
        <Box>
          {isWalletConnected ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip
                icon={<AccountBalanceWallet />}
                label={formatAddress(walletAddress)}
                variant="filled"
                color="success"
                sx={{ fontWeight: 600 }}
              />
              <Button
                variant="outlined"
                size="small"
                onClick={handleDisconnectWallet}
              >
                Disconnect
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              startIcon={<AccountBalanceWallet />}
              onClick={handleConnectWallet}
              sx={{ fontWeight: 600 }}
            >
              Connect Wallet
            </Button>
          )}
        </Box>
      </Box>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          {/* Hero Section */}
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              background: 'linear-gradient(45deg, #000000 30%, #333333 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Blockchain Trust Funds
          </Typography>
          
          <Typography
            variant="h5"
            sx={{
              color: 'text.secondary',
              mb: 4,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.6,
            }}
          >
            Create secure, automated trust funds with smart contracts that govern periodic distributions and reduce administrative costs.
          </Typography>

          {/* Feature Cards */}
          <Box
            sx={{
              display: 'flex',
              gap: 3,
              mb: 6,
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            <Card sx={{ flex: 1, textAlign: 'left' }}>
              <CardContent>
                <Security sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Secure & Trustless
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Smart contracts ensure automatic execution without intermediaries
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, textAlign: 'left' }}>
              <CardContent>
                <TrendingUp sx={{ fontSize: 40, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Cost Effective
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Reduce administrative costs by up to 90% compared to traditional trusts
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ flex: 1, textAlign: 'left' }}>
              <CardContent>
                <Speed sx={{ fontSize: 40, color: 'info.main', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Fast Setup
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Deploy your trust fund in minutes, not months
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Call to Action */}
          {isWalletConnected ? (
            <Box>
              <Typography variant="h6" sx={{ mb: 3, color: 'success.main' }}>
                ✓ Wallet Connected - Ready to create your trust fund!
              </Typography>
              <Link href="/create-fund" style={{ textDecoration: 'none' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    px: 4,
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    borderRadius: 2,
                  }}
                >
                  Create Your Trust Fund
                </Button>
              </Link>
            </Box>
          ) : (
            <Box>
              <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                Connect your wallet to get started
              </Typography>
              <Button
                variant="contained"
                size="large"
                startIcon={<AccountBalanceWallet />}
                onClick={handleConnectWallet}
                sx={{
                  px: 4,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderRadius: 2,
                }}
              >
                Connect Wallet to Begin
              </Button>
            </Box>
          )}
        </Box>

        {/* Demo Navigation */}
        <Box sx={{ textAlign: 'center', pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            For testing purposes:
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/create-fund" style={{ textDecoration: 'none' }}>
              <Button variant="outlined" size="small">
                View Create Fund Flow
              </Button>
            </Link>
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <Button variant="outlined" size="small">
                View Dashboard (Demo)
              </Button>
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}