'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import { Person } from '@mui/icons-material';
import { TrustSettings } from '@/types/create-trust';
import { WalletAddressManager } from '@/hooks/useWalletAddressManager';

interface BeneficiaryControlProps {
  settings: Partial<TrustSettings>;
  onUpdate: (settings: Partial<TrustSettings>) => void;
  walletAddressManager: WalletAddressManager;
}

const BeneficiaryControl: React.FC<BeneficiaryControlProps> = ({
  settings,
  onUpdate,
  walletAddressManager
}) => {
  const connectedWallet = '0x742d35Cc6634C05329925a3b8D4C9db96590b5b8';
  const creatorAddress = settings.creatorAddress || '';
  const beneficiaryAddress = settings.beneficiaryAddress || '';
  const distributionMethod = settings.distributionMethod || 'creator';
  const numberOfTrustees = settings.numberOfTrustees || 1;
  const quorumRequired = settings.quorumRequired || 1;

  const distributionOptions = [
    { value: 'creator', label: 'All assets to creator' },
    { value: 'beneficiary', label: 'All assets to beneficiary' }
  ];

  const useConnectedWalletAsCreator = () => {
    onUpdate({ creatorAddress: connectedWallet });
  };

  const useConnectedWalletAsBeneficiary = () => {
    onUpdate({ beneficiaryAddress: connectedWallet });
  };
  
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent sx={{ p: 4 }}>
        {/* Section Header */}
        <Typography 
          variant="h5" 
          sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}
        >
          <Person color="primary" />
          Beneficiary Control
        </Typography>

        {/* Creator Wallet Address */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Creator Wallet Address
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <TextField
              fullWidth
              value={creatorAddress}
              onChange={(e) => onUpdate({ creatorAddress: e.target.value })}
              placeholder="0x..."
              helperText={"The wallet address of the trust's creator"}
            />
            <Button
              variant="outlined"
              onClick={useConnectedWalletAsCreator}
              sx={{ minWidth: 200, py: 2 }}
            >
              Use Connected Wallet
            </Button>
          </Box>
        </Box>

        {/* Beneficiary Wallet Address */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Beneficiary Wallet Address
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <TextField
              fullWidth
              value={beneficiaryAddress}
              onChange={(e) => onUpdate({ beneficiaryAddress: e.target.value })}
              placeholder="0x..."
              helperText={"The wallet address of the beneficiary"}
            />
            <Button
              variant="outlined"
              onClick={useConnectedWalletAsBeneficiary}
              sx={{ minWidth: 200, py: 2 }}
            >
              Use Connected Wallet
            </Button>
          </Box>
        </Box>

        {/* Asset Distribution */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Asset Distribution on Trust Dissolution or Expiry
          </Typography>
          <FormControl fullWidth>
            <Select
              value={distributionMethod}
              onChange={(e) => onUpdate({ distributionMethod: e.target.value })}
            >
              {distributionOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BeneficiaryControl;
