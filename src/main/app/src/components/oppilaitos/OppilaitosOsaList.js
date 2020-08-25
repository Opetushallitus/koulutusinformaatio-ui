import React from 'react';
import ImageCardGrid from '#/src/components/common/ImageCardGrid';
import { Box, Typography, useTheme, useMediaQuery } from '@material-ui/core';
import Spacer from '../common/Spacer';
import DefaultHeroImage from '#/src/assets/images/herokuva_default.png';

const OppilaitosOsaList = (props) => {
  const { oppilaitosOsat, title } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const cardInfos = oppilaitosOsat.map((osa) => ({
    text: osa.nimi,
    image: osa?.oppilaitoksenOsa?.teemakuva || DefaultHeroImage,
  }));
  return (
    <Box mt={isMobile ? 6 : 12} display="flex" alignItems="center" flexDirection="column">
      <Typography variant="h2">{title}</Typography>
      <Spacer />
      <Box mt={isMobile ? 0 : 2}>
        <ImageCardGrid cards={cardInfos} />
      </Box>
    </Box>
  );
};

export default OppilaitosOsaList;
