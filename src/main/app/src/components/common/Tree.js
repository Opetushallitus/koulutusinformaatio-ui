import React from 'react';
import { Grid, Typography, makeStyles } from '@material-ui/core';
import Spacer from './common/Spacer';
import TreeImage from '../assets/images/ammatillinen_koulutus_puu.svg';
import LinkCardGrid from './common/LinkCardGrid';

const useStyles = makeStyles((theme) => ({
  treeContainer: {
    [theme.breakpoints.up('lg')]: {
      backgroundImage: `url(${TreeImage})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backGroundSize: 'cover',
      height: '960px',
    },
  },
}));

const Tree = (props) => {
  const { title, cards } = props;
  const classes = useStyles();
  const cardsMid = Math.ceil(cards.length / 2);
  const leftCards = cards.slice(0, cardsMid);
  const rightCards = cards.slice(cardsMid);

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item>
        <Typography variant="h2">{title}</Typography>
      </Grid>
      <Grid item>
        <Spacer />
      </Grid>
      <Grid
        item
        container
        alignItems="center"
        justify="center"
        className={classes.treeContainer}
        spacing={10}
      >
        <Grid item xs={12} lg={4}>
          <LinkCardGrid cards={leftCards} />
        </Grid>
        <Grid item lg={3} />
        <Grid item xs={12} lg={4}>
          <LinkCardGrid cards={rightCards} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Tree;
