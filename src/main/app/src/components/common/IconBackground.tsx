import React from 'react';

import { makeStyles } from '@material-ui/core';

import { colors } from '#/src/colors';

const useStyles = makeStyles({
  iconBackground: ({ color }: Pick<Props, 'color'>) => ({
    borderRadius: '50%',
    backgroundColor: color ?? colors.brandGreen,
    padding: '12.5px 15px', // TODO: forced square ratio would be nice but prolly very hard to implement
  }),
});

type Props = {
  children: React.ReactNode;
  color?: string;
};

export const IconBackground = ({ children, color }: Props) => {
  const classes = useStyles({ color });
  return <span className={classes.iconBackground}>{children}</span>;
};
