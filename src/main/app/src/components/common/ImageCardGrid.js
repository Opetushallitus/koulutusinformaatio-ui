import React from 'react';
import ImageCardWithText from '#/src/components/common/ImageCardWithText';
import { Grid, useTheme, useMediaQuery } from '@material-ui/core';
const OppilaitosOsaGrid = (props) => {
  const { cards } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Grid justify="center" container spacing={isMobile ? 1 : 3}>
      {cards.map((card, i) => (
        <Grid item key={`ImageCardWithText-${i}`}>
          <ImageCardWithText image={card.image} cardText={card.text} />
        </Grid>
      ))}
    </Grid>
  );
};

export default OppilaitosOsaGrid;
