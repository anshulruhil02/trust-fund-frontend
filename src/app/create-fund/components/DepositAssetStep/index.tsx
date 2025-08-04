// src/app/create-fund/components/DepositStep/index.tsx
"use client";

import React from "react";
import { Box, Typography, Button, Paper, Chip } from "@mui/material";
import {
  CheckCircle,
  ContentCopy,
  QrCode,
  Wallet,
  Send,
} from "@mui/icons-material";
import { StepValidation } from "@/types/create-trust";
import Image from "next/image";

interface DepositStepProps {
  validation?: StepValidation;
  walletConnected: boolean;
}

const DepositStep: React.FC<DepositStepProps> = ({
  validation,
  walletConnected,
}) => {
  const handleCopyAddress = () => {
    navigator.clipboard.writeText("0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4");
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3, backgroundColor: "#f8fafc" }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Image
          src="/images/worthytrust-logo.png"
          alt="WorthyTrust"
          height={120}
          width={400} 
          priority
        />
        <Typography
          variant="h6"
          sx={{
            color: "#64748b",
            mb: 4,
          }}
        >
          Deposit crypto into your personal trust
        </Typography>

        {/* Network Status */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 4,
          }}
        >
          <CheckCircle sx={{ color: "#10b981", mr: 1, fontSize: 20 }} />
          <Typography sx={{ color: "#10b981", fontWeight: "500", mr: 3 }}>
            Connected to Arbitrum Network
          </Typography>
          <Chip
            label="Ready to deposit"
            size="small"
            sx={{
              backgroundColor: "#dcfce7",
              color: "#16a34a",
              fontWeight: "500",
            }}
          />
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: "flex", gap: 4 }}>
        {/* Left Side - Trust Address */}
        <Box sx={{ flex: 1 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              backgroundColor: "white",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "600",
                mb: 2,
                color: "#1e293b",
              }}
            >
              Your Trust Address
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                mb: 4,
              }}
            >
              Fund your trust by sending assets here on Arbitrum network
            </Typography>

            {/* Address Display */}
            <Box
              sx={{
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 2,
                p: 3,
                mb: 3,
                fontFamily: "monospace",
              }}
            >
              <Typography
                sx={{
                  fontSize: "14px",
                  color: "#1e293b",
                  wordBreak: "break-all",
                  fontFamily: "monospace",
                }}
              >
                0x742d35Cc6634C0532925a3b8D4C2C4e4C4C4C4C4
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ContentCopy />}
                onClick={handleCopyAddress}
                sx={{
                  borderColor: "#e2e8f0",
                  color: "#64748b",
                  "&:hover": {
                    borderColor: "#cbd5e1",
                    backgroundColor: "#f8fafc",
                  },
                }}
              >
                Copy Address
              </Button>
              <Button
                variant="outlined"
                startIcon={<QrCode />}
                sx={{
                  borderColor: "#e2e8f0",
                  color: "#64748b",
                  "&:hover": {
                    borderColor: "#cbd5e1",
                    backgroundColor: "#f8fafc",
                  },
                }}
              >
                QR Code
              </Button>
            </Box>

            {/* Safety Checklist */}
            <Box sx={{ mt: 5 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "600",
                  mb: 3,
                  color: "#1e293b",
                }}
              >
                Safety Checklist
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
                  mb: 3,
                }}
              >
                Please review these important safety points before depositing
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CheckCircle sx={{ color: "#10b981", mr: 2, fontSize: 20 }} />
                  <Typography sx={{ color: "#1e293b", fontSize: "14px" }}>
                    Double-check the trust address before sending
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CheckCircle sx={{ color: "#10b981", mr: 2, fontSize: 20 }} />
                  <Typography sx={{ color: "#1e293b", fontSize: "14px" }}>
                    Only send crypto on Arbitrum network
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: "2px solid #ef4444",
                      mr: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        backgroundColor: "#ef4444",
                        borderRadius: "50%",
                      }}
                    />
                  </Box>
                  <Typography sx={{ color: "#ef4444", fontSize: "14px" }}>
                    Do not send NFTs — they will not be recoverable
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Right Side - How to Deposit */}
        <Box sx={{ flex: 1 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: "1px solid #e2e8f0",
              backgroundColor: "white",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "600",
                mb: 2,
                color: "#1e293b",
              }}
            >
              How to Deposit
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "#64748b",
                mb: 4,
              }}
            >
              Follow these simple steps to deposit crypto safely
            </Typography>

            {/* Steps */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              {/* Step 1 */}
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: "#dbeafe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 3,
                    mt: 0.5,
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#2563eb",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    1
                  </Typography>
                </Box>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <ContentCopy
                      sx={{ color: "#3b82f6", mr: 1, fontSize: 18 }}
                    />
                    <Typography sx={{ fontWeight: "600", color: "#1e293b" }}>
                      Copy Trust Address
                    </Typography>
                  </Box>
                  <Typography sx={{ color: "#64748b", fontSize: "14px" }}>
                    Copy your unique trust address below
                  </Typography>
                </Box>
              </Box>

              {/* Step 2 */}
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: "#dbeafe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 3,
                    mt: 0.5,
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#2563eb",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    2
                  </Typography>
                </Box>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Wallet sx={{ color: "#3b82f6", mr: 1, fontSize: 18 }} />
                    <Typography sx={{ fontWeight: "600", color: "#1e293b" }}>
                      Open Your Wallet
                    </Typography>
                  </Box>
                  <Typography sx={{ color: "#64748b", fontSize: "14px" }}>
                    Use MetaMask, Safe, or any compatible wallet
                  </Typography>
                </Box>
              </Box>

              {/* Step 3 */}
              <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    backgroundColor: "#dbeafe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mr: 3,
                    mt: 0.5,
                    flexShrink: 0,
                  }}
                >
                  <Typography
                    sx={{
                      color: "#2563eb",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    3
                  </Typography>
                </Box>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Send sx={{ color: "#3b82f6", mr: 1, fontSize: 18 }} />
                    <Typography sx={{ fontWeight: "600", color: "#1e293b" }}>
                      Send on Arbitrum
                    </Typography>
                  </Box>
                  <Typography sx={{ color: "#64748b", fontSize: "14px" }}>
                    Send your crypto using Arbitrum network only
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Need Help Section */}
            <Box
              sx={{
                mt: 5,
                p: 3,
                backgroundColor: "#f8fafc",
                borderRadius: 2,
                border: "1px solid #e2e8f0",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "600",
                  mb: 1,
                  color: "#1e293b",
                }}
              >
                Need Help?
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#64748b",
                  mb: 2,
                }}
              >
                If you have questions about depositing or need assistance, our
                support team is here to help.
              </Typography>

              <Button
                variant="outlined"
                sx={{
                  borderColor: "#3b82f6",
                  color: "#3b82f6",
                  "&:hover": {
                    backgroundColor: "#eff6ff",
                    borderColor: "#2563eb",
                  },
                }}
              >
                Contact Support
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default DepositStep;
