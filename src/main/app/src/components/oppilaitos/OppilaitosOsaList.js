import React from 'react';
import ImageCardGrid from '#/src/components/common/ImageCardGrid';
import { Box, Typography, useTheme, useMediaQuery } from '@material-ui/core';
import Spacer from '../common/Spacer';

const OppilaitosOsaList = (props) => {
  const { oppilaitosOsat, title } = props;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Box mt={isMobile ? 6 : 12} display="flex" alignItems="center" flexDirection="column">
      <Typography variant="h2">{title}</Typography>
      <Spacer />
      <Box mt={isMobile ? 0 : 2}>
        <ImageCardGrid cards={oppilaitosOsat} />
      </Box>
    </Box>
  );
};

export default OppilaitosOsaList;
