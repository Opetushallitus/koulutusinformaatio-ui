import React from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import qs from 'query-string';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
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
import { useStores } from '../../hooks';
import KoulutusTyyppiSuodatin from './hakutulosSuodattimet/KoulutusTyyppiSuodatin';
import OpetusKieliSuodatin from './hakutulosSuodattimet/OpetusKieliSuodatin';
import SijaintiSuodatin from './hakutulosSuodattimet/SijaintiSuodatin';
import KoulutusalatSuodatin from './hakutulosSuodattimet/KoulutusalatSuodatin';
import MobileOrderByExpansionMenu from './MobileOrderByExpansionMenu';
import MobileResultsPerPageExpansionMenu from './MobileResultsPerPageExpansionMenu';
import MobileToggleFiltersButton from './MobileToggleFiltersButton';

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
}));

const MobileFiltersOnTopMenu = () => {
  const history = useHistory();
  const classes = useStyles();
  const { t } = useTranslation();
  const { hakuStore } = useStores();

  const handleFiltersShowToggle = () => {
    hakuStore.toggleHakutulosFitersHidden();
  };

  const handleClearFilters = () => {
    const search = qs.parse(history.location.search);
    history.replace({
      search: qs.stringify(_.omit(search, _.keys(hakuStore.filter))),
    });
    hakuStore.clearFilters();
    hakuStore.searchKoulutukset();
    hakuStore.searchOppilaitokset();
  };

  return (
    <SwipeableDrawer
      classes={{ paperAnchorBottom: classes.paperAnchorBottom }}
      anchor="bottom"
      onClose={handleFiltersShowToggle}
      onOpen={handleFiltersShowToggle}
      open={hakuStore.showHakutulosFilters}>
      <AppBar classes={{ root: classes.appBarRoot }}>
        <Toolbar variant="dense" disableGutters>
          <Grid
            container
            justify="space-between"
            alignItems="center"
            wrap="nowrap">
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
              {_.some(hakuStore.filter, (arr) => _.size(arr) > 0) && (
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
        <KoulutusTyyppiSuodatin
          expanded={false}
          elevation={0}
          displaySelected
        />
        <Divider style={{ margin: '3px 0' }} />
        <OpetusKieliSuodatin expanded={false} elevation={0} displaySelected />
        <Divider style={{ margin: '3px 0' }} />
        <SijaintiSuodatin expanded={false} elevation={0} displaySelected />
        <Divider style={{ margin: '3px 0' }} />
        <KoulutusalatSuodatin expanded={false} elevation={0} displaySelected />
        <Divider style={{ margin: '3px 0' }} />
        <MobileOrderByExpansionMenu elevation={0} />
        <Divider style={{ margin: '3px 0' }} />
        <MobileResultsPerPageExpansionMenu elevation={0} />
      </Container>
      <MobileToggleFiltersButton />
    </SwipeableDrawer>
  );
};

export default observer(MobileFiltersOnTopMenu);
