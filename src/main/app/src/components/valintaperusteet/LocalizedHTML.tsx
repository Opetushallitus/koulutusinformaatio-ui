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

type Props = {
  data: object;
  transform?: (node: React.ReactNode) => any;
  defaultValue?: string;
  noWrapper?: boolean;
};

export const LocalizedHTML = ({
  data,
  defaultValue = '',
  transform,
  noWrapper,
}: Props) => {
  const classes = useStyles();
  const content =
    sanitizedHTMLParser(l.localize(data), {
      transform,
    }) || defaultValue;

  return noWrapper ? <>{content}</> : <div className={classes.html}>{content}</div>;
};
