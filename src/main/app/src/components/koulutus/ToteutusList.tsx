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
import { FILTER_TYPES } from '#/src/constants';
import { getInitialCheckedToteutusFilters } from '#/src/store/reducers/hakutulosSliceSelector';
import {
  fetchKoulutusJarjestajat,
  selectJarjestajat,
} from '#/src/store/reducers/koulutusSlice';
import {
  getFilterStateChanges,
  getFilterWithChecked,
  sortValues,
} from '#/src/tools/filters';
import { localize, getLocalizedMaksullisuus } from '#/src/tools/localization';
import { Translateable } from '#/src/types/common';
import { FilterValue } from '#/src/types/SuodatinTypes';
import { Jarjestaja } from '#/src/types/ToteutusTypes';

import { HakutapaSuodatin } from './toteutusSuodattimet/HakutapaSuodatin';
import { MobileFiltersOnTopMenu } from './toteutusSuodattimet/MobileFiltersOnTopMenu';
import { OpetuskieliSuodatin } from './toteutusSuodattimet/OpetusKieliSuodatin';
import { OpetustapaSuodatin } from './toteutusSuodattimet/OpetustapaSuodatin';
import { PohjakoulutusvaatimusSuodatin } from './toteutusSuodattimet/PohjakoulutusvaatimusSuodatin';
import { SijaintiSuodatin } from './toteutusSuodattimet/SijaintiSuodatin';
import { ValintatapaSuodatin } from './toteutusSuodattimet/ValintatapaSuodatin';

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
  sortedFilters: Record<string, Record<string, FilterValue>>;
};

const getQueryStr = (values: Record<string, Array<string> | boolean>) => {
  // TODO: konfo-backend haluaa maakunta ja kunta -rajainten sijaan "sijainti" -rajaimen, pitäisi refaktoroida sinne maakunta + kunta käyttöön
  const valuesWithSijainti = _fp.omit(
    ['kunta', 'maakunta', 'koulutusala', 'koulutustyyppi', 'koulutustyyppi-muu'],
    {
      ...values,
      sijainti: [
        ...(values.maakunta as Array<string>),
        ...(values.kunta as Array<string>),
      ],
    }
  );

  return _fp.mapValues(
    (v) => (Array.isArray(v) ? v!.join(',') : v!.toString()),
    valuesWithSijainti
  );
};

export const ToteutusList = ({ oid }: Props) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();

  // NOTE: Tämä haetaan vain kerran alkuarvoja varten + Haetaan järjestäjätulokset hakusivulta periytyneillä rajaimilla
  const initialCheckedFilters = useSelector<any, Record<string, Array<string>>>(
    getInitialCheckedToteutusFilters
  );
  const [initialValues] = useState(initialCheckedFilters);
  useEffect(() => {
    const queryStrings = getQueryStr(initialValues);
    dispatch(fetchKoulutusJarjestajat(oid, queryStrings));
  }, [dispatch, oid, initialValues]);

  const { jarjestajat, loading, sortedFilters }: JarjestajaData = useSelector(
    selectJarjestajat
  ) as any; // JS tiedostosta päättely ei oikein toimi
  const [checkedValues, setCheckedValues] = useState<
    Record<string, Array<string> | boolean>
  >(initialValues);

  const usedValues = useMemo(
    () =>
      _fp.flow(
        _fp.keys,
        _fp.map((key) => [
          key,
          sortValues(getFilterWithChecked(sortedFilters, checkedValues, key)),
        ]),
        _fp.fromPairs
      )(sortedFilters),
    [sortedFilters, checkedValues]
  );
  const someSelected = _fp.some(
    (v) => (_fp.isArray(v) ? v.length > 0 : v),
    checkedValues
  );

  const handleFilterChange = (value: FilterValue) => {
    const { filterId } = value;
    let newCheckedValues: typeof checkedValues;

    // Käsitellään boolean-filter erikseen
    if (filterId === FILTER_TYPES.HAKUKAYNNISSA) {
      const filter = checkedValues[filterId] as boolean;
      newCheckedValues = { ...checkedValues, [filterId]: !filter };
    } else {
      const newFilter = getFilterStateChanges(usedValues[filterId])(value);
      newCheckedValues = { ...checkedValues, ...newFilter };
    }

    setCheckedValues(newCheckedValues);
    const queryStrings = getQueryStr(newCheckedValues);
    dispatch(fetchKoulutusJarjestajat(oid, queryStrings));
  };

  const handleFiltersClear = useCallback(() => {
    const usedFilters = _fp.mapValues(
      (v) => (_fp.isArray(v) ? [] : false),
      checkedValues
    );
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
          item
          direction="row"
          justify="center"
          spacing={2}
          className={classes.filtersContainer}
          sm={10}>
          <Grid item className={classes.filter} sm={4}>
            <OpetuskieliSuodatin
              handleFilterChange={handleFilterChange}
              values={usedValues.opetuskieli}
            />
          </Grid>
          <Grid item className={classes.filter} sm={4}>
            <SijaintiSuodatin
              loading={loading}
              handleFilterChange={handleFilterChange}
              maakuntaValues={usedValues.maakunta}
              kuntaValues={usedValues.kunta}
            />
          </Grid>
          <Grid item className={classes.filter} sm={4}>
            <PohjakoulutusvaatimusSuodatin
              handleFilterChange={handleFilterChange}
              values={usedValues.pohjakoulutusvaatimus}
            />
          </Grid>
          {usedValues.hakukaynnissa && usedValues.hakutapa && (
            <Grid item className={classes.filter} sm={4}>
              <HakutapaSuodatin
                handleFilterChange={handleFilterChange}
                values={[...usedValues.hakukaynnissa, ...usedValues.hakutapa]}
              />
            </Grid>
          )}
          <Grid item className={classes.filter} sm={4}>
            <ValintatapaSuodatin
              handleFilterChange={handleFilterChange}
              values={usedValues.valintatapa}
            />
          </Grid>
          <Grid item className={classes.filter} sm={4}>
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
