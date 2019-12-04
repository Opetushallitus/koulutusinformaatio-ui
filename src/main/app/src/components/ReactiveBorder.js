import React from 'react';
import { makeStyles, ThemeProvider } from '@material-ui/core';
import { theme } from '../theme';

const useStyles = makeStyles((theme) => ({
  spaceOnBorders: {
    paddingTop: 25,
    paddingBottom: 25,
    paddingLeft: 10,
    paddingRight: 10,
    [theme.breakpoints.up('sm')]: {
      paddingLeft: 25,
      paddingRight: 25,
    },
    [theme.breakpoints.up('md')]: {
      paddingLeft: 60,
      paddingRight: 60,
    },
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 90,
      paddingRight: 90,
    },
  },
}));

const ReactiveBorder = ({ children }) => (
  <ThemeProvider theme={theme}>
    <div className={useStyles().spaceOnBorders}>{children}</div>
  </ThemeProvider>
);

export default ReactiveBorder;
