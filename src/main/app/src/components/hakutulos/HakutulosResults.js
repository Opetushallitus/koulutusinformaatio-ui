import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Typography, useTheme } from '@material-ui/core';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import _ from 'lodash';
import KoulutusKortti from './hakutulosKortit/KoulutusKortti';
import OppilaitosKortti from './hakutulosKortit/OppilaitosKortti';

export const HakutulosResults = ({
  selectedTab,
  koulutusHits,
  oppilaitosHits,
  keyword,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  if (selectedTab === 'koulutus' && _.size(koulutusHits) > 0) {
    return koulutusHits.map((koulutus) => (
      <KoulutusKortti key={koulutus.oid} koulutus={koulutus} />
    ));
  }
  if (selectedTab === 'oppilaitos' && _.size(oppilaitosHits) > 0) {
    return oppilaitosHits.map((oppilaitos) => (
      <OppilaitosKortti key={oppilaitos.oid} oppilaitos={oppilaitos} />
    ));
  }

  return (
    <Grid
      container
      alignItems="center"
      spacing={3}
      style={{ padding: theme.spacing(9) }}
      direction="column">
      <Grid item>
        <Typography variant="h1">{t('haku.ei-hakutuloksia', keyword)}</Typography>
      </Grid>
      <Grid item>
        <Typography paragraph>{t('haku.summary', { keyword: keyword })}</Typography>
      </Grid>
      <Grid item>
        <LocalizedLink underline="always" href="/konfo" variant="body1">
          {t('haku.siirry-opintopolun-etusivulle')}
        </LocalizedLink>
      </Grid>
    </Grid>
  );
};
