import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Container, Grid, Hidden, makeStyles, Typography } from '@material-ui/core';
import _fp from 'lodash/fp';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';

import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import Spacer from '#/src/components/common/Spacer';
import { ToteutusCard } from '#/src/components/common/ToteutusCard';
import { getCheckedToteutusFilters } from '#/src/store/reducers/hakutulosSliceSelector';
import {
  fetchKoulutusJarjestajat,
  selectJarjestajat,
} from '#/src/store/reducers/koulutusSlice';
import { localize, getLocalizedMaksullisuus } from '#/src/tools/localization';
import { Translateable } from '#/src/types/common';
import { Jarjestaja } from '#/src/types/ToteutusTypes';

import { FilterValue } from '../hakutulos/hakutulosSuodattimet/SuodatinTypes';
import { MobileFiltersOnTopMenu } from './toteutusSuodattimet/MobileFiltersOnTopMenu';
import { OpetuskieliSuodatin } from './toteutusSuodattimet/OpetusKieliSuodatin';
import { OpetustapaSuodatin } from './toteutusSuodattimet/OpetustapaSuodatin';
import { SijaintiSuodatin } from './toteutusSuodattimet/SijaintiSuodatin';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '100px',
  },
  grid: {
    maxWidth: '900px',
  },
  filtersContainer: {
    marginBottom: '16px',
  },
  filter: {
    minWidth: '250px',
  },
});

const localizeArrayToString = (toLocalizeArray: Array<{ nimi: Translateable }>) =>
  toLocalizeArray
    ?.map((item) => localize(item))
    .sort()
    .join(', ');

type Props = {
  oid: string;
};

type JarjestajaData = {
  jarjestajat: Array<Jarjestaja>;
  loading: boolean;
  sortedFilters: Record<string, Array<FilterValue>>;
};

const getQueryStr = (values: Record<string, Array<string>>) => {
  // TODO: konfo-backend haluaa sijainti -rajaimen maakunta ja kunta sijaan, pitäisi refaktoroida sieltä pois
  const valuesWithSijainti = _fp.omit(['kunta', 'maakunta'], {
    ...values,
    sijainti: [...values.maakunta, ...values.kunta],
  });
  return _fp.mapValues((v) => v!.join(','), valuesWithSijainti);
};

export const ToteutusList = ({ oid }: Props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();

  // NOTE: Tämä haetaan vain kerran alkuarvoja varten
  const initialCheckedFilters = useSelector<any, Record<string, Array<string>>>(
    getCheckedToteutusFilters
  );
  const [initialValues] = useState(initialCheckedFilters); // Estetään uudelleenluonti
  const [chosenFilters, setChosenFilters] = useState(initialValues);

  const { jarjestajat, loading, sortedFilters }: JarjestajaData = useSelector(
    selectJarjestajat
  );
  const chosenFilterCount = useMemo(
    () => _fp.sum(Object.values(chosenFilters).map((v) => v.length)),
    [chosenFilters]
  );

  const handleFilterChange = useCallback(
    (newChosenFilters: object) => {
      const usedFilters = { ...chosenFilters, ...newChosenFilters };
      setChosenFilters(usedFilters);
      const queryStrings = getQueryStr(usedFilters);
      dispatch(fetchKoulutusJarjestajat(oid, queryStrings));
    },
    [dispatch, oid, chosenFilters]
  );

  const handleFiltersClear = useCallback(() => {
    const usedFilters = _fp.mapValues((_) => [], chosenFilters);
    setChosenFilters(usedFilters);
    const queryStrings = getQueryStr(usedFilters);
    dispatch(fetchKoulutusJarjestajat(oid, queryStrings));
  }, [dispatch, oid, chosenFilters]);

  // Initial fetch with params from Haku
  useEffect(() => {
    const queryStrings = getQueryStr(initialValues);
    dispatch(fetchKoulutusJarjestajat(oid, queryStrings));
  }, [dispatch, oid, initialValues]);

  const someSelected = useMemo(
    () => Object.values(chosenFilters).some((v) => v.length > 0),
    [chosenFilters]
  );

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Typography variant="h2">{t('koulutus.tarjonta')}</Typography>
      <Spacer />
      <Hidden smDown>
        <Grid
          container
          direction="row"
          justify="center"
          spacing={2}
          className={classes.filtersContainer}>
          <Grid item className={classes.filter}>
            <OpetuskieliSuodatin
              handleFilterChange={handleFilterChange}
              initialValues={initialCheckedFilters.opetuskieli}
              sortedValues={sortedFilters.opetuskieli}
            />
          </Grid>
          <Grid item className={classes.filter}>
            <SijaintiSuodatin
              handleFilterChange={handleFilterChange}
              initialMaakunnat={initialCheckedFilters.maakunta}
              initialKunnat={initialCheckedFilters.kunta}
              sortedMaakunnat={sortedFilters.maakunta}
              sortedKunnat={sortedFilters.kunta}
            />
          </Grid>
          <Grid item className={classes.filter}>
            <OpetustapaSuodatin
              handleFilterChange={handleFilterChange}
              initialValues={initialCheckedFilters.opetustapa}
              sortedValues={sortedFilters.opetustapa}
            />
          </Grid>
        </Grid>
      </Hidden>
      <Hidden mdUp>
        <MobileFiltersOnTopMenu
          chosenFilters={chosenFilters}
          sortedValues={sortedFilters}
          hitCount={jarjestajat?.length}
          chosenFilterCount={chosenFilterCount}
          handleFilterChange={handleFilterChange}
          clearChosenFilters={handleFiltersClear}
        />
      </Hidden>
      {loading ? (
        <LoadingCircle />
      ) : jarjestajat?.length > 0 ? (
        <Grid
          container
          direction="column"
          justify="center"
          className={classes.grid}
          alignItems="stretch"
          spacing={1}>
          {jarjestajat.map((toteutus, i) => (
            <Grid item key={i}>
              <LocalizedLink
                underline="none"
                component={RouterLink}
                to={`/toteutus/${toteutus.toteutusOid}`}>
                <ToteutusCard
                  organizer={localize(toteutus)}
                  heading={localize(toteutus.toteutusNimi)}
                  description={localize(toteutus.kuvaus)}
                  locations={localizeArrayToString(toteutus.kunnat)}
                  opetustapa={localizeArrayToString(toteutus.opetusajat)}
                  price={getLocalizedMaksullisuus(
                    toteutus.maksullisuustyyppi,
                    toteutus.maksunMaara
                  )}
                  tyyppi={toteutus.koulutustyyppi}
                  image={toteutus.kuva}
                  hakukaynnissa={toteutus.hakukaynnissa}
                />
              </LocalizedLink>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" paragraph>
          {t(
            someSelected
              ? 'koulutus.ei-rajaimia-vastaavia-toteutuksia'
              : 'koulutus.ei-toteutuksia'
          )}
        </Typography>
      )}
    </Container>
  );
};
