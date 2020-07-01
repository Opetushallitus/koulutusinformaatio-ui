import { HashLink as Link } from 'react-router-hash-link';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { colors } from '#/src/colors';
import Grid from '@material-ui/core/Grid';
import hyphenated from '#/src/components/valintaperusteet/hyphenated';

const useStyles = makeStyles({
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

const Lnk = (text, index, addIndexToAnchor) => {
  const classes = useStyles();
  const anchor = hyphenated(text);
  return (
    <Link
      key={`${anchor}-${index}`}
      className={classes.link}
      aria-label={text}
      to={`#${anchor}${addIndexToAnchor ? '-' + index : ''}`}
      scroll={(el) => el.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
      {text}
    </Link>
  );
};
const Sisallysluottelo = ({ children }) => {
  return (
    <Grid container direction="row" justify="center" alignItems="center">
      <Grid item xs={10} sm={10} md={10}>
        {children.map((l, i) => l((t, index, addIndex) => Lnk(t, index || i, addIndex)))}
      </Grid>
    </Grid>
  );
};

export default Sisallysluottelo;