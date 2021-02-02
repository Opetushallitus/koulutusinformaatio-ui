import React from 'react';
import { Backdrop, Box, CircularProgress, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  backdrop: {
    position: 'absolute',
    zIndex: 1000,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.3)',
    boxShadow: '0 0 5px 5px rgba(0,0,0,0.3)',
  },
});

export const LoadingCircle = () => {
  return (
    <Box p={6} display="flex" justifyContent="center">
      <CircularProgress size={50} disableShrink />
    </Box>
  );
};

export const OverlayLoadingCircle = ({ isLoading }) => {
  const classes = useStyles();
  return (
    <Backdrop className={classes.backdrop} open={isLoading}>
      <LoadingCircle />
    </Backdrop>
  );
};
