import React from 'react';
import { Box, CircularProgress } from '@material-ui/core';

export const LoadingCircle = () => {
  return (
    <Box p={6} display="flex" justifyContent="center">
      <CircularProgress size={50} disableShrink />
    </Box>
  );
};
