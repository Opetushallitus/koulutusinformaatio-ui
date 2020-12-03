import React from 'react';
import { Typography, Grid, Container, makeStyles } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import Spacer from '#/src/components/common/Spacer';
import { useTranslation } from 'react-i18next';
import { Localizer as l } from '#/src/tools/Utils';
import { ToteutusCard } from '#/src/components/common/ToteutusCard';
import LocalizedLink from '#/src/components/common/LocalizedLink';

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

const localizeArrayToString = (toLocalizeArray) =>
  toLocalizeArray
    ?.map((item) => l.localize(item.nimi))
    .sort()
    .join(', ');

const ToteutusList = (props) => {
  const classes = useStyles();
  const { toteutukset } = props;
  const { t } = useTranslation();

  const getLocalizedMaksullisuus = (isMaksullinen, maksuAmount) =>
    isMaksullinen ? `${maksuAmount} €` : t('toteutus.maksuton');

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Typography variant="h2">{t('koulutus.tarjonta')}</Typography>
      <Spacer />
      {toteutukset?.length > 0 ? (
        <Grid
          container
          direction="column"
          justify="center"
          className={classes.grid}
          alignItems="stretch"
          spacing={1}>
          {toteutukset.map((toteutus, i) => (
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
          {t('koulutus.ei-toteutuksia')}
        </Typography>
      )}
    </Container>
  );
};

export default ToteutusList;
