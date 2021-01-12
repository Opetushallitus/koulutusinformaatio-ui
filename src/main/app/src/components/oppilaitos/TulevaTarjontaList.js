import Spacer from '#/src/components/common/Spacer';
import { Container, Grid, makeStyles, Typography } from '@material-ui/core';
import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import LocalizedLink from '#/src/components/common/LocalizedLink';
import TulevaKoulutusCard from './TulevaKoulutusCard';
import TulevaTarjontaPagination from './TulevaTarjontaPagination';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '100px',
  },
});

export const TulevaTarjontaList = ({ tulevaTarjonta, oid, isOppilaitosOsa }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Typography variant="h2">{t('oppilaitos.tulevat-koulutukset')}</Typography>
      <Spacer />
      {tulevaTarjonta?.hitsSize > 0 ? (
        <Grid container direction="row" justify="center" alignItems="stretch" spacing={1}>
          {_.map(_.get(tulevaTarjonta, 'localizedTulevaTarjonta'), (kts, i) => (
            <Grid item key={i} xs={12} md={4}>
              <LocalizedLink
                underline="none"
                component={RouterLink}
                to={`/koulutus/${kts?.koulutusOid}`}>
                <TulevaKoulutusCard
                  koulutusName={kts?.koulutusName}
                  tutkintonimikkeet={kts?.tutkintonimikkeet}
                  koulutustyypit={kts?.koulutustyypit}
                  opintojenlaajuus={kts?.opintojenlaajuus}
                  tyyppi={kts?.tyyppi}
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
      <TulevaTarjontaPagination
        total={_.get(tulevaTarjonta, 'total')}
        oid={oid}
        isOppilaitosOsa={isOppilaitosOsa}
      />
    </Container>
  );
};
