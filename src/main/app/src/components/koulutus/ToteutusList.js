import React from 'react';
import { Typography, Grid, Container, makeStyles } from '@material-ui/core';
import Spacer from '../common/Spacer';
import { useTranslation } from 'react-i18next';
import { Localizer as l } from '../../tools/Utils';
import ToteutusCard from './ToteutusCard';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '100px',
  },
});

const ToteutusList = (props) => {
  const classes = useStyles();
  const { toteutukset } = props;
  const { t } = useTranslation();
  const localizeArrayToString = (toLocalizeArray) => {
    return toLocalizeArray
      .map((item) => l.localize(item.nimi))
      .sort()
      .join(', ');
  };

  const getLocalizedMaksullisuus = (isMaksullinen, maksuAmount) =>
    isMaksullinen ? `${maksuAmount} €` : t('toteutus.maksuton');

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Typography variant="h2">{t('koulutus.tarjonta')}</Typography>
      <Spacer />
      {toteutukset?.length > 0 ? (
        <Grid container direction="column" spacing={1}>
          {toteutukset.map((toteutus, i) => (
            <Grid item key={i}>
              <ToteutusCard
                tarjoajaName={l.localize(toteutus.nimi)}
                ammattinimikkeet={localizeArrayToString(
                  toteutus.tutkintonimikkeet
                )}
                description={l.localize(toteutus.kuvaus)}
                locations={localizeArrayToString(toteutus.kunnat)}
                opetustapa={localizeArrayToString(toteutus.opetusajat)}
                price={getLocalizedMaksullisuus(
                  toteutus.onkoMaksullinen,
                  toteutus.maksunMaara
                )}
                tyyppi={toteutus.koulutustyyppi}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" paragraph>
          {t('koulutus.ei-toteutuksia')}
        </Typography>
      )}
    </Container>
  );
};

export default ToteutusList;