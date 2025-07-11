// src/components/ui/EmptyPage.tsx
'use client';

import React from 'react';
import { Box, Typography, Container } from '@mui/material';

interface EmptyPageProps {
  pageName: string;
}

const EmptyPage: React.FC<EmptyPageProps> = ({ pageName }) => {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" component="h1" color="text.primary">
          {pageName}
        </Typography>
      </Box>
    </Container>
  );
};

export default EmptyPage;