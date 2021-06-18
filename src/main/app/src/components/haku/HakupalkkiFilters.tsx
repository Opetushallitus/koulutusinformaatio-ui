import React from 'react';

import { Box, Divider, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { HakutapaSuodatin } from '#/src/components/hakutulos/hakutulosSuodattimet/HakutapaSuodatin';
import { KoulutusalaSuodatin } from '#/src/components/hakutulos/hakutulosSuodattimet/KoulutusalaSuodatin';
import { KoulutustyyppiSuodatin } from '#/src/components/hakutulos/hakutulosSuodattimet/KoulutustyyppiSuodatin';
import { OpetuskieliSuodatin } from '#/src/components/hakutulos/hakutulosSuodattimet/OpetusKieliSuodatin';
import { OpetustapaSuodatin } from '#/src/components/hakutulos/hakutulosSuodattimet/OpetustapaSuodatin';
import { PohjakoulutusvaatimusSuodatin } from '#/src/components/hakutulos/hakutulosSuodattimet/PohjakoulutusvaatimusSuodatin';
import { SijaintiSuodatin } from '#/src/components/hakutulos/hakutulosSuodattimet/SijaintiSuodatin';
import { ValintatapaSuodatin } from '#/src/components/hakutulos/hakutulosSuodattimet/ValintatapaSuodatin';

import { Suodatin } from './Suodatin';

const useStyles = makeStyles(() => ({
  container: {
    padding: '10px',
  },
}));

export const HakupalkkiFilters = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      justifyContent="center"
      className={classes.container}>
      <Suodatin
        SuodatinComponent={KoulutustyyppiSuodatin}
        id="koulutustyyppi-popover"
        header={t('haku.koulutustyyppi')}
      />
      <Divider orientation="vertical" flexItem />
      <Suodatin
        SuodatinComponent={OpetuskieliSuodatin}
        id="opetuskieli-popover"
        header={t('haku.opetuskieli')}
      />
      <Divider orientation="vertical" flexItem />
      <Suodatin
        SuodatinComponent={SijaintiSuodatin}
        id="sijainti-popover"
        header={t('haku.sijainti')}
      />
      <Divider orientation="vertical" flexItem />
      <Suodatin
        SuodatinComponent={PohjakoulutusvaatimusSuodatin}
        id="sijainti-popover"
        header={t('haku.pohjakoulutusvaatimus')}
      />
      <Divider orientation="vertical" flexItem />
      <Suodatin
        SuodatinComponent={HakutapaSuodatin}
        id="sijainti-popover"
        header={t('haku.hakutapa')}
      />
      <Divider orientation="vertical" flexItem />
      <Suodatin
        SuodatinComponent={ValintatapaSuodatin}
        id="sijainti-popover"
        header={t('haku.valintatapa')}
      />
      <Divider orientation="vertical" flexItem />
      <Suodatin
        SuodatinComponent={KoulutusalaSuodatin}
        id="koulutusala-popover"
        header={t('haku.koulutusalat')}
      />
      <Divider orientation="vertical" flexItem />
      <Suodatin
        SuodatinComponent={OpetustapaSuodatin}
        id="sijainti-popover"
        header={t('haku.opetustapa')}
      />
    </Box>
  );
};
