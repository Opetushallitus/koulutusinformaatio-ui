import React from 'react';
import { Typography, Grid, Container, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { Localizer as l } from '#/src/tools/Utils';
import Spacer from '#/src/components/common/Spacer';
import ToteutusCard from './ToteutusCard';
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
  const localizeArrayToString = (toLocalizeArray) => {
    return _.map(toLocalizeArray, (el) => l.localize(el.nimi))
      .sort()
      .join(', ');
  };

  const getLocalizedMaksullisuus = (isMaksullinen, maksuAmount) =>
    isMaksullinen ? `${maksuAmount} €` : t('toteutus.maksuton');

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Typography variant="h2">
        {t('oppilaitos.oppilaitoksessa-jarjestettavat-koulutukset')}
      </Typography>
      <Spacer />
      {_.size(_.get(tarjonta, 'hits', [])) > 0 ? (
        <Grid container direction="column" spacing={1}>
          {_.map(_.get(tarjonta, 'hits'), (toteutus, i) => (
            <Grid item key={i}>
              <ToteutusCard
                toteutusName={l.localize(_.get(toteutus, 'nimi'))}
                description={l.localize(_.get(toteutus, 'kuvaus'))}
                locations={localizeArrayToString(_.get(toteutus, 'kunnat'))}
                opetustapa={localizeArrayToString(_.get(toteutus, 'opetusajat'))}
                price={getLocalizedMaksullisuus(
                  _.get(toteutus, 'onkoMaksullinen'),
                  _.get(toteutus, 'maksunMaara')
                )}
                tyyppi={_.get(toteutus, 'koulutustyyppi')}
                kuva={_.get(toteutus, 'kuva')}
              />
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
