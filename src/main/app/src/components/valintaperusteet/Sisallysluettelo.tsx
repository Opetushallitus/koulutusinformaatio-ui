import React from 'react';
import { HashLink as Link } from 'react-router-hash-link';
import { Grid, makeStyles } from '@material-ui/core';
import { colors } from '#/src/colors';
import { scrollIntoView, toId } from '#/src/tools/Utils';

const useStyles = makeStyles({
  toc: {
    position: 'sticky',
    alignSelf: 'flex-start',
    height: 'auto',
    top: '90px',
    paddingTop: '30px',
    paddingBottom: '10px',
  },
  link: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontSize: '14px',
    lineHeight: '27px',
    color: colors.green,
    borderLeftColor: colors.softGrey,
    borderLeftWidth: '1px',
    borderLeftStyle: 'solid',
    borderBottomColor: colors.softGrey,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    textDecoration: 'none',
    display: 'block',
    paddingLeft: '21px',
    paddingBottom: '10px',
    paddingTop: '10px',
    '&:last-child': {
      borderBottomStyle: 'none',
    },
  },
});

const Lnk = (text: string, index: number, addIndexToAnchor: boolean) => {
  const classes = useStyles();
  const anchor = toId(text);

  return (
    <Link
      key={`${anchor}-${index}`}
      className={classes.link}
      aria-label={text}
      to={`#${anchor}${addIndexToAnchor ? '-' + index : ''}`}
      scroll={(el: HTMLElement) => scrollIntoView(el)}>
      {text}
    </Link>
  );
};

type Props = {
  children: any[];
};

export const Sisallysluettelo = ({ children }: Props) => {
  const classes = useStyles();
  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      className={classes.toc}>
      <Grid item xs={10}>
        {children.map((l, i) =>
          l((t: string, index: number, addIndex: boolean) => Lnk(t, index || i, addIndex))
        )}
      </Grid>
    </Grid>
  );
};
