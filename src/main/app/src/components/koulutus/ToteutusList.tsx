import { Container, Grid, Hidden, makeStyles, Typography } from '@material-ui/core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import _fp from 'lodash/fp';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import LocalizedLink from '#/src/components/common/LocalizedLink';
import Spacer from '#/src/components/common/Spacer';
import { ToteutusCard } from '#/src/components/common/ToteutusCard';
import {
  fetchKoulutusJarjestajat,
  selectJarjestajat,
} from '#/src/store/reducers/koulutusSlice';
import { Localizer as l } from '#/src/tools/Utils';
import { Translateable } from '#/src/types/common';
import { Jarjestaja } from '#/src/types/ToteutusTypes';
import { OpetuskieliSuodatin } from './toteutusSuodattimet/OpetusKieliSuodatin';
import { SijaintiSuodatin } from './toteutusSuodattimet/SijaintiSuodatin';
import { OpetustapaSuodatin } from './toteutusSuodattimet/OpetustapaSuodatin';
import { getSuodatinValinnatProps } from '#/src/store/reducers/hakutulosSliceSelector';
import { FilterType } from '../hakutulos/hakutulosSuodattimet/SuodatinTypes';
import { MobileFiltersOnTopMenu } from './toteutusSuodattimet/MobileFiltersOnTopMenu';

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
    ?.map((item) => l.localize(item.nimi))
    .sort()
    .join(', ');

type Props = {
  oid: string;
};

type JarjestajaData = {
  jarjestajat: Jarjestaja[];
  loading: boolean;
  sortedFilters: Record<string, FilterType[]>;
};

const getQueryStr = (values: Array<{ id: string }>) =>
  values.map(({ id }) => id).join(',');

export const ToteutusList = ({ oid }: Props) => {
  const classes = useStyles();
  const { jarjestajat, loading, sortedFilters }: JarjestajaData = useSelector(
    selectJarjestajat
  );

  const valinnatFromHaku = useSelector(getSuodatinValinnatProps);
  const initialValues: Record<string, FilterType[]> = useMemo(
    () =>
      _fp.pipe(
        _fp.pick(['opetuskieli', 'sijainti', 'opetustapa']),
        // TODO: Refactor name to nimi in state
        _fp.mapValues((arr: any[]) =>
          arr.map(({ name, ...rest }) => ({ nimi: name, ...rest }))
        )
      )(valinnatFromHaku) as any,
    [valinnatFromHaku]
  );

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const getLocalizedMaksullisuus = (isMaksullinen: boolean, maksuAmount: number) =>
    isMaksullinen ? `${maksuAmount} €` : t('toteutus.maksuton');

  const [chosenFilters, setChosenFilters] = useState(initialValues);
  const chosenFilterCount = useMemo(
    () => _fp.sum(Object.values(chosenFilters).map((v) => v.length)),
    [chosenFilters]
  );

  const handleFilterChange = useCallback(
    (newChosenFilters: object) => {
      const usedFilters = { ...chosenFilters, ...newChosenFilters };
      setChosenFilters(usedFilters);
      const queryStrings = _fp.mapValues(getQueryStr, usedFilters);
      dispatch(fetchKoulutusJarjestajat(oid, queryStrings));
    },
    [dispatch, oid, chosenFilters]
  );

  const handleFiltersClear = useCallback(() => {
    const usedFilters = _fp.mapValues((_) => [], chosenFilters);
    setChosenFilters(usedFilters);
    const queryStrings = _fp.mapValues(getQueryStr, usedFilters);
    dispatch(fetchKoulutusJarjestajat(oid, queryStrings));
  }, [dispatch, oid, chosenFilters]);

  // Initial fetch with params from Haku
  useEffect(() => {
    const queryStrings = _fp.mapValues(getQueryStr, initialValues);
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
              initialValues={initialValues.opetuskieli}
              sortedValues={sortedFilters.opetuskieli}
            />
          </Grid>
          <Grid item className={classes.filter}>
            <SijaintiSuodatin
              handleFilterChange={handleFilterChange}
              initialValues={initialValues.sijainti}
              sortedMaakunnat={sortedFilters.maakunta}
              sortedKunnat={sortedFilters.kunta}
            />
          </Grid>
          <Grid item className={classes.filter}>
            <OpetustapaSuodatin
              handleFilterChange={handleFilterChange}
              initialValues={initialValues.opetustapa}
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
                  heading={l.localize(toteutus.nimi)}
                  ammattinimikkeet={localizeArrayToString(toteutus.tutkintonimikkeet)}
                  description={l.localize(toteutus.kuvaus)}
                  locations={localizeArrayToString(toteutus.kunnat)}
                  opetustapa={localizeArrayToString(toteutus.opetusajat)}
                  price={getLocalizedMaksullisuus(
                    toteutus.onkoMaksullinen,
                    toteutus.maksunMaara
                  )}
                  tyyppi={toteutus.koulutustyyppi}
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
