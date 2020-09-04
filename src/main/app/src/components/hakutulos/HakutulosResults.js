import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Typography, useTheme } from '@material-ui/core';
import LocalizedLink from '#/src/components/common/LocalizedLink';
import _ from 'lodash';
import KoulutusKortti from './hakutulosKortit/KoulutusKortti';
import OppilaitosKortti from './hakutulosKortit/OppilaitosKortti';

const HakutulosResults = ({ selectedTab, koulutusHits, oppilaitosHits, keyword }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  if (selectedTab === 'koulutus' && _.size(koulutusHits) > 0) {
    return koulutusHits.map((r) => {
      const link = `/koulutus/${r.oid}`;
      return (
        <KoulutusKortti
          key={r.oid}
          oid={r.oid}
          tyyppi={r.koulutustyyppi}
          haettavissa={r.hakuOnKaynnissa}
          link={link}
          kuvaus={r.kuvaus}
          koulutustyyppi={r.koulutustyyppi}
          nimi={r.nimi}
          teemakuva={r.teemakuva}
          opintojenlaajuus={r.opintojenlaajuus}
          opintojenlaajuusyksikko={r.opintojenlaajuusyksikko}
          tutkintonimikkeet={r.tutkintonimikkeet || []}
        />
      );
    });
  }
  if (selectedTab === 'oppilaitos' && _.size(oppilaitosHits) > 0) {
    return oppilaitosHits.map((r) => {
      const link = `/oppilaitos/${r.oid}`;
      return (
        <OppilaitosKortti
          key={r.oid}
          oid={r.oid}
          tyyppi={r.tyyppi}
          haettavissa={false}
          nimi={r.nimi}
          link={link}
          text1={r.kayntiosoite ? r.kayntiosoite : ''}
          text2={r.postitoimipaikka ? r.postitoimipaikka : ''}
          oppilaitos={r}
        />
      );
    });
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

export default HakutulosResults;
