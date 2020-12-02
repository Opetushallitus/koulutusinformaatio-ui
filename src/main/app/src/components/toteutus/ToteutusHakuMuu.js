import { getOppilaitosOsa } from '#/src/api/konfoApi';
import { colors } from '#/src/colors';
import { AccordionText } from '#/src/components/common/AccordionText';
import { LoadingCircle } from '#/src/components/common/LoadingCircle';
import Spacer from '#/src/components/common/Spacer';
import { selectMuuHaku } from '#/src/store/reducers/toteutusSlice';
import { Localizer as l, OsoiteParser } from '#/src/tools/Utils';
import { Box, Button, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import PublicIcon from '@material-ui/icons/Public';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';

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

export const ToteutusHakuMuu = ({ oid }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [osoitteet, setOsoitteet] = useState();
  const muuHaku = useSelector(selectMuuHaku(oid), shallowEqual);

  // TODO: This whole useEffect will be obsolete when toteutus -api provides osoite for tarjoajas
  useEffect(() => {
    if (!osoitteet) {
      (async () => {
        try {
          const oppilaitosDatas = await Promise.all(
            muuHaku.tarjoajat.map((tarjoaja) => getOppilaitosOsa(tarjoaja.oid))
          );
          const osoitteet = oppilaitosDatas.map((data, i) => {
            // NOTE: Prioritize using oppilaitoksenOsa, otherwise the address of main oppilaitos is found inside oppilaitos-property
            const osoiteData = (data?.oppilaitoksenOsa || data?.oppilaitos?.oppilaitos)
              .metadata.yhteystiedot.osoite;
            const { yhteystiedot } = OsoiteParser.parseOsoiteData(osoiteData);
            return `${l.localize(muuHaku.tarjoajat[i].nimi)} · ${yhteystiedot}`;
          });

          setOsoitteet(osoitteet);
        } catch (e) {
          console.error(e);
          setOsoitteet([]);
        }
      })();
    }
  }, [osoitteet, muuHaku]);

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
        {!osoitteet ? (
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
              {osoitteet?.map((osoite, index) => (
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
