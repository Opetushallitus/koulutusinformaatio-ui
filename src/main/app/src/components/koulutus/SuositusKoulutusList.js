import React from 'react';

import { Typography, Grid, Container, makeStyles } from '@material-ui/core';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import Spacer from '#/src/components/common/Spacer';
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
                    koulutusName={l.localize(kts?.nimi)}
                    tutkintonimikkeet={l.localizeSortedArrayToString(kts?.tutkintonimike)}
                    opintojenlaajuus={l.localize(kts?.opintojenLaajuus)}
                    opintojenLaajuusyksikko={l.localize(kts?.opintojenLaajuusyksikko)}
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
