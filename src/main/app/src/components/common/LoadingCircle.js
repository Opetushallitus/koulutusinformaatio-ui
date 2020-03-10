import React from 'react';
import { Grid, CircularProgress, useTheme } from '@material-ui/core';

const LoadingCircle = () => {
  const theme = useTheme();
  return (
    <Grid container style={{ padding: theme.spacing(6) }} justify="center">
      <CircularProgress size={50} disableShrink />
    </Grid>
  );
};

export default LoadingCircle;
