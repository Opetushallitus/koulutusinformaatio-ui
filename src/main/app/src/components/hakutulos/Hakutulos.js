import React, { useEffect, useState } from 'react';
import qs from 'query-string';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Grid,
  Hidden,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Typography,
  useTheme,
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import LoadingCircle from '#/src/components/common/LoadingCircle';
import {
  clearPaging,
  searchAll,
  setSize,
  setOrder,
  setSort,
} from '#/src/store/reducers/hakutulosSlice';
import {
  getAPIRequestParams,
  getHakutulosProps,
} from '#/src/store/reducers/hakutulosSliceSelector';
import { Common as C } from '#/src/tools/Utils';
import Murupolku from '#/src/components/common/Murupolku';
import BackendErrorMessage from './BackendErrorMessage';
import HakutulosResults from './HakutulosResults';
import KoulutusalaSuodatin from './hakutulosSuodattimet/KoulutusalaSuodatin';
import KoulutustyyppiSuodatin from './hakutulosSuodattimet/KoulutusTyyppiSuodatin';
import OpetuskieliSuodatin from './hakutulosSuodattimet/OpetusKieliSuodatin';
import SijaintiSuodatin from './hakutulosSuodattimet/SijaintiSuodatin';
import SuodatinValinnat from './hakutulosSuodattimet/SuodatinValinnat';
import HakutulosToggle from './HakutulosToggle';
import MobileFiltersOnTopMenu from './MobileFiltersOnTopMenu';
import MobileToggleFiltersButton from './MobileToggleFiltersButton';
import Pagination from './Pagination';

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
  murupolkuContainer: {
    margin: theme.spacing(5, 0, 7, 0),
    [theme.breakpoints.down('md')]: {
      margin: theme.spacing(2, 0),
    },
    [theme.breakpoints.down('sm')]: {
      margin: theme.spacing(0),
    },
  },
}));

const Hakutulos = () => {
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();

  const hakutulosProps = useSelector(getHakutulosProps);
  const apiRequestParams = useSelector(getAPIRequestParams);
  const error = useSelector((state) => state.hakutulos.error);
  const status = useSelector((state) => state.hakutulos.status);
  const dispatch = useDispatch();

  const [pageSize, setPageSize] = useState(0);
  const [pageSort, setPageSort] = useState('score_desc');

  useEffect(() => {
    setPageSize(hakutulosProps.size);
  }, [hakutulosProps.size]);

  const handlePageSortChange = (e) => {
    const search = qs.parse(history.location.search);
    const newPageSort = e.target.value;
    const newOrder = newPageSort === 'name_asc' ? 'asc' : 'desc';
    const newSort = newPageSort === 'score_desc' ? 'score' : 'name';

    setPageSort(newPageSort);
    search.sort = newSort;
    search.order = newOrder;
    history.replace({ search: qs.stringify(C.cleanRequestParams(search)) });
    dispatch(setSort({ newSort }));
    dispatch(setOrder({ newOrder }));
    dispatch(searchAll({ ...apiRequestParams, order: newOrder, sort: newSort }));
  };
  const handlePageSizeChange = (e) => {
    const search = qs.parse(history.location.search);
    const newSize = e.target.value;

    setPageSize(newSize);
    search.size = newSize;
    search.kpage = 1;
    search.opage = 1;
    history.replace({ search: qs.stringify(C.cleanRequestParams(search)) });
    dispatch(clearPaging());
    dispatch(setSize({ newSize }));
    dispatch(searchAll({ ...apiRequestParams, size: newSize }));
  };

  const getPageSortTranslationKey = (sort) => {
    switch (sort) {
      case 'score_desc':
        return 'haku.jarjesta_osuvin';
      case 'name_desc':
        return 'haku.jarjesta_aakkoset_o_a';
      case 'name_asc':
        return 'haku.jarjesta_aakkoset_a_o';
      default:
        return '';
    }
  };

  return (
    <Grid className={classes.hakutulosSisalto} container>
      <Paper classes={{ root: classes.paperRoot }} id="hakutulos-content">
        <Grid
          container
          item
          xs={12}
          alignItems="center"
          className={classes.murupolkuContainer}>
          <Murupolku path={[{ name: t('haku.otsikko') }]} />
        </Grid>
        <Grid
          container
          alignItems="flex-start"
          spacing={2}
          style={{ marginBottom: theme.spacing(2) }}>
          <Hidden smDown>
            <Grid item lg={3} md={4} sm={12}>
              <Typography style={{ paddingTop: 10 }} variant="h5">
                {t('haku.rajaa-tuloksia')}
              </Typography>
            </Grid>
          </Hidden>
          <Grid item container lg={9} md={8} sm={12} justify="space-between">
            <Grid item lg={6} md={7} xs={12}>
              <HakutulosToggle />
            </Grid>
            <Hidden smDown>
              <Grid
                item
                container
                lg={6}
                md={5}
                sm
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
                  {hakutulosProps.pageSizeArray.map((size) => (
                    <MenuItem
                      key={size}
                      classes={{ root: classes.menuItemRoot }}
                      value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
                <Box component="span" classes={{ root: classes.boxRoot }}>
                  {t('haku.jarjesta')}
                </Box>
                <Select
                  IconComponent={ExpandMore}
                  className={classes.select}
                  style={{ marginRight: 4 }}
                  classes={{
                    icon: classes.selectIcon,
                    selectMenu: classes.selectMenu,
                  }}
                  value={pageSort}
                  onChange={handlePageSortChange}>
                  {hakutulosProps.pageSortArray.map((sort) => (
                    <MenuItem
                      key={sort}
                      classes={{ root: classes.menuItemRoot }}
                      value={sort}>
                      {t(getPageSortTranslationKey(sort))}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Hidden>
          </Grid>
        </Grid>
        <Grid item container spacing={2}>
          <Grid item lg={3} md={4} sm={12} xs={12}>
            <Hidden mdUp>
              <MobileFiltersOnTopMenu />
            </Hidden>
            <MobileToggleFiltersButton />
            <Hidden smDown>
              <KoulutustyyppiSuodatin expanded elevation={2} />
              <OpetuskieliSuodatin expanded elevation={2} />
              <SijaintiSuodatin expanded elevation={2} />
              <KoulutusalaSuodatin expanded elevation={2} />
            </Hidden>
          </Grid>
          <Grid item container direction="column" xs>
            <Grid item>
              <Hidden smDown>
                {hakutulosProps.isAnyFilterSelected && <SuodatinValinnat />}
              </Hidden>
              {status === 'loading' && <LoadingCircle />}
              {status === 'idle' && error && <BackendErrorMessage />}
              {status === 'idle' && !error && <HakutulosResults {...hakutulosProps} />}
            </Grid>
            <Grid item>
              <Pagination size={hakutulosProps.size} />
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default Hakutulos;
