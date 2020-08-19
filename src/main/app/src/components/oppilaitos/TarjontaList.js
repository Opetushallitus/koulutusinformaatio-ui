import React from 'react';
import { Typography, Grid, Container, makeStyles, Link } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import Spacer from '#/src/components/common/Spacer';
import ToteutusCard from '#/src/components/common/ToteutusCard';
import TarjontaPagination from './TarjontaPagination';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '100px',
  },
});

const TarjontaList = ({ tarjonta, oid }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Typography variant="h2">
        {t('oppilaitos.oppilaitoksessa-jarjestettavat-koulutukset')}
      </Typography>
      <Spacer />
      {tarjonta?.hasHits ? (
        <Grid container direction="column" spacing={1}>
          {_.map(_.get(tarjonta, 'localizedTarjonta'), (tts, i) => (
            <Grid item key={i}>
              <Link
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
              </Link>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" paragraph>
          {t('oppilaitos.ei-toteutuksia')}
        </Typography>
      )}
      <TarjontaPagination total={_.get(tarjonta, 'total')} oid={oid} />
    </Container>
  );
};

export default TarjontaList;
