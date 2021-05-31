import React from 'react';

import { Box, Divider, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import Suodatin from '#/src/components/haku/Suodatin';
import { KoulutusalaSuodatin } from '#/src/components/hakutulos/hakutulosSuodattimet/KoulutusalaSuodatin';
import { KoulutustyyppiSuodatin } from '#/src/components/hakutulos/hakutulosSuodattimet/KoulutustyyppiSuodatin';
import { OpetuskieliSuodatin } from '#/src/components/hakutulos/hakutulosSuodattimet/OpetusKieliSuodatin';
import { SijaintiSuodatin } from '#/src/components/hakutulos/hakutulosSuodattimet/SijaintiSuodatin';

const useStyles = makeStyles(() => ({
  container: {
    padding: '10px',
  },
}));

const HakupalkkiFilters = () => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Box display="flex" justifyContent="center" className={classes.container}>
      <Suodatin
        SuodatinComponent={KoulutusalaSuodatin}
        id="koulutusala-popover"
        header={t('haku.koulutusalat')}
      />
      <Divider orientation="vertical" flexItem />
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
    </Box>
  );
};

export default HakupalkkiFilters;
