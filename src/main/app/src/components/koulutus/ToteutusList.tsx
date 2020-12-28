import { Container, Grid, makeStyles, Typography } from '@material-ui/core';
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
import { getSuodatinValinnatProps } from '#/src/store/reducers/hakutulosSliceSelector';
import { CheckedFilter } from '../hakutulos/hakutulosSuodattimet/SuodatinTypes';

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
    minWidth: '300px',
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
  sortedFilters: any;
};

const getQueryStr = (values: Array<{ id: string }>) =>
  values.map(({ id }) => id).join(',');

export const ToteutusList = ({ oid }: Props) => {
  const classes = useStyles();
  const { jarjestajat, loading, sortedFilters }: JarjestajaData = useSelector(
    selectJarjestajat
  );
  const valinnatFromHaku = useSelector(getSuodatinValinnatProps);
  const initialValues: Record<string, CheckedFilter[]> = useMemo(
    () =>
      _fp.pick([
        'opetuskieli',
        // TODO: Uncomment these when proper filter components are implemented
        // 'koulutustyyppi',
        // 'koulutusala',
        // 'sijainti',
        // 'opetustapa',
      ])(valinnatFromHaku) as any,
    [valinnatFromHaku]
  );
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const getLocalizedMaksullisuus = (isMaksullinen: boolean, maksuAmount: number) =>
    isMaksullinen ? `${maksuAmount} €` : t('toteutus.maksuton');

  const [chosenFilters, setChosenFilters] = useState(initialValues);
  const handleFilterChange = useCallback(
    (newChosenFilters: object) => {
      const usedFilters = { ...chosenFilters, ...newChosenFilters };
      setChosenFilters(usedFilters);
      const queryStrings = _fp.mapValues(getQueryStr, usedFilters);
      dispatch(fetchKoulutusJarjestajat(oid, queryStrings));
    },
    [dispatch, oid, chosenFilters]
  );

  // NOTE: Initial fetch with params from Haku
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
      <Grid
        container
        direction="row"
        justify="center"
        spacing={2}
        className={classes.filtersContainer}>
        <Grid item className={classes.filter}>
          <OpetuskieliSuodatin
            handleFilterChange={handleFilterChange}
            sortedValues={sortedFilters.opetuskieli}
          />
        </Grid>
      </Grid>
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
