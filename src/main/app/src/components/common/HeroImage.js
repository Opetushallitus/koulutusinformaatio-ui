import React from 'react';
import { makeStyles, Card, CardMedia } from '@material-ui/core';
import DefaultHeroImage from '#/src/assets/images/herokuva_default.png';

const useStyles = makeStyles((theme) => ({
  card: {
    width: '850px',
    [theme.breakpoints.down('sm')]: {
      width: '450px',
    },
  },

  media: {
    display: 'block',
    height: 0,
    paddingTop: '56.25%',
  },
}));

const HeroImage = ({ imgUrl }) => {
  const classes = useStyles();
  return (
    <Card className={classes.card} elevation={1}>
      <CardMedia
        className={classes.media}
        image={imgUrl || DefaultHeroImage}
        title={'Koulutuksen teemakuva'}
        aria-label={'Koulutuksen teemakuva'}></CardMedia>
    </Card>
  );
};

export default HeroImage;
