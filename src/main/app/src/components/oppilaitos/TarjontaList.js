import React from 'react';
import { Typography, Grid, Container, makeStyles } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Spacer from '#/src/components/common/Spacer';
import { ToteutusCard } from '#/src/components/common/ToteutusCard';
import TarjontaPagination from './TarjontaPagination';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import { usePaginatedTarjonta } from './hooks';
import { LoadingCircle, OverlayLoadingCircle } from '../common/LoadingCircle';

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
});

const TarjontaList = ({ oid, isOppilaitosOsa }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { queryResult } = usePaginatedTarjonta({
    oid,
    isOppilaitosOsa,
    isTuleva: false,
  });

  const { data: tarjonta = {}, status, isFetching } = queryResult;
  const { values, total } = tarjonta;

  switch (status) {
    case 'loading':
      return <LoadingCircle />;
    case 'success':
      return tarjonta.hasHits ? (
        <Container maxWidth="lg" className={classes.container}>
          <Typography variant="h2">
            {t('oppilaitos.oppilaitoksessa-jarjestettavat-koulutukset')}
          </Typography>
          <Spacer />
          <div style={{ position: 'relative' }}>
            <OverlayLoadingCircle isLoading={isFetching} />
            <Grid container className={classes.grid} direction="column" spacing={1}>
              {values?.map((toteutus) => (
                <Grid item key={toteutus?.toteutusOid}>
                  <LocalizedLink
                    underline="none"
                    component={RouterLink}
                    to={`/toteutus/${toteutus?.toteutusOid}`}>
                    <ToteutusCard
                      heading={toteutus?.toteutusName}
                      description={toteutus?.description}
                      locations={toteutus?.locations}
                      opetustapa={toteutus?.opetustapa}
                      price={toteutus?.price}
                      tyyppi={toteutus?.tyyppi}
                      image={toteutus?.kuva}
                    />
                  </LocalizedLink>
                </Grid>
              ))}
            </Grid>
          </div>
          <TarjontaPagination total={total} oid={oid} isOppilaitosOsa={isOppilaitosOsa} />
        </Container>
      ) : null;
    default:
      return null;
  }
};

export default TarjontaList;
