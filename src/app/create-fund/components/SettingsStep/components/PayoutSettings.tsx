"use client";

import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import { Schedule } from "@mui/icons-material";
import { TrustSettings, StepValidation } from "@/types/create-trust";

interface PayoutSettingsProps {
  settings: Partial<TrustSettings>;
  onUpdate: (settings: Partial<TrustSettings>) => void;
  validation?: StepValidation;
  hasAttemptedSubmit?: boolean;
}

const PayoutSettings: React.FC<PayoutSettingsProps> = ({
  settings,
  onUpdate,
  validation,
  hasAttemptedSubmit = false,
}) => {
  // Read all values directly from the settings prop
  const frequency = settings.payoutFrequency || "";
  const amount = settings.payoutAmount?.toString() || "";
  const currency = settings.payoutCurrency || "USD";
  const payoutMethod = settings.payoutMethod || "in-kind";
  const selectedMonth = settings.firstPaymentDate?.month || 0;
  const selectedYear = settings.firstPaymentDate?.year || 0;

  // Event handlers
  const handleUpdate = (update: Partial<TrustSettings>) => {
    onUpdate(update);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onUpdate({ payoutAmount: value ? parseFloat(value) : undefined });
  };

  const handleDateChange = (datePart: "month" | "year", value: number) => {
    const newDate = {
      month: selectedMonth,
      year: selectedYear,
      ...{ [datePart]: value },
    };
    onUpdate({ firstPaymentDate: newDate });
  };

  // Validation logic similar to TrustNameDuration
  const shouldShowValidation = hasAttemptedSubmit;

  const getFieldError = (fieldName: string): string | undefined => {
    if (!shouldShowValidation) return undefined;

    // Use validation errors from parent if available
    if (validation?.errors && validation.errors.length > 0) {
      const matchingError = validation.errors.find((error) =>
        error.toLowerCase().includes(fieldName.toLowerCase())
      );
      if (matchingError) return matchingError;
    }

    // Fallback to local validation
    if (fieldName.toLowerCase().includes("frequency")) {
      if (!settings.payoutFrequency) {
        return "Payout frequency is required";
      }
    }

    if (fieldName.toLowerCase().includes("amount")) {
      if (!settings.payoutAmount || settings.payoutAmount <= 0) {
        return "Payout amount must be greater than 0";
      }
      if (settings.payoutAmount > 1000000000) {
        return "Payout amount is too large";
      }
    }

    if (fieldName.toLowerCase().includes("currency")) {
      if (!settings.payoutCurrency) {
        return "Currency is required";
      }
    }

    if (fieldName.toLowerCase().includes("method")) {
      if (!settings.payoutMethod) {
        return "Payout method is required";
      }
    }

    if (fieldName.toLowerCase().includes("first payment date")) {
      if (
        !settings.firstPaymentDate?.month ||
        !settings.firstPaymentDate?.year
      ) {
        return "First payment date is required";
      }
      const selectedDate = new Date(
        settings.firstPaymentDate.year,
        settings.firstPaymentDate.month - 1,
        1
      );
      const today = new Date();
      if (selectedDate < today) {
        return "First payment date must be in the future";
      }
    }

    return undefined;
  };

  const isFieldError = (fieldName: string): boolean => {
    return !!getFieldError(fieldName);
  };

  const getPaymentScheduleText = (): string => {
    if (!frequency || !amount || !currency) return "";

    const frequencyText =
      frequency === "monthly"
        ? "month"
        : frequency === "quarterly"
        ? "quarter"
        : "year";
    const currencySymbol =
      currencyOptions.find((c) => c.value === currency)?.symbol || "$";

    return `${currencySymbol}${amount} per ${frequencyText}`;
  };

  const frequencyOptions = [
    { value: "monthly", label: "Monthly", description: "12 payments per year" },
    {
      value: "quarterly",
      label: "Quarterly",
      description: "4 payments per year",
    },
    { value: "annually", label: "Annually", description: "1 payment per year" },
  ];

  const currencyOptions = [
    { value: "USD", label: "USD", symbol: "$" },
    { value: "USDC", label: "USDC", symbol: "$" },
    { value: "USDT", label: "USDT", symbol: "$" },
    { value: "ETH", label: "ETH", symbol: "Ξ" },
  ];

  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("default", { month: "long" })
  );
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear + i);

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent sx={{ p: 4 }}>
        {/* Section Header */}
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
            <Schedule color="primary" />
            Payout Settings
          </Typography>

          {/* Payment Schedule Preview */}
          {getPaymentScheduleText() && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Payment Schedule: {getPaymentScheduleText()}
              </Typography>
            </Alert>
          )}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr 1fr",
            },
            gap: 3,
            mb: 4,
          }}
        >
          {/* Frequency */}
          <FormControl
            fullWidth
            error={isFieldError("frequency")}
            data-error={isFieldError("frequency")}
          >
            <InputLabel>Frequency</InputLabel>
            <Select
              value={frequency}
              onChange={(e) =>
                handleUpdate({ payoutFrequency: e.target.value as any })
              }
              label="Frequency"
              error={isFieldError("frequency")}
            >
              {frequencyOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Box>
                    <Typography variant="body2">{option.label}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.description}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
            {isFieldError("frequency") && (
              <FormHelperText>{getFieldError("frequency")}</FormHelperText>
            )}
          </FormControl>

          {/* Payout Amount */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <FormControl
              sx={{ minWidth: 100 }}
              error={isFieldError("currency")}
              data-error={isFieldError("currency")}
            >
              <InputLabel>Currency</InputLabel>
              <Select
                value={currency}
                onChange={(e) =>
                  handleUpdate({ payoutCurrency: e.target.value })
                }
                label="Currency"
                error={isFieldError("currency")}
              >
                {currencyOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {isFieldError("currency") && (
                <FormHelperText>{getFieldError("currency")}</FormHelperText>
              )}
            </FormControl>

            <TextField
              fullWidth
              type="number"
              label="Amount"
              value={amount}
              onChange={handleAmountChange}
              error={isFieldError("amount")}
              helperText={
                getFieldError("amount") || "Enter the payout amount per period"
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {currencyOptions.find((c) => c.value === currency)
                      ?.symbol || "$"}
                  </InputAdornment>
                ),
                inputProps: { min: 0, step: 0.01 },
              }}
              data-error={isFieldError("amount")}
            />
          </Box>

          {/* Payout Method */}
          <FormControl
            fullWidth
            error={isFieldError("method")}
            data-error={isFieldError("method")}
          >
            <InputLabel>Payout Method</InputLabel>
            <Select
              value={payoutMethod}
              onChange={(e) =>
                handleUpdate({ payoutMethod: e.target.value as any })
              }
              label="Payout Method"
              error={isFieldError("method")}
            >
              <MenuItem value="in-kind">
                <Box>
                  <Typography variant="body2">In-Kind</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Pay out actual assets
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem value="cash">
                <Box>
                  <Typography variant="body2">Cash</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Convert to cash before payout
                  </Typography>
                </Box>
              </MenuItem>
            </Select>
            {isFieldError("method") && (
              <FormHelperText>{getFieldError("method")}</FormHelperText>
            )}
          </FormControl>

          {/* First Payment Date */}
          <Box>
            {/* New Descriptor Label */}
            <Typography
              variant="body2"
              sx={{ mb: 1, color: "text.secondary", fontWeight: 500 }}
            >
              First Payment Date
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <FormControl
                sx={{ minWidth: 120 }}
                error={isFieldError("first payment date")}
                data-error={isFieldError("first payment date")}
              >
                <InputLabel>Month</InputLabel>
                <Select
                  value={selectedMonth}
                  onChange={(e) =>
                    handleDateChange("month", Number(e.target.value))
                  }
                  label="Month"
                  error={isFieldError("first payment date")}
                >
                  {months.map((month, index) => (
                    <MenuItem key={month} value={index + 1}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl
                sx={{ minWidth: 100 }}
                error={isFieldError("first payment date")}
                data-error={isFieldError("first payment date")}
              >
                <InputLabel>Year</InputLabel>
                <Select
                  value={selectedYear}
                  onChange={(e) =>
                    handleDateChange("year", Number(e.target.value))
                  }
                  label="Year"
                  error={isFieldError("first payment date")}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Box>

        {/* Display first payment date error at the bottom */}
        {isFieldError("first payment date") && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {getFieldError("first payment date")}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default PayoutSettings;
