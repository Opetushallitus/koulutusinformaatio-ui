import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import { ExpandMore, ExpandLess, HomeOutlined } from '@material-ui/icons';
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  Select,
  Typography,
} from '@material-ui/core';
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
import qs from 'query-string';
import { toJS } from 'mobx';
import SijaintiSuodatin from './hakutulosSuodattimet/SijaintiSuodatin';
import { useStores } from '../../hooks';

const Hakutulos = observer((props) => {
  const { t, classes, history } = props;
  const { hakuStore } = useStores();
  const { filter, paging } = hakuStore;
  const {
    koulutustyyppi,
    koulutusala,
    opetuskieli,
    sijainti,
    selectedsijainnit,
  } = filter;

  const [sort, setSort] = useState('');
  const [pageSize, setPageSize] = useState(0);

  useEffect(() => {
    window.scroll(0, 170);
    setSort(toJS(hakuStore.sort));
    setPageSize(toJS(paging.pageSize));
  }, [props, hakuStore.sort, hakuStore.paging, paging.pageSize]);

  const handleSortToggle = (sort) => {
    const search = qs.parse(history.location.search);
    const newSort = sort === 'asc' ? 'desc' : 'asc';

    setSort(newSort);
    search.sort = newSort;
    hakuStore.toggleSort(newSort);
    history.replace({ search: qs.stringify(search) });
    hakuStore.searchKoulutukset();
    hakuStore.searchOppilaitokset();
  };

  const handlePageSizeChange = (e) => {
    const search = qs.parse(history.location.search);
    const newPageSize = e.target.value;
    const newPaging = {
      pageOppilaitos: toJS(paging.pageOppilaitos),
      pageKoulutus: toJS(paging.pageKoulutus),
      pageSize: newPageSize,
    };

    setPageSize(newPageSize);
    search.pagesize = newPageSize;
    history.replace({ search: qs.stringify(search) });
    hakuStore.setPaging(newPaging);
    hakuStore.searchKoulutukset();
    hakuStore.searchOppilaitokset();
  };

  const renderResultList = () => {
    const koulutusResult = toJS(hakuStore.koulutusResult);
    const oppilaitosResult = toJS(hakuStore.oppilaitosResult);
    if (hakuStore.toggleKoulutus) {
      return koulutusResult.map((r) => {
        const link = `/konfo/koulutus/${r.oid}`;
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
        const link = `/konfo/oppilaitos/${r.oid}`;
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
          className={classes.hakuTulosNavText}>
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
          className={classes.hakutulosToggleBarMargins}>
          <Grid item xs={3}>
            <Typography variant="h5">{t('haku.rajaa-tuloksia')}</Typography>
          </Grid>
          <Grid id="toggle-tabs" item xs={5}>
            <HakutulosToggle />
          </Grid>
          <Grid
            container
            item
            xs={4}
            alignItems="baseline"
            direction="row-reverse">
            <Button
              endIcon={sort === 'asc' ? <ExpandMore /> : <ExpandLess />}
              classes={{
                root: classes.hakuTulosSortBtnRoot,
                label: classes.hakuTulosSortBtnLabel,
              }}
              onClick={() => handleSortToggle(sort)}>
              {sort === 'asc'
                ? t('haku.järjestänimi_a_ö')
                : t('haku.järjestänimi_ö_a')}
            </Button>
            <Box component="span" style={{ whiteSpace: 'nowrap' }}>
              <Box
                component="span"
                classes={{ root: classes.hakuTulosBoxRoot }}>
                {t('haku.tulokset-per-sivu')}
              </Box>
              <Select
                IconComponent={ExpandMore}
                className={classes.hakuTulosSelect}
                classes={{ icon: classes.hakuTulosSelectIcon }}
                value={pageSize}
                onChange={handlePageSizeChange}>
                <MenuItem
                  classes={{ root: classes.hakuStoreMenuItemRoot }}
                  value={10}>
                  10
                </MenuItem>
                <MenuItem
                  classes={{ root: classes.hakuStoreMenuItemRoot }}
                  value={20}>
                  20
                </MenuItem>
                <MenuItem
                  classes={{ root: classes.hakuStoreMenuItemRoot }}
                  value={50}>
                  50
                </MenuItem>
              </Select>
            </Box>
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
              opetuskieli.length > 0 ||
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
