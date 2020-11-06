import { getOppilaitosOsa } from '#/src/api/konfoApi';
import { colors } from '#/src/colors';
import { Localizer as l, OsoiteParser } from '#/src/tools/Utils';
import { Button, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccordionText } from './AccordionText';
import PublicIcon from '@material-ui/icons/Public';

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

export const ToteutusMuuHaku = ({ muuHaku }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [osoite, setOsoite] = useState();

  // TODO: This whole useEffect will be obsolete when toteutus -api provides osoite
  useEffect(() => {
    if (muuHaku.tarjoajaOid && !osoite) {
      (async () => {
        try {
          const oppilaitosData = await getOppilaitosOsa(muuHaku.tarjoajaOid);
          const osoiteData =
            oppilaitosData?.oppilaitos?.oppilaitos.metadata.yhteystiedot.osoite;
          const { yhteystiedot } = OsoiteParser.parseOsoiteData(osoiteData);
          setOsoite(`${l.localize(muuHaku.tarjoajaNimi)} · ${yhteystiedot}`);
        } catch (e) {
          console.error(e);
        }
      })();
    }
  }, [osoite, setOsoite, muuHaku.tarjoajaOid, muuHaku.tarjoajaNimi]);

  return (
    <Paper style={{ padding: '30px', width: '100%', maxWidth: '899px' }}>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Typography className={classes.hakuName}>{l.localize(muuHaku.nimi)}</Typography>
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
        <Grid container item direction="row">
          <PublicIcon style={{ marginRight: '10px' }} />
          <Typography variant="body1">{osoite}</Typography>
        </Grid>
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
            href={l.localize(muuHaku.hakulomakeLinkki)}
            disabled={!muuHaku.isHakuAuki}>
            <Typography style={{ color: colors.white }} variant="body1">
              {t('toteutus.ilmoittaudu-koulutukseen')}
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};
