import React, { useState, useEffect } from 'react';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import qs from 'query-string';
import { withTranslation } from 'react-i18next';
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
import HakutulosToggle from './HakutulosToggle';
import KoulutusalatSuodatin from './hakutulosSuodattimet/KoulutusalatSuodatin';
import KoulutusKortti from './hakutulosKortit/KoulutusKortti';
import KoulutusTyyppiSuodatin from './hakutulosSuodattimet/KoulutusTyyppiSuodatin';
import OpetusKieliSuodatin from './hakutulosSuodattimet/OpetusKieliSuodatin';
import OppilaitosKortti from './hakutulosKortit/OppilaitosKortti';
import Pagination from './Pagination';
import SuodatinValinnat from './hakutulosSuodattimet/SuodatinValinnat';
import SijaintiSuodatin from './hakutulosSuodattimet/SijaintiSuodatin';
import { useStores } from '../../hooks';
import Murupolku from '../common/Murupolku';
import { styles } from '../../styles';
import '../../assets/styles/components/_hakutulos.scss';

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
  }, [
    props,
    hakuStore.sort,
    hakuStore.paging,
    paging.pageSize,
    hakuStore.koulutusResult,
    hakuStore.oppilaitosResult,
  ]);

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

    setPageSize(newPageSize);
    search.pagesize = newPageSize;
    search.kpage = 1;
    search.opage = 1;
    history.replace({ search: qs.stringify(search) });
    hakuStore.clearOffsetAndPaging();
    hakuStore.setPagingPageSize(newPageSize);
    hakuStore.searchKoulutukset();
    hakuStore.searchOppilaitokset();
  };

  const RenderResultList = () => {
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
          <Murupolku path={[{ name: t('haku.otsikko') }]} />
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
          <Grid container item xs={4} alignItems="baseline">
            <Grid xs={6} container item wrap="nowrap" justify="flex-end">
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
                {hakuStore.pageSizeArray.map((size) => (
                  <MenuItem
                    classes={{ root: classes.hakuStoreMenuItemRoot }}
                    value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid xs={6} container item justify="flex-end">
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
            </Grid>
          </Grid>
        </Grid>
        <Grid item container xs={12}>
          <Grid item xs={3} className={classes.hakutulosFiltersGrid}>
            <KoulutusTyyppiSuodatin />
            <OpetusKieliSuodatin />
            <SijaintiSuodatin />
            <KoulutusalatSuodatin />
          </Grid>
          <Grid
            item
            container
            direction="column"
            xs={9}
            className={classes.hakutulosContent}>
            <Grid item>
              {(koulutustyyppi.length > 0 ||
                opetuskieli.length > 0 ||
                koulutusala.length > 0 ||
                selectedsijainnit.length > 0 ||
                sijainti.length > 0) && <SuodatinValinnat />}
              <RenderResultList />
            </Grid>
            <Grid item style={{ margin: 'auto' }}>
              <Pagination />
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
});

const HakuTulosWithStyles = withTranslation()(withStyles(styles)(Hakutulos));

export default HakuTulosWithStyles;
