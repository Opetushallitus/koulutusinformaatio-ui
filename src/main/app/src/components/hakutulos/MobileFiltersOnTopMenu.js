import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import qs from 'query-string';
import _ from 'lodash';
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
import { getSuodatinValinnatProps } from '#/src/store/reducers/hakutulosSliceSelector';
import {
  toggleshowHakutulosFilters,
  clearSelectedFilters,
  searchAll,
} from '#/src/store/reducers/hakutulosSlice';
import KoulutusTyyppiSuodatin from './hakutulosSuodattimet/KoulutusTyyppiSuodatin';
import OpetusKieliSuodatin from './hakutulosSuodattimet/OpetusKieliSuodatin';
import SijaintiSuodatin from './hakutulosSuodattimet/SijaintiSuodatin';
import MobileResultsPerPageExpansionMenu from './MobileResultsPerPageExpansionMenu';
import MobileToggleFiltersButton from './MobileToggleFiltersButton';
import MobileToggleOrderByButtonMenu from './MobileToggleOrderByButtonMenu';
import KoulutusalaSuodatin from './hakutulosSuodattimet/KoulutusalaSuodatin';
import MobileToggleKoulutusOppilaitos from './MobileToggleKoulutusOppilaitos';
import OpetustapaSuodatin from './hakutulosSuodattimet/OpetustapaSuodatin';
import { useQueryParams } from '#/src/hooks';

const useStyles = makeStyles((theme) => ({
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

const MobileFiltersOnTopMenu = ({ isFrontPage = false }) => {
  const history = useHistory();
  const classes = useStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const showHakutulosFilters = useSelector(
    (state) => state.hakutulos.showHakutulosFilters
  );
  const suodatinValinnatProps = useSelector(getSuodatinValinnatProps);
  const apiRequestParams = useQueryParams();

  const handleFiltersShowToggle = () => {
    dispatch(toggleshowHakutulosFilters());
  };

  const handleClearFilters = () => {
    const search = qs.parse(history.location.search);
    history.replace({
      search: qs.stringify(_.omit(search, _.keys(suodatinValinnatProps))),
    });
    dispatch(clearSelectedFilters());
    dispatch(searchAll(_.omit(apiRequestParams, _.keys(suodatinValinnatProps))));
  };

  return (
    <SwipeableDrawer
      classes={{ paperAnchorBottom: classes.paperAnchorBottom }}
      anchor="bottom"
      onClose={handleFiltersShowToggle}
      onOpen={handleFiltersShowToggle}
      open={showHakutulosFilters}>
      <AppBar classes={{ root: classes.appBarRoot }}>
        <Toolbar variant="dense" disableGutters>
          <Grid container justify="space-between" alignItems="center" wrap="nowrap">
            <Grid item>
              <IconButton color="inherit" onClick={handleFiltersShowToggle}>
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
        <KoulutusTyyppiSuodatin expanded={false} elevation={0} displaySelected />
        <Divider className={classes.divider} />
        <OpetusKieliSuodatin expanded={false} elevation={0} displaySelected />
        <Divider className={classes.divider} />
        <SijaintiSuodatin expanded={false} elevation={0} displaySelected />
        <Divider className={classes.divider} />
        <KoulutusalaSuodatin expanded={false} elevation={0} displaySelected />
        <Divider className={classes.divider} />
        <OpetustapaSuodatin expanded={false} elevation={0} displaySelected />
        <Divider className={classes.divider} />
        {!isFrontPage && <MobileToggleOrderByButtonMenu elevation={0} />}
        {!isFrontPage && <MobileResultsPerPageExpansionMenu elevation={0} />}
      </Container>
      <MobileToggleFiltersButton isFrontPage={isFrontPage} />
    </SwipeableDrawer>
  );
};

export default MobileFiltersOnTopMenu;
