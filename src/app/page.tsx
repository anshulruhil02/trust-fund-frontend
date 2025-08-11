"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Paper,
  Divider,
  Grid,
  Stack,
  useTheme,
  Alert,
  AlertTitle,
} from "@mui/material";
import {
  AccountBalanceWallet,
  Shield,
  CheckCircle,
  Timeline,
  Group,
  Schedule,
  Language,
} from "@mui/icons-material";
import Link from "next/link";
import { useAccount, useDisconnect } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import Image from "next/image";

// In your project, you would run: npm install recharts
import {
  LineChart,
  BarChart,
  PieChart,
  Pie,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Define the type for the StatCard props
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
}

// A simple component for the stat cards to reduce repetition
const StatCard = ({ icon, title, value, change }: StatCardProps) => (
  <Paper sx={{ p: 3, textAlign: "center", borderRadius: 2, height: "100%" }}>
    <Stack spacing={1} alignItems="center">
      {icon}
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="h3" sx={{ fontWeight: "bold" }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ color: "#4caf50" }}>
        {change}
      </Typography>
    </Stack>
  </Paper>
);

// --- Chart Data ---

const tvlData = [
  { name: "Jan", value: 1200000 },
  { name: "Feb", value: 1800000 },
  { name: "Mar", value: 2400000 },
  { name: "Apr", value: 3200000 },
  { name: "May", value: 2800000 },
  { name: "Jun", value: 4200000 },
];

const trustsData = [
  { name: "Jan", value: 40 },
  { name: "Feb", value: 80 },
  { name: "Mar", value: 125 },
  { name: "Apr", value: 190 },
  { name: "May", value: 240 },
  { name: "Jun", value: 315 },
];

const assetsData = [
  { name: "ETH", value: 35, fill: "#8884d8" },
  { name: "USDC", value: 25, fill: "#82ca9d" },
  { name: "WBTC", value: 20, fill: "#ffc658" },
  { name: "DAI", value: 12, fill: "#ff8042" },
  { name: "Other", value: 8, fill: "#d0ed57" },
];

interface AnalyticsChartProps {
  activeChart: "TVL" | "Trusts" | "Assets";
}

