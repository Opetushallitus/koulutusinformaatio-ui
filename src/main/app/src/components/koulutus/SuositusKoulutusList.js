import React from 'react';

import { Container, Grid, makeStyles, Typography } from '@material-ui/core';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import Spacer from '#/src/components/common/Spacer';
import { localize, localizeArrayToCommaSeparated } from '#/src/tools/localization';

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

  return (
    <Container maxWidth="lg" className={classes.container}>
      <Typography variant="h2">{t('koulutus.sinua-saattaa-kiinnostaa-myos')}</Typography>
      <Spacer />
      {koulutukset?.hits?.length > 0 ? (
        <Grid
          container
          direction="row"
          alignContent="stretch"
          alignItems="stretch"
          spacing={1}>
          {_.map(koulutukset?.hits, (kts) => {
            return (
              <Grid item key={kts?.oid} xs={12} sm>
                <LocalizedLink
                  underline="none"
                  component={RouterLink}
                  to={`/koulutus/${kts?.oid}`}>
                  <SuositusKoulutusCard
                    koulutusName={localize(kts?.nimi)}
                    tutkintonimikkeet={localizeArrayToCommaSeparated(
                      kts?.tutkintonimike,
                      { sorted: true }
                    )}
                    opintojenlaajuus={localize(kts?.opintojenLaajuus)}
                    opintojenLaajuusyksikko={localize(kts?.opintojenLaajuusyksikko)}
                    onSuosikki={kts?.onSuosikki}
                    hakuKaynnissa={kts?.hakuKaynnissa}
                    teemakuva={kts?.teemakuva}
                    tyyppi={kts?.koulutustyyppi}
                  />
                </LocalizedLink>
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
