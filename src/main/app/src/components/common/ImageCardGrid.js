import React from 'react';
import ImageCardWithText from '#/src/components/common/ImageCardWithText';
import { Grid, useTheme, useMediaQuery, Link } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

const OppilaitosOsaGrid = (props) => {
  const { cards, cardIsLink } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Grid justify="center" container spacing={isMobile ? 1 : 3}>
      {cards.map((card, i) => {
        const cardElement = <ImageCardWithText image={card.image} cardText={card.text} />;

        return (
          <Grid item key={`ImageCardWithText-${i}`}>
            {cardIsLink ? (
              <Link component={RouterLink} to={card.link}>
                {cardElement}
              </Link>
            ) : (
              cardElement
            )}
          </Grid>
        );
      })}
    </Grid>
  );
};

export default OppilaitosOsaGrid;
