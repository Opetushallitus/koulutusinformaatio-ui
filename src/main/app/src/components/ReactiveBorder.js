import React from 'react';
import { makeStyles, ThemeProvider } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  spaceOnBorders: {
    paddingLeft: 10,
    paddingRight: 10,
    [theme.breakpoints.up('md')]: {
      paddingLeft: 90,
      paddingRight: 90,
    },
  },
}));

const ReactiveBorder = ({ children }) => (
  <ThemeProvider>
    <div className={useStyles().spaceOnBorders}>{children}</div>
  </ThemeProvider>
);

export default ReactiveBorder;
