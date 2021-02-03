import React from 'react';
import { Typography, Grid, Container, makeStyles } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import Spacer from '#/src/components/common/Spacer';
import { ToteutusCard } from '#/src/components/common/ToteutusCard';
import TarjontaPagination from './TarjontaPagination';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';

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

const TarjontaList = ({ tarjonta, oid, isOppilaitosOsa }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Typography variant="h2">
        {t('oppilaitos.oppilaitoksessa-jarjestettavat-koulutukset')}
      </Typography>
      <Spacer />
      {tarjonta?.hasHits ? (
        <Grid container className={classes.grid} direction="column" spacing={1}>
          {_.map(_.get(tarjonta, 'localizedTarjonta'), (tts, i) => (
            <Grid item key={i}>
              <LocalizedLink
                underline="none"
                component={RouterLink}
                to={`/toteutus/${tts?.toteutusOid}`}>
                <ToteutusCard
                  heading={tts?.toteutusName}
                  description={tts?.description}
                  locations={tts?.locations}
                  opetustapa={tts?.opetustapa}
                  price={tts?.price}
                  tyyppi={tts?.tyyppi}
                  image={tts?.kuva}
                />
              </LocalizedLink>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" paragraph>
          {t('oppilaitos.ei-toteutuksia')}
        </Typography>
      )}
      <TarjontaPagination
        total={_.get(tarjonta, 'total')}
        oid={oid}
        isOppilaitosOsa={isOppilaitosOsa}
      />
    </Container>
  );
};

export default TarjontaList;
