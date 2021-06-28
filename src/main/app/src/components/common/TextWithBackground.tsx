import React from 'react';

import { makeStyles } from '@material-ui/core';
import Box from '@material-ui/core/Box';

import { colors } from '#/src/colors';

const useStyles = makeStyles({
  textWithBackgroundBox: {
    backgroundColor: colors.lightGreenBg,
    height: 'fit-content',
  },
  textWithBackgroundText: {
    textAlign: 'center',
    verticalAlign: 'center',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: colors.black,
    margin: '0 10px',
    lineHeight: '24px',
    whiteSpace: 'nowrap',
  },
});

export const TextWithBackground = (props: React.PropsWithChildren<object>) => {
  const classes = useStyles();
  return (
    <Box
      className={classes.textWithBackgroundBox}
      display="flex"
      justifyContent="center"
      justifyItems="center"
      component="span">
      <span className={classes.textWithBackgroundText}>{props.children}</span>
    </Box>
  );
};
