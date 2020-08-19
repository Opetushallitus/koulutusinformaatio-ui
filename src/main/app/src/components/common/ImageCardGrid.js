import React from 'react';
import ImageCardWithText from '#/src/components/common/ImageCardWithText';
import { Grid, useTheme, useMediaQuery } from '@material-ui/core';
import DefaultHeroImage from '#/src/assets/images/herokuva_default.png';

const OppilaitosOsaGrid = (props) => {
  const { cards } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  console.log(cards);
  return (
    <Grid justify="center" container spacing={isMobile ? 1 : 3}>
      {cards.map((osa, i) => (
        <Grid item key={`ImageCardWithText-${i}`}>
          <ImageCardWithText image={DefaultHeroImage} cardText={osa.nimi} />
        </Grid>
      ))}
    </Grid>
  );
};

export default OppilaitosOsaGrid;
