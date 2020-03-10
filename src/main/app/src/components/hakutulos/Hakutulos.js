import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import qs from 'query-string';
import { useTranslation } from 'react-i18next';
import { ExpandMore, ExpandLess } from '@material-ui/icons';
import {
  Box,
  Button,
  Hidden,
  Grid,
  Link,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Typography,
  useTheme,
} from '@material-ui/core';
import HakutulosToggle from './HakutulosToggle';
import KoulutusalatSuodatin from './hakutulosSuodattimet/KoulutusalatSuodatin';
import KoulutusKortti from './hakutulosKortit/KoulutusKortti';
import KoulutusTyyppiSuodatin from './hakutulosSuodattimet/KoulutusTyyppiSuodatin';
import OpetusKieliSuodatin from './hakutulosSuodattimet/OpetusKieliSuodatin';
import OppilaitosKortti from './hakutulosKortit/OppilaitosKortti';
import Pagination from './Pagination';
import BackendErrorMessage from './BackendErrorMessage';
import SuodatinValinnat from './hakutulosSuodattimet/SuodatinValinnat';
import SijaintiSuodatin from './hakutulosSuodattimet/SijaintiSuodatin';
import { useStores } from '../../hooks';
import Murupolku from '../common/Murupolku';
import { useHistory } from 'react-router-dom';
import LoadingCircle from '../common/LoadingCircle';

const useStyles = makeStyles((theme) => ({
  hakutulosSisalto: {
    maxWidth: 1600,
    margin: 'auto',
  },
  paperRoot: {
    width: '100%',
    boxShadow: 'none',
    [theme.breakpoints.down('xl')]: {
      padding: theme.spacing(1, 11),
    },
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(1, 1),
    },
  },
  boxRoot: {
    fontSize: 14,
    whiteSpace: 'nowrap',
    marginRight: theme.spacing(1),
  },
  select: {
    '&:before': {
      borderBottom: 'none',
    },
  },
  selectIcon: {
    fontSize: 20,
  },
  selectMenu: {
    overflow: 'inherit',
  },
  menuItemRoot: {
    paddingLeft: 12,
  },
  buttonRoot: {
    marginLeft: theme.spacing(1),
  },
  buttonLabel: {
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
}));

const Hakutulos = () => {
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const { hakuStore, restStore } = useStores();
  const { filter, paging } = hakuStore;
  const {
    koulutustyyppi,
    koulutusala,
    opetuskieli,
    sijainti,
    selectedsijainnit,
  } = filter;

  const [pageSize, setPageSize] = useState(0);

  useEffect(() => {
    window.scroll(0, 170);
    setPageSize(paging.pageSize);
  }, [paging.pageSize]);

  const handleSortToggle = () => {
    const search = qs.parse(history.location.search);
    const newSort = hakuStore.sort === 'asc' ? 'desc' : 'asc';
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

  const ResultList = observer(() => {
    const koulutusResult = hakuStore.koulutusResult;
    const oppilaitosResult = hakuStore.oppilaitosResult;

    switch (hakuStore.state) {
      case 'pending':
        if (restStore.restErrorsArrLength > 0) {
          return <BackendErrorMessage />;
        }
        return <LoadingCircle />;
      case 'done':
        if (hakuStore.toggle === 'koulutus' && hakuStore.hasKoulutusResult) {
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
                teemakuva={r.teemakuva}
                opintojenlaajuus={r.opintojenlaajuus}
                opintojenlaajuusyksikko={r.opintojenlaajuusyksikko}
                tutkintonimikkeet={r.tutkintonimikkeet || []}
              />
            );
          });
        }
        if (
          hakuStore.toggle === 'oppilaitos' &&
          hakuStore.hasOppilaitosResult
        ) {
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
              <Typography variant="h1">
                {t('haku.ei-hakutuloksia', hakuStore.keyword)}
              </Typography>
            </Grid>
            <Grid item>
              <Typography paragraph>
                {t('haku.summary', { keyword: hakuStore.keyword })}
              </Typography>
            </Grid>
            <Grid item>
              <Link underline="always" href="/konfo" variant="body1">
                {t('haku.siirry-opintopolun-etusivulle')}
              </Link>
            </Grid>
          </Grid>
        );
      default:
        break;
    }
  });

  return (
    <Grid className={classes.hakutulosSisalto} container>
      <Paper classes={{ root: classes.paperRoot }} id="hakutulos-content">
        <Grid
          container
          item
          xs={12}
          alignItems="center"
          style={{ margin: theme.spacing(5, 0, 7, 0) }}>
          <Murupolku path={[{ name: t('haku.otsikko') }]} />
        </Grid>
        <Grid
          container
          alignItems="flex-start"
          spacing={2}
          style={{ marginBottom: theme.spacing(2) }}>
          <Grid item lg={3} md={4} sm={12}>
            <Typography style={{ paddingTop: 10 }} variant="h5">
              {t('haku.rajaa-tuloksia')}
            </Typography>
          </Grid>
          <Grid item container lg={9} md={8} sm={12} justify="space-between">
            <Grid item lg={6} md={7} sm={7} xs={12}>
              <HakutulosToggle />
            </Grid>
            <Hidden xsDown>
              <Grid
                item
                container
                lg={6}
                md={5}
                sm={5}
                xs
                justify="flex-end"
                style={{ paddingTop: 6 }}
                alignItems="baseline">
                <Box component="span" classes={{ root: classes.boxRoot }}>
                  {t('haku.tulokset-per-sivu')}
                </Box>
                <Select
                  IconComponent={ExpandMore}
                  className={classes.select}
                  style={{ marginRight: 4 }}
                  classes={{
                    icon: classes.selectIcon,
                    selectMenu: classes.selectMenu,
                  }}
                  value={pageSize}
                  onChange={handlePageSizeChange}>
                  {hakuStore.pageSizeArray.map((size) => (
                    <MenuItem
                      key={size}
                      classes={{ root: classes.menuItemRoot }}
                      value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
                <Button
                  endIcon={
                    hakuStore.sort === 'asc' ? <ExpandMore /> : <ExpandLess />
                  }
                  classes={{
                    root: classes.buttonRoot,
                    label: classes.buttonLabel,
                  }}
                  onClick={() => handleSortToggle(hakuStore.sort)}>
                  {hakuStore.sort === 'asc'
                    ? t('haku.järjestänimi_a_ö')
                    : t('haku.järjestänimi_ö_a')}
                </Button>
              </Grid>
            </Hidden>
          </Grid>
        </Grid>
        <Grid item container spacing={2}>
          <Grid item lg={3} md={4} sm={12} xs={12}>
            <KoulutusTyyppiSuodatin />
            <OpetusKieliSuodatin />
            <SijaintiSuodatin />
            <KoulutusalatSuodatin />
          </Grid>
          <Grid item container direction="column" xs>
            <Grid item>
              {(koulutustyyppi.length > 0 ||
                opetuskieli.length > 0 ||
                koulutusala.length > 0 ||
                selectedsijainnit.length > 0 ||
                sijainti.length > 0) && <SuodatinValinnat />}
              <ResultList />
            </Grid>
            <Grid item style={{ margin: 'auto' }}>
              <Pagination />
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default observer(Hakutulos);
