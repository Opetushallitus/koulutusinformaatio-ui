import React, { useCallback, useMemo, useState } from 'react';

import {
  AppBar,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  makeStyles,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { useQueryParams } from '#/src/hooks';
import {
  searchAndMoveToHaku,
  clearSelectedFilters,
  searchAll,
} from '#/src/store/reducers/hakutulosSlice';
import { getSuodatinValinnatProps } from '#/src/store/reducers/hakutulosSliceSelector';

import { HakutapaSuodatin } from './hakutulosSuodattimet/HakutapaSuodatin';
import KoulutusalaSuodatin from './hakutulosSuodattimet/KoulutusalaSuodatin';
import { KoulutustyyppiSuodatin } from './hakutulosSuodattimet/KoulutustyyppiSuodatin';
import { OpetuskieliSuodatin } from './hakutulosSuodattimet/OpetusKieliSuodatin';
import { OpetustapaSuodatin } from './hakutulosSuodattimet/OpetustapaSuodatin';
import { SijaintiSuodatin } from './hakutulosSuodattimet/SijaintiSuodatin';
import { MobileResultsPerPageExpansionMenu } from './MobileResultsPerPageExpansionMenu';
import { MobileToggleFiltersButton } from './MobileToggleFiltersButton';
import MobileToggleKoulutusOppilaitos from './MobileToggleKoulutusOppilaitos';
import MobileToggleOrderByButtonMenu from './MobileToggleOrderByButtonMenu';

const useStyles = makeStyles(() => ({
  paperAnchorBottom: {
    height: '100%',
  },
  appBarRoot: {
    height: 50,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  containerRoot: {
    marginTop: 60,
    // Calculation: Viewport height - Appbar height(60) -
    // ToggleFilter button height(40), bottom margin(30) and top margin(20))
    maxHeight: 'calc(100vh - 60px - 30px - 40px - 20px)',
    overflowY: 'scroll',
  },
  divider: {
    margin: '3px 0',
  },
}));

export const MobileFiltersOnTopMenu = ({ isFrontPage = false }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { koulutusTotal, oppilaitosTotal, selectedTab } = useSelector(
    (state: any) => ({
      koulutusTotal: state.hakutulos.koulutusTotal,
      oppilaitosTotal: state.hakutulos.oppilaitosTotal,
      selectedTab: state.hakutulos.selectedTab,
    }),
    shallowEqual
  );

  const count = useMemo(
    () => (selectedTab === 'koulutus' ? koulutusTotal : oppilaitosTotal),
    [selectedTab, koulutusTotal, oppilaitosTotal]
  );

  const suodatinValinnatProps = useSelector(getSuodatinValinnatProps);
  const chosenFilterCount = _.sumBy(_.values(suodatinValinnatProps), (arr) =>
    _.size(arr)
  );
  const apiRequestParams = useQueryParams();

  const [showFilters, setShowFilters] = useState(false);
  const toggleShowFilters = useCallback(() => setShowFilters(!showFilters), [
    showFilters,
  ]);

  const handleFiltersShowToggle = () => {
    if (isFrontPage) {
      dispatch(searchAndMoveToHaku({ history }));
    }
    toggleShowFilters();
  };

  const handleClearFilters = () => {
    dispatch(clearSelectedFilters());
    dispatch(searchAll(_.omit(apiRequestParams, _.keys(suodatinValinnatProps))));
  };

  return (
    <>
      {!showFilters && (
        <MobileToggleFiltersButton
          type={isFrontPage ? 'frontpage' : 'fixed'}
          chosenFilterCount={chosenFilterCount}
          showFilters={showFilters}
          handleFiltersShowToggle={toggleShowFilters}
        />
      )}
      <SwipeableDrawer
        classes={{ paperAnchorBottom: classes.paperAnchorBottom }}
        anchor="bottom"
        onClose={toggleShowFilters}
        onOpen={toggleShowFilters}
        open={showFilters}>
        <AppBar classes={{ root: classes.appBarRoot }}>
          <Toolbar variant="dense" disableGutters>
            <Grid container justify="space-between" alignItems="center" wrap="nowrap">
              <Grid item>
                <IconButton color="inherit" onClick={toggleShowFilters}>
                  <Close />
                </IconButton>
              </Grid>
              <Grid item>
                <Typography variant="body1" noWrap color="inherit">
                  {t('haku.rajaa-tuloksia')}
                </Typography>
              </Grid>
              <Grid item style={{ paddingRight: '10px' }}>
                {_.some(suodatinValinnatProps, (arr) => _.size(arr) > 0) && (
                  <Button
                    color="inherit"
                    classes={{ label: classes.buttonLabel }}
                    onClick={handleClearFilters}>
                    {t('haku.poista-valitut')}
                  </Button>
                )}
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Container classes={{ root: classes.containerRoot }}>
          {isFrontPage && <MobileToggleKoulutusOppilaitos />}
          {isFrontPage && <Divider className={classes.divider} />}
          <KoulutustyyppiSuodatin expanded={false} elevation={0} displaySelected />
          <Divider className={classes.divider} />
          <OpetuskieliSuodatin expanded={false} elevation={0} displaySelected />
          <Divider className={classes.divider} />
          <SijaintiSuodatin expanded={false} elevation={0} displaySelected />
          <Divider className={classes.divider} />
          <KoulutusalaSuodatin expanded={false} elevation={0} displaySelected />
          <Divider className={classes.divider} />
          <HakutapaSuodatin expanded={false} elevation={0} displaySelected />
          <Divider className={classes.divider} />
          <OpetustapaSuodatin expanded={false} elevation={0} displaySelected />
          <Divider className={classes.divider} />
          {!isFrontPage && <MobileToggleOrderByButtonMenu elevation={0} />}
          {!isFrontPage && <MobileResultsPerPageExpansionMenu elevation={0} />}
        </Container>
        <MobileToggleFiltersButton
          type="fixed"
          hitCount={count}
          showFilters={showFilters}
          handleFiltersShowToggle={handleFiltersShowToggle}
        />
      </SwipeableDrawer>
    </>
  );
};
