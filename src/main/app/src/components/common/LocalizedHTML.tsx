import React from 'react';

import { makeStyles } from '@material-ui/core';

import { Localizer as l, sanitizedHTMLParser } from '#/src/tools/Utils';

type StylesProps = Pick<Props, 'noMargin'>;

const useStyles = makeStyles((theme) => ({
  html: ({ noMargin }: StylesProps) => ({
    ...theme.typography.body1,
    ...(noMargin
      ? {}
      : {
          '& p': {
            marginTop: '8px',
            marginBottom: '20px',
          },
        }),
  }),
}));

type Props = {
  data: object;
  transform?: (node: React.ReactNode) => any;
  defaultValue?: string;
  noWrapper?: boolean;
  noMargin?: boolean;
};

export const LocalizedHTML = ({
  data,
  defaultValue = '',
  transform,
  noWrapper,
  noMargin,
}: Props) => {
  const classes = useStyles({ noMargin });
  const content =
    sanitizedHTMLParser(l.localize(data), {
      transform,
    }) || defaultValue;

  return noWrapper ? <>{content}</> : <div className={classes.html}>{content}</div>;
};
