import React from 'react';
import { makeStyles } from '@material-ui/core';
import { colors } from '../../colors';

const useStyles = makeStyles({
  iconBackground: ({ color }) => ({
    borderRadius: '50%',
    backgroundColor: color ?? colors.green,
    padding: '12.5px 15px', // TODO: forced square ratio would be nice but prolly very hard to implement
  }),
});

export const IconBackground = ({ children, color }) => {
  const classes = useStyles({ color });
  return <span className={classes.iconBackground}>{children}</span>;
};
