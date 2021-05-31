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
import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';

import { MobileToggleFiltersButton } from '#/src/components/hakutulos/MobileToggleFiltersButton';
import { FilterValue } from '#/src/types/SuodatinTypes';

import { OpetuskieliSuodatin } from './OpetusKieliSuodatin';
import { OpetustapaSuodatin } from './OpetustapaSuodatin';
import { SijaintiSuodatin } from './SijaintiSuodatin';

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

type Props = {
  values: Record<string, Array<FilterValue>>;
  hitCount: number;
  loading: boolean;
  handleFilterChange: (value: FilterValue) => void;
  clearChosenFilters: VoidFunction;
};

export const MobileFiltersOnTopMenu = ({
  values,
  hitCount,
  loading,
  handleFilterChange,
  clearChosenFilters,
}: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const [showFilters, setShowFilters] = useState(false);
  const toggleShowFilters = useCallback(() => setShowFilters(!showFilters), [
    showFilters,
  ]);

  const chosenFilterCount = useMemo(
    () =>
      _fp.flow(
        _fp.map(
          (v: Array<FilterValue>) => v.filter((filterValue) => filterValue.checked).length
        ),
        _fp.sum
      )(values as any), // TS ei osaa päätellä tätä oikein
    [values]
  );

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
            values={values.opetuskieli}
          />
          <Divider className={classes.divider} />
          <SijaintiSuodatin
            handleFilterChange={handleFilterChange}
            expanded={false}
            elevation={0}
            maakuntaValues={values.maakunta}
            kuntaValues={values.kunta}
            loading={loading}
          />
          <Divider className={classes.divider} />
          <OpetustapaSuodatin
            handleFilterChange={handleFilterChange}
            expanded={false}
            elevation={0}
            values={values.opetustapa}
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
