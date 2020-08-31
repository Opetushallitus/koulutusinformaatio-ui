import React from 'react';
import { Box, Divider, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import KoulutusalaSuodatin from '#/src/components/hakutulos/hakutulosSuodattimet/KoulutusalaSuodatin';
import OpetuskieliSuodatin from '#/src/components/hakutulos/hakutulosSuodattimet/OpetusKieliSuodatin';
import SijaintiSuodatin from '#/src/components/hakutulos/hakutulosSuodattimet/SijaintiSuodatin';
import KoulutustyyppiSuodatin from '#/src/components/hakutulos/hakutulosSuodattimet/KoulutusTyyppiSuodatin';
import Suodatin from '#/src/components/haku/Suodatin';

const useStyles = makeStyles((theme) => ({
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
        btnId="koulutusala-popover"
        header={t('haku.koulutusalat')}
      />
      <Divider orientation="vertical" flexItem />
      <Suodatin
        SuodatinComponent={KoulutustyyppiSuodatin}
        btnId="koulutustyyppi-popover"
        header={t('haku.koulutustyyppi')}
      />
      <Divider orientation="vertical" flexItem />
      <Suodatin
        SuodatinComponent={OpetuskieliSuodatin}
        btnId="opetuskieli-popover"
        header={t('haku.opetuskieli')}
      />
      <Divider orientation="vertical" flexItem />
      <Suodatin
        SuodatinComponent={SijaintiSuodatin}
        btnId="sijainti-popover"
        header={t('haku.sijainti')}
      />
    </Box>
  );
};
export default HakupalkkiFilters;
