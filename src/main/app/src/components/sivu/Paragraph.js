import React from 'react';
import { makeStyles } from '@material-ui/core';
import { colors } from '../../colors';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles({
  paragraph: {
    color: colors.grey,
  },
});

const Paragraph = ({ children, ...props }) => {
  const classes = useStyles();

  return (
    <Box
      className={classes.paragraph}
      lineHeight={'27px'}
      m={'0 0 20px 0'}
      {...props}
    >
      {children}
    </Box>
  );
};

export default Paragraph;
