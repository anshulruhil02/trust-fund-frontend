// src/app/create-fund/components/TrusteesStep/components/TrustConfiguration.tsx
'use client';

import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  MenuItem,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import { Settings, Group, HowToVote } from '@mui/icons-material';
import { Trustee, GovernanceSettings, StepValidation } from '@/types/create-trust';

interface TrustConfigurationProps {
  trustees: Trustee[];
  governance: Partial<GovernanceSettings>;
  onUpdateGovernance: (governance: Partial<GovernanceSettings>) => void;
  validation?: StepValidation;
}

const TrustConfiguration: React.FC<TrustConfigurationProps> = ({
  trustees,
  governance,
  onUpdateGovernance,
  validation,
}) => {
  const trusteeCount = trustees.length;
  const maxQuorum = Math.max(trusteeCount, 1);
  const recommendedQuorum = Math.ceil(trusteeCount / 2);
  
  // Generate quorum options
  const quorumOptions = Array.from({ length: maxQuorum }, (_, i) => i + 1);

  // Get validation errors related to quorum
  const quorumError = validation?.errors.find(error => 
    error.toLowerCase().includes('quorum')
  );

  const hasQuorumError = !!quorumError;

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
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
            <Settings color="primary" />
            Trust Configuration
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Review your trustee setup
          </Typography>
        </Box>

        {/* Configuration Grid */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
          gap: 4,
          mb: 4 
        }}>
          {/* Total Trustees */}
          <Box>
            <Typography variant="body2" sx={{ mb: 2, fontWeight: 500, color: 'text.secondary' }}>
              Total Trustees
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              p: 3,
              bgcolor: 'grey.50',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'grey.200'
            }}>
              <Group color="primary" sx={{ fontSize: 24 }} />
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {trusteeCount}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {trusteeCount === 1 ? 'trustee' : 'trustees'} added
              </Typography>
            </Box>
          </Box>

          {/* Quorum Required */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                Quorum Required
              </Typography>
              {trusteeCount > 0 && governance.quorumThreshold === recommendedQuorum && (
                <Chip 
                  label="Recommended" 
                  size="small" 
                  color="success"
                  variant="outlined"
                />
              )}
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <HowToVote color="primary" sx={{ fontSize: 24 }} />
              <TextField
                select
                value={governance.quorumThreshold || 1}
                onChange={(e) => onUpdateGovernance({ 
                  quorumThreshold: parseInt(e.target.value) 
                })}
                disabled={trusteeCount === 0}
                error={hasQuorumError}
                sx={{ 
                  minWidth: 120,
                  '& .MuiOutlinedInput-root': {
                    bgcolor: 'background.paper'
                  }
                }}
              >
                {quorumOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {option}
                      </Typography>
                      {option === recommendedQuorum && trusteeCount > 1 && (
                        <Chip 
                          label="Recommended" 
                          size="small" 
                          color="success"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                of {trusteeCount} {trusteeCount === 1 ? 'trustee' : 'trustees'}
              </Typography>
            </Box>

            {/* Helper text */}
            {trusteeCount > 0 && (
              <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'text.secondary' }}>
                {governance.quorumThreshold === 1 && trusteeCount > 1 
                  ? 'Any single trustee can approve proposals'
                  : governance.quorumThreshold === trusteeCount
                  ? 'All trustees must approve proposals'
                  : `At least ${governance.quorumThreshold} trustees must approve proposals`
                }
              </Typography>
            )}
          </Box>
        </Box>

        {/* Validation Messages */}
        {validation?.errors && validation.errors.length > 0 && (
          <Box sx={{ mb: 3 }}>
            {validation.errors.map((error, index) => (
              <Alert severity="error" key={index} sx={{ mb: 1 }}>
                {error}
              </Alert>
            ))}
          </Box>
        )}

        {validation?.warnings && validation.warnings.length > 0 && (
          <Box sx={{ mb: 3 }}>
            {validation.warnings.map((warning, index) => (
              <Alert severity="warning" key={index} sx={{ mb: 1 }}>
                {warning}
              </Alert>
            ))}
          </Box>
        )}

        {/* Security Information */}
        {trusteeCount > 0 && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ p: 3, bgcolor: 'primary.50', borderRadius: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                Security Summary
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                {governance.quorumThreshold === 1 && trusteeCount === 1 
                  ? 'Single-signature setup: The sole trustee has complete control over the trust.'
                  : governance.quorumThreshold === 1 && trusteeCount > 1
                  ? 'Low security: Any trustee can execute transactions independently.'
                  : governance.quorumThreshold === trusteeCount && trusteeCount > 1
                  ? 'High security: All trustees must agree before any transaction can be executed.'
                  : `Balanced security: ${governance.quorumThreshold} of ${trusteeCount} trustees must agree to execute transactions.`
                }
              </Typography>
            </Box>
          </>
        )}

        {/* Empty state */}
        {trusteeCount === 0 && (
          <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              No trustees added yet
            </Typography>
            <Typography variant="body2">
              Add trustees above to configure quorum settings
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TrustConfiguration;