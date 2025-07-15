"use client";

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Chip,
  IconButton,
} from "@mui/material";
import { TrendingUp, Remove } from "@mui/icons-material";
import {
  TrustSettings,
  StepValidation,
  AssetTarget,
} from "@/types/create-trust";

interface AssetAllocationProps {
  settings: Partial<TrustSettings>;
  onUpdate: (settings: Partial<TrustSettings>) => void;
  validation?: StepValidation;
  hasAttemptedSubmit?: boolean;
}

const AssetAllocation: React.FC<AssetAllocationProps> = ({
  settings,
  onUpdate,
  validation,
  hasAttemptedSubmit = false,
}) => {
  const assets = settings.assetTargets || [];
  const rebalancingStrategy = settings.rebalancingStrategy || "manual";

  // Available tokens for adding (simplified for brevity)
  const availableTokens = {
    stablecoins: [{ symbol: "USDC", name: "USD Coin", icon: "$" }],
    otherCoins: [{ symbol: "SOL", name: "Solana", icon: "◎" }],
    stockTokens: [{ symbol: "AAPL", name: "Apple Inc.", icon: "📱" }],
  };

  const totalPercentage = assets.reduce(
    (sum, asset) => sum + (asset.percentage || 0),
    0
  );

  // Event handlers
  const handleSliderChange =
    (assetId: string) => (event: Event, newValue: number | number[]) => {
      const value = Array.isArray(newValue) ? newValue[0] : newValue;
      const newAssets = assets.map((asset) =>
        asset.id === assetId ? { ...asset, percentage: value } : asset
      );
      onUpdate({ assetTargets: newAssets });
    };

  const addToken = (
    category: keyof typeof availableTokens,
    tokenSymbol: string
  ) => {
    const token = availableTokens[category].find(
      (t) => t.symbol === tokenSymbol
    );
    if (token && !assets.find((a) => a.symbol === tokenSymbol)) {
      const newAsset: AssetTarget = {
        id: token.symbol.toLowerCase(),
        symbol: token.symbol,
        name: token.name,
        percentage: 0,
        icon: token.icon,
        removable: true,
      };
      onUpdate({ assetTargets: [...assets, newAsset] });
    }
  };

  const removeToken = (assetId: string) => {
    onUpdate({ assetTargets: assets.filter((asset) => asset.id !== assetId) });
  };

  const handleRebalancingChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onUpdate({
      rebalancingStrategy: event.target.value as "manual" | "auto" | "none",
    });
  };

  // --- FIX: Added validation display logic, mirroring the other components ---
  const getFieldError = (totalPercentage: number): string | undefined => {
    if (!hasAttemptedSubmit) return undefined;

    if (totalPercentage > 100) {
      return "Total percentage cannot exceed 100%";
    }
    // Check for the specific error message from the parent's validation result
    return validation?.errors.find((error) =>
      error.toLowerCase().includes("total percentage".toLowerCase())
    );

    return undefined;
  };

  // Check if the specific error for this component exists
  const isTotalPercentageError = !!getFieldError(totalPercentage);

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent sx={{ p: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontWeight: 600,
            }}
          >
            <TrendingUp color="primary" />
            Asset Allocation
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Select tokens and set allocation percentages (Total:{" "}
            {totalPercentage}%)
          </Typography>
        </Box>

        {/* Asset Sliders */}
        <Box sx={{ mb: 4 }}>
          {assets.map((asset) => (
            <Box key={asset.id} sx={{ mb: 4 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    minWidth: 120,
                  }}
                >
                  <Typography variant="h6" sx={{ fontSize: "1.5rem" }}>
                    {asset.icon}
                  </Typography>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {asset.symbol}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: "text.secondary" }}
                    >
                      {asset.name}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ flex: 1, mx: 3 }}>
                  <Slider
                    value={asset.percentage}
                    onChange={handleSliderChange(asset.id)}
                    min={0}
                    max={100}
                    step={1}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    minWidth: 80,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, minWidth: 40 }}
                  >
                    {asset.percentage}%
                  </Typography>
                  {asset.removable && (
                    <IconButton
                      size="small"
                      onClick={() => removeToken(asset.id)}
                      sx={{ color: "error.main" }}
                    >
                      <Remove />
                    </IconButton>
                  )}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {/* --- FIX: Updated Total Percentage Alert to show validation errors --- */}
        {/* This alert now correctly shows an error state when the parent signals it */}

        <Typography
          variant="body2"
          // Use the color prop to apply the theme's error color
          color={isTotalPercentageError ? "error" : "text.secondary"}
          data-error={isTotalPercentageError}
        >
          {isTotalPercentageError
            ? getFieldError(totalPercentage) // Show the specific error from the parent
            : `Total allocation must be exactly 100%. Current total: ${totalPercentage}%.`}
        </Typography>

        {/* Add Token Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Add Token
          </Typography>
          <FormControl sx={{ minWidth: 180 }}>
            <InputLabel>💰 Stablecoins</InputLabel>
            <Select
              value=""
              onChange={(e) => addToken("stablecoins", e.target.value)}
              label="💰 Stablecoins"
            >
              {availableTokens.stablecoins.map((token) => (
                <MenuItem
                  key={token.symbol}
                  value={token.symbol}
                  disabled={assets.some((a) => a.symbol === token.symbol)}
                >
                  <Chip label={token.symbol} size="small" color="primary" />{" "}
                  <Typography sx={{ ml: 1 }}>{token.name}</Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Rebalancing Strategy */}
        <Box>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Rebalancing Strategy
          </Typography>
          <RadioGroup
            value={rebalancingStrategy}
            onChange={handleRebalancingChange}
          >
            <FormControlLabel
              value="manual"
              control={<Radio />}
              label="Manual Rebalancing"
            />
            <FormControlLabel
              value="auto"
              control={<Radio />}
              label="Auto Rebalancing (Yearly)"
            />
            <FormControlLabel
              value="none"
              control={<Radio />}
              label="No Rebalancing"
            />
          </RadioGroup>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AssetAllocation;
