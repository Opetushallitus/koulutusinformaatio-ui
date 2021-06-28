import React from 'react';

import { Link, LinkBaseProps, makeStyles } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';

export const useStyles = makeStyles({
  externalLinkIcon: { verticalAlign: 'middle', marginRight: '8px' },
});

export const ExternalLink = ({ children, ...props }: LinkBaseProps) => {
  const classes = useStyles();
  return (
    <Link {...props}>
      <OpenInNewIcon className={classes.externalLinkIcon} />
      {children}
    </Link>
  );
};
