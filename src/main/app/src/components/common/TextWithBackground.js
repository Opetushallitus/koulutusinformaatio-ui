import React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core';
import { colors } from '#/src/colors';

const useStyles = makeStyles({
  textWithBackgroundBox: {
    backgroundColor: colors.beigeGreen,
    height: '24px',
  },
  textWithBackgroundText: {
    textAlign: 'center',
    verticalAlign: 'center',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: colors.black,
    margin: '0 10px',
    lineHeight: '24px',
  },
});

const TextWithBackground = (props) => {
  const classes = useStyles();
  return (
    <Box
      className={classes.textWithBackgroundBox}
      display="flex"
      justifyContent="center"
      justifyItems="center">
      <div className={classes.textWithBackgroundText}>{props.children}</div>
    </Box>
  );
};

export default TextWithBackground;
