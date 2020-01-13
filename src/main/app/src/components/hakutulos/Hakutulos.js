import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { HomeOutlined } from '@material-ui/icons';
import { Grid, Paper, Typography } from '@material-ui/core';
import { Localizer as l } from '../../tools/Utils';
import HakutulosToggle from './HakutulosToggle';
import KoulutusalatSuodatin from './hakutulosSuodattimet/KoulutusalatSuodatin';
import OpetusKieliSuodatin from './hakutulosSuodattimet/OpetusKieliSuodatin';
import KoulutusTyyppiSuodatin from './hakutulosSuodattimet/KoulutusTyyppiSuodatin';
import SuodatinValinnat from './hakutulosSuodattimet/SuodatinValinnat';
import KoulutusKortti from './hakutulosKortit/KoulutusKortti';
import OppilaitosKortti from './hakutulosKortit/OppilaitosKortti';
import '../../assets/styles/components/_hakutulos.scss';
import { styles } from '../../styles';
import { withTranslation } from 'react-i18next';
import { toJS } from 'mobx';
import SijaintiSuodatin from './hakutulosSuodattimet/SijaintiSuodatin';
import { useStores } from '../../hooks';

const Hakutulos = observer((props) => {
  const { t, classes } = props;
  const { hakuStore } = useStores();
  const { filter } = hakuStore;
  const {
    koulutustyyppi,
    koulutusala,
    opetusKielet,
    sijainti,
    selectedsijainnit,
  } = filter;

  useEffect(() => {
    window.scroll(0, 170);
  }, [props]);

  const renderResultList = () => {
    const koulutusResult = toJS(hakuStore.koulutusResult);
    const oppilaitosResult = toJS(hakuStore.oppilaitosResult);
    if (hakuStore.toggleKoulutus) {
      return koulutusResult.map((r) => {
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
            opintojenlaajuus={r.opintojenlaajuus}
            opintojenlaajuusyksikko={r.opintojenlaajuusyksikko}
            tutkintonimikkeet={r.tutkintonimikkeet || []}
          />
        );
      });
    } else {
      return oppilaitosResult.map((r) => {
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
            oppilaitos={toJS(r)}
          />
        );
      });
    }
  };

  if (!hakuStore.keywordSet && !hakuStore.filterSet) {
    return (
      <div className="container">
        <div className="row result-count">
          <div className="col-12">
            <h1 aria-live="assertive">{t('haku.lisää-hakusana-tai-rajain')}</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Grid className={classes.hakutulosSisalto} container spacing={3}>
      <Paper className={classes.hakuTulosSisaltoPaperi} id="hakutulos-content">
        <Grid
          container
          item
          xs={12}
          alignItems="center"
          className={classes.hakuTulosNavText}
        >
          <Grid>
            <HomeOutlined />
          </Grid>
          <Grid item>
            <Box component="span" ml={2}>
              Etusivu
            </Box>
            <Box component="span" ml={2}>
              Hakutulokset
            </Box>
          </Grid>
        </Grid>
        <Grid
          container
          alignItems="center"
          className={classes.hakutulosToggleBarMargins}
        >
          <Grid item xs={3}>
            <Typography variant="h5">{t('haku.rajaa-tuloksia')}</Typography>
          </Grid>
          <Grid id="toggle-tabs" item xs={7}>
            <HakutulosToggle />
          </Grid>
          <Grid item xs={2}>
            <Typography align="right">{t('haku.järjestänimi_ä_ö')}</Typography>
          </Grid>
        </Grid>
        <Grid item container xs={12}>
          <Grid item xs={3} className={classes.hakutulosFiltersGrid}>
            <KoulutusTyyppiSuodatin />
            <OpetusKieliSuodatin />
            <SijaintiSuodatin />
            <KoulutusalatSuodatin />
          </Grid>
          <Grid item xs={9} className={classes.hakutulosContent}>
            {(koulutustyyppi.length > 0 ||
              opetusKielet.length > 0 ||
              koulutusala.length > 0 ||
              selectedsijainnit.length > 0 ||
              sijainti.length > 0) && <SuodatinValinnat />}
            <div id="search-results">{renderResultList()}</div>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
});

const HakuTulosWithStyles = withTranslation()(withStyles(styles)(Hakutulos));

export default HakuTulosWithStyles;
