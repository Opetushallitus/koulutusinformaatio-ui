import { MobileToggleFiltersButton } from '#/src/components/hakutulos/MobileToggleFiltersButton';
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
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OpetuskieliSuodatin } from './OpetusKieliSuodatin';
import { SijaintiSuodatin } from './SijaintiSuodatin';
import { OpetustapaSuodatin } from './OpetustapaSuodatin';

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
    height: '100%',
    overflowY: 'scroll',
  },
  divider: {
    margin: '3px 0',
  },
}));

export const MobileFiltersOnTopMenu = ({
  chosenFilters,
  sortedValues,
  hitCount,
  chosenFilterCount,
  handleFilterChange,
  clearChosenFilters,
}: any) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [showFilters, setShowFilters] = useState(false);
  const toggleShowFilters = useCallback(() => setShowFilters(!showFilters), [
    showFilters,
  ]);

  return (
    <>
      {!showFilters && (
        <MobileToggleFiltersButton
          type="KOMO"
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
                {chosenFilterCount > 0 && (
                  <Button
                    color="inherit"
                    classes={{ label: classes.buttonLabel }}
                    onClick={clearChosenFilters}>
                    {t('haku.poista-valitut')}
                  </Button>
                )}
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Container classes={{ root: classes.containerRoot }}>
          <OpetuskieliSuodatin
            handleFilterChange={handleFilterChange}
            expanded={false}
            elevation={0}
            initialValues={chosenFilters.opetuskieli}
            sortedValues={sortedValues.opetuskieli}
          />
          <Divider className={classes.divider} />
          <SijaintiSuodatin
            handleFilterChange={handleFilterChange}
            expanded={false}
            elevation={0}
            initialValues={chosenFilters.sijainti}
            sortedMaakunnat={sortedValues.maakunta}
            sortedKunnat={sortedValues.kunta}
          />
          <Divider className={classes.divider} />
          <OpetustapaSuodatin
            handleFilterChange={handleFilterChange}
            expanded={false}
            elevation={0}
            initialValues={chosenFilters.opetuskieli}
            sortedValues={sortedValues.opetuskieli}
          />
          <Divider className={classes.divider} />
        </Container>
        <MobileToggleFiltersButton
          type="fixed"
          chosenFilterCount={chosenFilterCount}
          hitCount={hitCount}
          showFilters={showFilters}
          handleFiltersShowToggle={toggleShowFilters}
        />
      </SwipeableDrawer>
    </>
  );
};
