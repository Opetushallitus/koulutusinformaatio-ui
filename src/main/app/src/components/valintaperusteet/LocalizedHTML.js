import React from 'react';
import { makeStyles } from '@material-ui/core';
import { Localizer as l, sanitizedHTMLParser } from '#/src/tools/Utils';

const useStyles = makeStyles((theme) => ({
  html: {
    ...theme.typography.body1,
    '& p': {
      marginTop: '8px',
      marginBottom: '20px',
    },
  },
}));

export const LocalizedHTML = ({ data, defaultValue, transform }) => {
  const classes = useStyles();
  return (
    <div className={classes.html}>
      {sanitizedHTMLParser(l.localize(data), {
        transform,
      }) || defaultValue}
    </div>
  );
};