const AnalyticsChart = ({ activeChart }: AnalyticsChartProps) => {
  const theme = useTheme();

  // Define the blue color to match the selected button
  const chartBlue = "#4285f4"; // This matches your primary blue color

  const renderChart = () => {
    switch (activeChart) {
      case "TVL":
        return (
          <LineChart data={tvlData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              tickFormatter={(value: number) =>
                new Intl.NumberFormat("en-US", {
                  notation: "compact",
                  compactDisplay: "short",
                }).format(value)
              }
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke={chartBlue}
              strokeWidth={2}
              dot={{ r: 6, fill: chartBlue }}
              activeDot={{ r: 8, fill: chartBlue }}
            />
          </LineChart>
        );
      case "Trusts":
        return (
          <BarChart data={trustsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill={chartBlue} />
          </BarChart>
        );
      case "Assets":
        // Update the assets data to use blue shades
        const blueAssetsData = [
          { name: "ETH", value: 35, fill: "#4285f4" },
          { name: "USDC", value: 25, fill: "#5a95f5" },
          { name: "WBTC", value: 20, fill: "#6da4f6" },
          { name: "DAI", value: 12, fill: "#7fb3f7" },
          { name: "Other", value: 8, fill: "#92c2f8" },
        ];

        return (
          <PieChart>
            <Pie
              data={blueAssetsData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={(entry: any) => `${entry.name}: ${entry.value}%`}
            >
              {blueAssetsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value}%`} />
          </PieChart>
        );
      default:
        return <></>;
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      {renderChart()}
    </ResponsiveContainer>
  );
};

export default function LandingPage() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useWeb3Modal();
  const [activeChart, setActiveChart] = useState<"TVL" | "Trusts" | "Assets">(
    "TVL"
  );

  const formatAddress = (addr: string | undefined) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Mock data for the dashboard display
  const mockStats = {
    tvl: "$4.1M",
    tvlChange: "+12.5% (30d)",
    activeTrusts: "312",
    trustsChange: "+8.2% (7d)",
    avgDuration: "18mo",
    durationChange: "+2.1% (30d)",
  };

  const topAssets = [
    {
      name: "ETH",
      fullName: "Ethereum",
      value: "$1.2M",
      rank: "#1",
      icon: "💎",
    },
    {
      name: "USDC",
      fullName: "USD Coin",
      value: "$890K",
      rank: "#2",
      icon: "💵",
    },
    {
      name: "WBTC",
      fullName: "Wrapped Bitcoin",
      value: "$650K",
      rank: "#3",
      icon: "₿",
    },
    {
      name: "DAI",
      fullName: "Dai Stablecoin",
      value: "$420K",
      rank: "#4",
      icon: "💰",
    },
    {
      name: "MATIC",
      fullName: "Polygon",
      value: "$180K",
      rank: "#5",
      icon: "🔺",
    },
  ];

  const recentActivity = [
    {
      user: "john.eth",
      action: "created a trust",
      network: "Ethereum",
      time: "3 mins ago",
    },
    {
      user: "alice.arb",
      action: "funded trust",
      network: "Arbitrum",
      time: "7 mins ago",
    },
    {
      user: "bob.eth",
      action: "withdrew from trust",
      network: "Ethereum",
      time: "12 mins ago",
    },
    {
      user: "carol.arb",
      action: "created a trust",
      network: "Arbitrum",
      time: "18 mins ago",
    },
  ];

  const securityAudits = [
    { name: "CertiK Audit", status: "completed" },
    { name: "OpenZeppelin", status: "completed" },
    { name: "Immunefi Bug Bounty", status: "active" },
    { name: "Trail of Bits", status: "completed" },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fed7aa 0%, #eff6ff 50%, #dbeafe 100%)",
      }}
    >
      {/* Header Section */}
      <Paper elevation={1} square>
        <Container maxWidth="xl">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ py: 2 }}
          >
            <Image
              src="/images/worthytrust-logo.png"
              alt="WorthyTrust"
              height={40}
              width={200} // Adjust this to match your logo's actual aspect ratio
              style={{ width: "auto", height: "40px" }}
              priority
            />

            {isConnected ? (
              <Stack direction="row" alignItems="center" spacing={2}>
                <Chip
                  icon={<AccountBalanceWallet />}
                  label={formatAddress(address)}
                  variant="filled"
                  color="primary"
                  sx={{ fontWeight: 600 }}
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => disconnect()}
                >
                  Disconnect
                </Button>
              </Stack>
            ) : (
              <Button
                variant="contained"
                startIcon={<AccountBalanceWallet />}
                onClick={() => open()}
                sx={{
                  fontWeight: 600,
                  backgroundColor: "#4285f4",
                  "&:hover": { backgroundColor: "#3367d6" },
                }}
              >
                Connect Wallet
              </Button>
            )}
          </Stack>
        </Container>
      </Paper>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Demo Notice Banner */}
        <Alert 
          severity="warning" 
          sx={{ 
            mb: 4, 
            borderRadius: 2,
            '& .MuiAlert-message': {
              width: '100%'
            }
          }}
        >
          <AlertTitle sx={{ fontWeight: 'bold' }}>Demo Environment - Not Production Ready</AlertTitle>
          This is a demonstration version of WorthyTrust. All data shown is simulated. 
          <strong> Do not deposit actual funds.</strong>
          <br /><br />
          <strong>Important limitations:</strong>
          <br />
          • Email notifications are disabled and will not be sent
          <br />
          • Trust contracts have not been audited and are not implied to be secure
          <br />
          • This demo is for educational and testing purposes only
        </Alert>

        {/* Main content sections stacked vertically */}
        <Stack spacing={5}>
          {/* Hero Section */}
          <Box sx={{ textAlign: "center", py: 3 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bold",
                mb: 2,
                color: "#1a1a1a",
                fontSize: { xs: "2.5rem", md: "3.5rem" },
              }}
            >
              Decentralized Trust Management
            </Typography>

            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                mb: 4,
                maxWidth: "700px",
                mx: "auto",
                lineHeight: 1.6,
                fontWeight: 400,
              }}
            >
              Create, manage, and execute financial trusts on the blockchain
              with complete transparency and security
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                startIcon={<Shield />}
                onClick={isConnected ? undefined : () => open()}
                component={isConnected ? Link : "button"}
                href={isConnected ? "/create-fund" : undefined}
                sx={{
                  px: 5,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  backgroundColor: "#4285f4",
                  "&:hover": { backgroundColor: "#3367d6" },
                  textDecoration: "none",
                }}
              >
                {isConnected ? "Set Up Your Trust" : "Connect Wallet"}
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                component={Link}
                href="/create-fund"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  borderColor: "#ff9800",
                  color: "#ff9800",
                  "&:hover": { 
                    borderColor: "#f57c00",
                    backgroundColor: "rgba(255, 152, 0, 0.04)"
                  },
                  textDecoration: "none",
                }}
              >
                🚀 Demo Mode - Skip Wallet
              </Button>
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Start building a decentralized trust in minutes • Demo mode allows you to explore without wallet connection
            </Typography>
          </Box>

          {/* Main Dashboard Section: Grid for responsive columns */}
          <Grid container spacing={3}>
            {/* Left Column: Stats and Analytics */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Stack spacing={3} sx={{ height: "100%" }}>
                {/* Responsive Grid for the 4 Stat Cards */}
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                      icon={
                        <Timeline
                          sx={{ fontSize: 40, color: "primary.main" }}
                        />
                      }
                      title="TVL"
                      value={mockStats.tvl}
                      change={mockStats.tvlChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                      icon={
                        <Group sx={{ fontSize: 40, color: "primary.main" }} />
                      }
                      title="Active Trusts"
                      value={mockStats.activeTrusts}
                      change={mockStats.trustsChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <StatCard
                      icon={
                        <Schedule
                          sx={{ fontSize: 40, color: "primary.main" }}
                        />
                      }
                      title="Avg Duration"
                      value={mockStats.avgDuration}
                      change={mockStats.durationChange}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Paper
                      sx={{
                        p: 3,
                        textAlign: "center",
                        borderRadius: 2,
                        height: "100%",
                      }}
                    >
                      <Stack spacing={2} alignItems="center">
                        <Language
                          sx={{ fontSize: 40, color: "primary.main" }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Networks
                        </Typography>
                        <Stack spacing={1} sx={{ pt: 2 }}>
                          <Chip
                            label="Ethereum"
                            size="small"
                            sx={{ backgroundColor: "black", color: "white" }}
                          />
                          <Chip
                            label="Arbitrum"
                            size="small"
                            sx={{ backgroundColor: "#ff6b35", color: "white" }}
                          />
                        </Stack>
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Analytics Chart */}
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={3}
                  >
                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                      Analytics
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        p: 0.5,
                      }}
                    >
                      <Button
                        color="primary"
                        variant={activeChart === "TVL" ? "contained" : "text"}
                        onClick={() => setActiveChart("TVL")}
                        size="small"
                      >
                        TVL
                      </Button>
                      <Button
                        variant={
                          activeChart === "Trusts" ? "contained" : "text"
                        }
                        onClick={() => setActiveChart("Trusts")}
                        size="small"
                      >
                        Trusts
                      </Button>
                      <Button
                        variant={
                          activeChart === "Assets" ? "contained" : "text"
                        }
                        onClick={() => setActiveChart("Assets")}
                        size="small"
                      >
                        Assets
                      </Button>
                    </Stack>
                  </Stack>
                  <Box sx={{ flexGrow: 1, minHeight: 300 }}>
                    <AnalyticsChart activeChart={activeChart} />
                  </Box>
                </Paper>
              </Stack>
            </Grid>

            {/* Right Sidebar Column */}
            <Grid size={{ xs: 12, lg: 4 }}>
              {/* Stack for sidebar cards */}
              <Stack spacing={3}>
                {/* Top Assets Card */}
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                    🔗 Top Assets
                  </Typography>
                  <Stack spacing={2} divider={<Divider />}>
                    {topAssets.map((asset) => (
                      <Stack
                        key={asset.name}
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Typography sx={{ fontSize: "1.5rem" }}>
                            {asset.icon}
                          </Typography>
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 600 }}
                            >
                              {asset.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {asset.fullName}
                            </Typography>
                          </Box>
                        </Stack>
                        <Box sx={{ textAlign: "right" }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600 }}
                          >
                            {asset.value}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {asset.rank}
                          </Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                </Paper>

                {/* Recent Activity Card */}
                <Paper sx={{ p: 3, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                    📊 Recent Activity
                  </Typography>
                  <Stack spacing={2} divider={<Divider />}>
                    {recentActivity.map((activity, index) => (
                      <Stack key={index} spacing={1}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1.5}
                        >
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              backgroundColor: "primary.main",
                              borderRadius: "50%",
                            }}
                          />
                          <Typography variant="body2">
                            <strong>{activity.user}</strong> {activity.action}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{ pl: 2.5 }}
                        >
                          <Chip
                            label={activity.network}
                            size="small"
                            sx={
                              activity.network === "Ethereum"
                                ? { backgroundColor: "black", color: "white" }
                                : { backgroundColor: "#ff6b35", color: "white" }
                            }
                          />
                          <Typography variant="caption" color="text.secondary">
                            {activity.time}
                          </Typography>
                        </Stack>
                      </Stack>
                    ))}
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>

          {/* Informational Section */}
          <Grid container spacing={3}>
            {/* How It Works */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                  📚 How It Works
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Simple steps to create your decentralized trust
                </Typography>
                <Stack spacing={3}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: "primary.main",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        flexShrink: 0,
                      }}
                    >
                      1
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Define Trust Parameters
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Set beneficiaries, conditions, and asset allocation
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: "primary.main",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        flexShrink: 0,
                      }}
                    >
                      2
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Set your Trustees
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Designate trusted individuals to manage and oversee the
                        trust
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        backgroundColor: "primary.main",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        flexShrink: 0,
                      }}
                    >
                      3
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Deposit Funds and Launch
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Transfer your assets and activate the trust on the
                        blockchain
                      </Typography>
                    </Box>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>

            {/* Security & Audits */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper sx={{ p: 3, borderRadius: 2, height: "100%" }}>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                  ✅ Security & Audits
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  Trusted by security experts and audited by leading firms
                </Typography>
                <Grid container spacing={2}>
                  {securityAudits.map((audit) => (
                    <Grid key={audit.name} size={{ xs: 12, sm: 6 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CheckCircle
                          sx={{ color: "success.main", fontSize: 20 }}
                        />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {audit.name}
                        </Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 3 }}
                >
                  All smart contracts are open source and have undergone
                  multiple security audits. Total bug bounty pool: $500K+
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}