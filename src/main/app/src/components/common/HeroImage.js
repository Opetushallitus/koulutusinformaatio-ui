import React from 'react';
import { makeStyles, Box } from '@material-ui/core';
import DefaultHeroImage from '#/src/assets/images/herokuva_default.png';

const useStyles = makeStyles({
  heroImage: { maxWidth: '100%', height: 'auto' },
  imageContainer: { maxWidth: '1600px', maxHeight: '400px' },
});

const HeroImage = ({ imgUrl }) => {
  const classes = useStyles();
  return (
    <Box className={classes.imageContainer}>
      <img
        className={classes.heroImage}
        src={imgUrl || DefaultHeroImage}
        alt="Koulutuksen teemakuva"
      />
    </Box>
  );
};

export default HeroImage;