import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Typography, useTheme } from '@material-ui/core';
import LocalizedLink from '#/src/components/common/LocalizedLink';

const EmptyResult = ({ header, text }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Grid
      container
      alignItems="center"
      spacing={3}
      style={{ padding: theme.spacing(9) }}
      direction="column">
      <Grid item>
        <Typography variant="h1">{header}</Typography>
      </Grid>
      {text && (
        <Grid item>
          <Typography paragraph>{text}</Typography>
        </Grid>
      )}
      <Grid item>
        <LocalizedLink underline="always" href="/konfo" variant="body1">
          {t('haku.siirry-opintopolun-etusivulle')}
        </LocalizedLink>
      </Grid>
    </Grid>
  );
};

export default EmptyResult;
