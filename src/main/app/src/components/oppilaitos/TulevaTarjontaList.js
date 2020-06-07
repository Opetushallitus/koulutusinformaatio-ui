import React from 'react';
import { Typography, Grid, Container, makeStyles } from '@material-ui/core';
import Spacer from '#/src/components/common/Spacer';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { Localizer as l } from '#/src/tools/Utils';
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

const TulevaTarjontaList = ({ tarjonta, oid }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const hits = _.get(tarjonta, 'hits');
  const localizeArrayToString = (toLocalizeArray) => {
    return _.map(toLocalizeArray, (el) => l.localize(el.nimi))
      .sort()
      .join(', ');
  };

  function getCardWidth() {
    switch (_.size(hits)) {
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
      {_.size(hits) > 0 ? (
        <Grid
          container
          direction="row"
          wrap="nowrap"
          alignContent="stretch"
          alignItems="stretch"
          spacing={1}>
          {_.map(hits, (toteutus, i) => (
            <Grid item key={i} xs={getCardWidth()}>
              <TulevaKoulutusCard
                koulutusName={l.localize(_.get(toteutus, 'nimi'))}
                tutkintonimikkeet={localizeArrayToString(
                  _.get(toteutus, 'tutkintonimikkeet')
                )}
                koulutustyypit={localizeArrayToString(_.get(toteutus, 'koulutustyypit'))}
                opintojenlaajuus={`${l.localize(
                  _.get(toteutus, 'opintojenLaajuus')
                )} ${l.localize(_.get(toteutus, 'opintojenLaajuusyksikko'))}`}
                tyyppi={_.get(toteutus, 'koulutustyyppi')}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" paragraph>
          {t('oppilaitos.ei-toteutuksia')}
        </Typography>
      )}
      <TulevaTarjontaPagination total={_.get(tarjonta, 'total')} oid={oid} />
    </Container>
  );
};

export default TulevaTarjontaList;
