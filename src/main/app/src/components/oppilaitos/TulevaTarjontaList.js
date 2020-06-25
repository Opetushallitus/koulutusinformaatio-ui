import React from 'react';
import { Typography, Grid, Container, makeStyles } from '@material-ui/core';
import Spacer from '#/src/components/common/Spacer';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
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

const TulevaTarjontaList = ({ tulevaTarjonta, oid }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  function getCardWidth() {
    switch (tulevaTarjonta?.hitsSize) {
      case 1:
        return 12;
      case 2:
        return 6;
      default:
        return 4;
    }
  }

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Typography variant="h2">{t('oppilaitos.tulevat-koulutukset')}</Typography>
      <Spacer />
      {tulevaTarjonta?.hitsSize > 0 ? (
        <Grid
          container
          direction="row"
          wrap="nowrap"
          alignContent="stretch"
          alignItems="stretch"
          spacing={1}>
          {_.map(_.get(tulevaTarjonta, 'localizedTulevaTarjonta'), (kts, i) => (
            <Grid item key={i} xs={getCardWidth()}>
              <TulevaKoulutusCard
                koulutusName={kts?.koulutusName}
                tutkintonimikkeet={kts?.tutkintonimikkeet}
                koulutustyypit={kts?.koulutustyypit}
                opintojenlaajuus={kts?.opintojenlaajuus}
                tyyppi={kts?.tyyppi}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" paragraph>
          {t('oppilaitos.ei-toteutuksia')}
        </Typography>
      )}
      <TulevaTarjontaPagination total={_.get(tulevaTarjonta, 'total')} oid={oid} />
    </Container>
  );
};

export default TulevaTarjontaList;