import { colors } from '#/src/colors';
import { AccordionText } from '#/src/components/common/AccordionText';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import Spacer from '#/src/components/common/Spacer';
import { selectMuuHaku } from '#/src/store/reducers/toteutusSlice';
import { Localizer as l } from '#/src/tools/Utils';
import { Box, Button, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import PublicIcon from '@material-ui/icons/Public';
import { format } from 'date-fns';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';
import { useOppilaitosOsoite } from '#/src/tools/UseOppilaitosOsoiteHook';

const useStyles = makeStyles((theme) => ({
  hakuName: {
    ...theme.typography.h5,
    fontWeight: 'bold',
    color: colors.black,
  },
  valueText: {
    fontWeight: 'bold',
  },
}));

function getTarjoajaYhteystiedot(osoitteet, tarjoajat) {
  return osoitteet.map((osoite) => {
    const tarjoajaNimi = tarjoajat.find(
      (tarjoaja) => tarjoaja.oid === osoite.oppilaitosOid
    )?.nimi;
    return `${l.localize(tarjoajaNimi)} · ${osoite.yhteystiedot}`;
  });
}

export const ToteutusHakuMuu = ({ oid }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const muuHaku = useSelector(selectMuuHaku(oid), shallowEqual);

  const oppilaitosOids = muuHaku.tarjoajat.map((tarjoaja) => tarjoaja.oid);
  const osoitteet = useOppilaitosOsoite(oppilaitosOids);
  const yhteystiedot = getTarjoajaYhteystiedot(osoitteet, muuHaku.tarjoajat);

  return (
    <Box
      id="haut"
      mt={7}
      style={{ width: '100%' }}
      display="flex"
      flexDirection="column"
      alignItems="center">
      <Typography variant="h2">{t('toteutus.ilmoittaudu-koulutukseen')}</Typography>
      <Spacer />
      <Grid
        container
        item
        alignContent="center"
        justify="center"
        alignItems="center"
        xs={12}
        style={{ maxWidth: '800px' }}>
        {!yhteystiedot ? (
          <LoadingCircle />
        ) : (
          <Paper style={{ padding: '30px', width: '100%' }}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Typography className={classes.hakuName}>
                  {l.localize(muuHaku.nimi)}
                </Typography>
              </Grid>
              <Grid item container direction="row">
                <Grid item xs md={4}>
                  <Typography noWrap variant="body1">
                    {t('koulutus.hakuaika') + ':'}
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography variant="body1" noWrap className={classes.valueText}>
                    {[muuHaku.hakuaika?.alkaa, muuHaku.hakuaika?.paattyy]
                      .map((v) => format(new Date(v), 'd.M.y'))
                      .join(' - ')}
                  </Typography>
                </Grid>
              </Grid>
              {muuHaku.aloituspaikat && (
                <Grid item container direction="row">
                  <Grid item xs md={4}>
                    <Typography noWrap variant="body1">
                      {t('toteutus.opiskelupaikkoja') + ':'}
                    </Typography>
                  </Grid>
                  <Grid item xs>
                    <Typography variant="body1" noWrap className={classes.valueText}>
                      {muuHaku.aloituspaikat}
                    </Typography>
                  </Grid>
                </Grid>
              )}
              {yhteystiedot?.map((osoite, index) => (
                <Grid key={index} container item direction="row">
                  <PublicIcon style={{ marginRight: '10px' }} />
                  <Typography variant="body1">{osoite}</Typography>
                </Grid>
              ))}
              {muuHaku.lisatietoaHakeutumisesta && (
                <Grid item>
                  <AccordionText
                    title={t('toteutus.lisatietoa-ilmoittautumisesta')}
                    text={l.localize(muuHaku.lisatietoaHakeutumisesta)}
                  />
                </Grid>
              )}
              {muuHaku.lisatietoaValintaperusteista && (
                <Grid item>
                  <AccordionText
                    title={t('toteutus.lisatietoa-valintaperusteista')}
                    text={l.localize(muuHaku.lisatietoaValintaperusteista)}
                  />
                </Grid>
              )}
              {/* TODO: insert SORA-kuvaus here when it can be fetched from backend
                <Grid item>
                <AccordionText
                title={'toteutus.hakijan-terveydentila-ja-toimintakyky'}
                text="TODO"
                />
                </Grid>
              )} */}
              <Grid item>
                <Button
                  variant="contained"
                  size="large"
                  color="primary"
                  target="_blank"
                  href={l.localize(muuHaku.hakulomakeLinkki)}
                  disabled={!muuHaku.isHakuAuki}>
                  <Typography style={{ color: colors.white }} variant="body1">
                    {t('toteutus.ilmoittaudu-koulutukseen')}
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Grid>
    </Box>
  );
};
