// src/app/create-fund/components/DepositStep/components/WalletApprovals.tsx
'use client';

import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { AccountBalanceWallet, CheckCircle, Warning } from '@mui/icons-material';
import { DepositSettings, StepValidation } from '@/types/create-trust';

interface WalletApprovalsProps {
  deposit: Partial<DepositSettings>;
  onUpdate: (deposit: Partial<DepositSettings>) => void;
  validation?: StepValidation;
  walletConnected: boolean;
}

const WalletApprovals: React.FC<WalletApprovalsProps> = ({
  deposit,
  onUpdate,
  validation,
  walletConnected,
}) => {
  // Mock connection state for demonstration
  const [isConnecting, setIsConnecting] = React.useState(false);

  const handleConnectWallet = () => {
    setIsConnecting(true);
    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false);
      // This would trigger the parent component's wallet connection logic
    }, 2000);
  };

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
            <AccountBalanceWallet color="primary" />
            Wallet & Approvals
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Connect your wallet and approve token transfers
          </Typography>
        </Box>

        {/* Wallet Connection Status */}
        {walletConnected ? (
          <Box sx={{ 
            p: 4, 
            backgroundColor: 'success.50', 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'success.200',
            textAlign: 'center',
            mb: 4
          }}>
            <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.dark', mb: 1 }}>
              Wallet Connected
            </Typography>
            <Typography variant="body2" sx={{ color: 'success.dark' }}>
              Your wallet is connected and ready for token approvals
            </Typography>
          </Box>
        ) : (
          <Box sx={{ 
            p: 4, 
            backgroundColor: 'warning.50', 
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'warning.200',
            textAlign: 'center',
            mb: 4
          }}>
            <AccountBalanceWallet sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'warning.dark', mb: 1 }}>
              Connect your wallet to continue
            </Typography>
            <Typography variant="body2" sx={{ color: 'warning.dark', mb: 3 }}>
              You need to connect your wallet to deposit assets into the trust
            </Typography>
            
            <Button
              variant="contained"
              size="large"
              startIcon={isConnecting ? <CircularProgress size={20} color="inherit" /> : <AccountBalanceWallet />}
              onClick={handleConnectWallet}
              disabled={isConnecting}
              sx={{ minWidth: 200 }}
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          </Box>
        )}

        {/* Token Approvals Section */}
        {walletConnected && (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Token Approvals Required
            </Typography>
            
            {/* Mock approval items */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {['ETH', 'BTC'].map((token, index) => (
                <Box 
                  key={token}
                  sx={{ 
                    p: 3, 
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: token === 'ETH' ? '#627EEA' : '#F7931A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: 'bold'
                    }}>
                      {token === 'ETH' ? '⟠' : '₿'}
                    </Box>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {token} Token Approval
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Allow the trust contract to transfer your {token}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ minWidth: 100 }}
                  >
                    Approve
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Validation Errors */}
        {validation?.errors && validation.errors.length > 0 && (
          <Box sx={{ mt: 3 }}>
            {validation.errors.map((error, index) => (
              <Alert severity="error" key={index} sx={{ mb: 1 }}>
                {error}
              </Alert>
            ))}
          </Box>
        )}

        {/* Placeholder for future features */}
        <Box sx={{ mt: 4, p: 3, backgroundColor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
            🔧 Advanced wallet features coming soon...
            <br />
            Will include: gas estimation, transaction history, multi-wallet support, and batch approvals
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WalletApprovals;