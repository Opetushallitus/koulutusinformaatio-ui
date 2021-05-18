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
import { FilterValue } from '#/src/types/SuodatinTypes';
import { Jarjestaja } from '#/src/types/ToteutusTypes';

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
  // TODO: konfo-backend haluaa maakunta ja kunta -rajainten sijaan "sijainti" -rajaime, pitäisi refaktoroida sinne maakunta + kunta käyttöön
  const valuesWithSijainti = _fp.omit(['kunta', 'maakunta'], {
    ...values,
    sijainti: [...values.maakunta, ...values.kunta],
  });
  return _fp.mapValues((v) => v!.join(','), valuesWithSijainti);
};

// NOTE: Tämä ei hanskaa alakoodeja vielä, koska sellaisia suodattimia ei vielä ole KOMOTO -sivulla
const mergeCheckedValues = (
  sortedValues: Record<string, Array<FilterValue>>,
  checkedValues: Record<string, Array<string>>
) =>
  _fp.mapValues(
    (values) =>
      values.map((v) => ({
        ...v,
        checked: _fp.some(
          (checkedList) => checkedList.some((id) => v.id === id),
          checkedValues
        ),
      })),
    sortedValues
  );

export const ToteutusList = ({ oid }: Props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();

  // NOTE: Tämä haetaan vain kerran alkuarvoja varten
  const initialCheckedFilters = useSelector<any, Record<string, Array<string>>>(
    getCheckedToteutusFilters
  );
  const [initialValues] = useState(initialCheckedFilters); // Estetään uudelleenluonti
  const [checkedValues, setCheckedValues] = useState(initialValues);

  const { jarjestajat, loading, sortedFilters }: JarjestajaData = useSelector(
    selectJarjestajat
  );

  const usedValues = useMemo(() => mergeCheckedValues(sortedFilters, checkedValues), [
    sortedFilters,
    checkedValues,
  ]);
  const someSelected = _fp.some((v) => v.length > 0, checkedValues);

  // Haetaan järjestäjätulokset hakusivulta periytyneillä rajaimilla
  useEffect(() => {
    const queryStrings = getQueryStr(initialValues);
    dispatch(fetchKoulutusJarjestajat(oid, queryStrings));
  }, [dispatch, oid, initialValues]);

  const handleFilterChange = (value: FilterValue) => {
    const { id, filterId } = value;
    const filter = checkedValues[filterId];
    const wasChecked = filter.some((v) => v === id);
    const newFilter = wasChecked
      ? filter.filter((v) => v !== id)
      : filter.concat(value.id);
    const newCheckedValues = { ...checkedValues, [filterId]: newFilter };

    setCheckedValues(newCheckedValues);
    const queryStrings = getQueryStr(newCheckedValues);
    dispatch(fetchKoulutusJarjestajat(oid, queryStrings));
  };

  const handleFiltersClear = useCallback(() => {
    const usedFilters = _fp.mapValues((_) => [], checkedValues);
    setCheckedValues(usedFilters);
    const queryStrings = getQueryStr(usedFilters);
    dispatch(fetchKoulutusJarjestajat(oid, queryStrings));
  }, [dispatch, oid, checkedValues]);

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
              values={usedValues.opetuskieli}
            />
          </Grid>
          <Grid item className={classes.filter}>
            <SijaintiSuodatin
              loading={loading}
              handleFilterChange={handleFilterChange}
              maakuntaValues={usedValues.maakunta}
              kuntaValues={usedValues.kunta}
            />
          </Grid>
          <Grid item className={classes.filter}>
            <OpetustapaSuodatin
              handleFilterChange={handleFilterChange}
              values={usedValues.opetustapa}
            />
          </Grid>
        </Grid>
      </Hidden>
      <Hidden mdUp>
        <MobileFiltersOnTopMenu
          values={usedValues}
          loading={loading}
          hitCount={jarjestajat?.length}
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
