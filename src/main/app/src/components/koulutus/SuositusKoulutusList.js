import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Grid, Container, Link, makeStyles } from '@material-ui/core';
import Spacer from '#/src/components/common/Spacer';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { Localizer as l } from '#/src/tools/Utils';
import SuositusKoulutusCard from './SuositusKoulutusCard';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '100px',
  },
});

const SuositusKoulutusList = ({ koulutukset, oid }) => {
  const classes = useStyles();
  const { t } = useTranslation();

  function getCardWidth() {
    switch (koulutukset?.hits?.length) {
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
      <Typography variant="h2">{t('koulutus.sinua-saattaa-kiinnostaa-myos')}</Typography>
      <Spacer />
      {koulutukset?.hits?.length > 0 ? (
        <Grid
          container
          direction="row"
          wrap="nowrap"
          alignContent="stretch"
          alignItems="stretch"
          spacing={1}>
          {_.map(koulutukset?.hits, (kts) => {
            return (
              <Grid item key={kts?.oid} xs={getCardWidth()}>
                <Link
                  underline="none"
                  component={RouterLink}
                  to={`/koulutus/${kts?.oid}`}>
                  <SuositusKoulutusCard
                    koulutusName={l.localize(kts?.nimi)}
                    tutkintonimikkeet={l.localizeSortedArrayToString(kts?.tutkintonimike)}
                    opintojenlaajuus={l.localize(kts?.opintojenLaajuus)}
                    opintojenLaajuusyksikko={l.localize(kts?.opintojenLaajuusyksikko)}
                    onSuosikki={kts?.onSuosikki}
                    hakuKaynnissa={kts?.hakuKaynnissa}
                    teemakuva={kts?.teemakuva}
                    tyyppi={kts?.koulutustyyppi}
                  />
                </Link>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Typography variant="body1" paragraph>
          {t('koulutus.ei-suositeltuja-koulutuksia')}
        </Typography>
      )}
    </Container>
  );
};

export default SuositusKoulutusList;
