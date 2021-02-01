import React from 'react';
import { Typography, Grid, Container, makeStyles } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import Spacer from '#/src/components/common/Spacer';
import { ToteutusCard } from '#/src/components/common/ToteutusCard';
import TarjontaPagination from './TarjontaPagination';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import { usePaginatedTarjonta } from './hooks';

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

  const { data: tarjonta = {}, isLoading } = queryResult;

  return !isLoading && tarjonta?.hasHits ? (
    <Container maxWidth="lg" className={classes.container}>
      <Typography variant="h2">
        {t('oppilaitos.oppilaitoksessa-jarjestettavat-koulutukset')}
      </Typography>
      <Spacer />
      <Grid container className={classes.grid} direction="column" spacing={1}>
        {_.map(tarjonta?.values, (toteutus) => (
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
      <TarjontaPagination
        total={_.get(tarjonta, 'total')}
        oid={oid}
        isOppilaitosOsa={isOppilaitosOsa}
      />
    </Container>
  ) : null;
};

export default TarjontaList;
