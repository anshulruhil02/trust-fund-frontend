// src/app/(governance)/governance/components/UnifiedGovernanceHeader.tsx
"use client";
import React from "react";
import { AppBar, Toolbar, Box, Typography, Button } from "@mui/material";
import { Add, AccountBalanceWallet } from "@mui/icons-material";
import Link from "next/link";
import Image from "next/image";

interface GovernanceHeaderProps {
  onNewProposal: () => void;
}

export const GovernanceHeader: React.FC<GovernanceHeaderProps> = ({
  onNewProposal,
}) => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: "background.paper",
        borderBottom: "1px solid",
        borderColor: "divider",
        px: 2, // Add some padding
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left Side: Logo */}
        <Link
          href="/dashboard"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Image
            src="/images/worthytrust-logo.png"
            alt="WorthyTrust"
            height={40}
            width={200} // Adjust this to match your logo's actual aspect ratio
            style={{ width: "auto", height: "40px" }}
            priority
          />
        </Link>

        {/* Middle: Trust Info */}
        <Box>
          <Typography
            variant="h5"
            component="h1"
            sx={{ fontWeight: 600, textAlign: "center" }}
          >
            Trust Name Placeholder
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center" }}
          >
            3 Trustees - Quorum 2
          </Typography>
        </Box>

        {/* Right Side: Action Buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onNewProposal}
          >
            New Proposal
          </Button>
          <Button variant="outlined" startIcon={<AccountBalanceWallet />}>
            Connect Wallet
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
