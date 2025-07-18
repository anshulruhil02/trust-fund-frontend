// src/app/create-fund/components/SettingsStep/components/TrustNameDuration.tsx
'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
} from '@mui/material';
import { Info } from '@mui/icons-material';
import { TrustSettings, StepValidation } from '@/types/create-trust';

interface TrustNameDurationProps {
  settings: Partial<TrustSettings>;
  onUpdate: (settings: Partial<TrustSettings>) => void;
  validation?:StepValidation;
  hasAttemptedSubmit?: boolean; // Add as separate prop
}

const TrustNameDuration: React.FC<TrustNameDurationProps> = ({
  settings,
  onUpdate,
  validation,
  hasAttemptedSubmit = false,
}) => {
  const handleChange = (field: keyof TrustSettings) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onUpdate({ [field]: event.target.value });
  };

  const handleDurationChange = (duration: 'perpetual' | 'fixed') => {
    const updates: Partial<TrustSettings> = { duration };
    // Clear end date if switching to perpetual
    if (duration === 'perpetual') {
      updates.endDate = undefined;
    }
    onUpdate(updates);
  };

  // Only show validation errors if user has attempted to submit
  const shouldShowValidation = hasAttemptedSubmit;

  const getFieldError = (fieldName: string): string | undefined => {
    if (!shouldShowValidation) return undefined;
    
    // Use validation errors from parent if available
    if (validation?.errors && validation.errors.length > 0) {
      const matchingError = validation.errors.find(error => 
        error.toLowerCase().includes(fieldName.toLowerCase())
      );
      if (matchingError) return matchingError;
    }
    
    // Fallback to local validation
    if (fieldName.toLowerCase().includes('trust name')) {
      if (!settings.trustName || settings.trustName.trim().length === 0) {
        return 'Trust name is required';
      }
      if (settings.trustName.length < 3) {
        return 'Trust name must be at least 3 characters long';
      }
      if (settings.trustName.length > 100) {
        return 'Trust name must be less than 100 characters';
      }
    }
    
    if (fieldName.toLowerCase().includes('purpose statement')) {
      if (!settings.purposeStatement || settings.purposeStatement.trim().length === 0) {
        return 'Purpose statement is required';
      }
      if (settings.purposeStatement.length > 1000) {
        return 'Purpose statement must be less than 1000 characters';
      }
    }
    
    if (fieldName.toLowerCase().includes('end date')) {
      if (settings.duration === 'fixed') {
        if (!settings.endDate) {
          return 'End date is required for fixed duration trusts';
        }
        const selectedDate = new Date(settings.endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate <= today) {
          return 'End date must be in the future';
        }
      }
    }
    
    return undefined;
  };

  const isFieldError = (fieldName: string): boolean => {
    return !!getFieldError(fieldName);
  };

  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent sx={{ p: 4 }}>
        {/* Section Header */}
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 4, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            fontWeight: 600
          }}
        >
          <Info color="primary" />
          Trust Name & Duration
        </Typography>

        {/* Trust Name */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label="Trust Name"
            placeholder="Enter trust name (e.g., Smith Family Trust)"
            value={settings.trustName || ''}
            onChange={handleChange('trustName')}
            error={isFieldError('trust name')}
            helperText={
              getFieldError('trust name') || 
              'Choose a meaningful name for your trust'
            }
            sx={{ mb: 3 }}
            data-error={isFieldError('trust name')}
          />
        </Box>

        {/* Purpose Statement */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Purpose Statement
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ mb: 2, color: 'text.secondary' }}
          >
            Describe the purpose and goals of this trust. This section will be published 
            in full and forever unchangeable on the blockchain.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Describe the purpose and goals of this trust..."
            value={settings.purposeStatement || ''}
            onChange={handleChange('purposeStatement')}
            error={isFieldError('purpose statement')}
            helperText={
              getFieldError('purpose statement') || 
              `${(settings.purposeStatement || '').length}/1000 characters. This will be permanently recorded on the blockchain.`
            }
            data-error={isFieldError('purpose statement')}
          />
        </Box>

        {/* Duration Selection */}
        <Box>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Duration
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            {/* Perpetual Option */}
            <Button
              variant={settings.duration === 'perpetual' ? 'contained' : 'outlined'}
              onClick={() => handleDurationChange('perpetual')}
              sx={{
                flex: 1,
                py: 2,
                px: 3,
                borderRadius: 2,
                textAlign: 'left',
                justifyContent: 'flex-start',
                flexDirection: 'column',
                alignItems: 'flex-start',
                height: 'auto',
                minHeight: 80,
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                Perpetuity
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                No end date
              </Typography>
            </Button>

            {/* Fixed Term Option */}
            <Button
              variant={settings.duration === 'fixed' ? 'contained' : 'outlined'}
              onClick={() => handleDurationChange('fixed')}
              sx={{
                flex: 1,
                py: 2,
                px: 3,
                borderRadius: 2,
                textAlign: 'left',
                justifyContent: 'flex-start',
                flexDirection: 'column',
                alignItems: 'flex-start',
                height: 'auto',
                minHeight: 80,
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                Fixed Term
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Specific end date
              </Typography>
            </Button>
          </Box>

          {/* End Date Field (conditional) */}
          {settings.duration === 'fixed' && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
                End Date
              </Typography>
              <Box sx={{ maxWidth: 400 }}>
                <TextField
                  fullWidth
                  type="date"
                  value={settings.endDate || ''}
                  onChange={handleChange('endDate')}
                  error={isFieldError('end date')}
                  helperText={getFieldError('end date') || 'Select when the trust should end'}
                  slotProps={{
                    htmlInput: {
                      min: currentDate, // Prevent selecting past dates
                    },
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      padding: '16px 14px', // Increase padding for larger click area
                      fontSize: '1.1rem', // Larger font size
                    },
                    '& .MuiOutlinedInput-root': {
                      minHeight: '56px', // Ensure consistent height
                    }
                  }}
                  data-error={isFieldError('end date')}
                />
              </Box>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TrustNameDuration;