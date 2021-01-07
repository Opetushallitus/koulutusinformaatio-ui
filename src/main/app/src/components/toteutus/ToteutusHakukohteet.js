import React from 'react';
import { Box, Typography, Grid, Paper, Button, makeStyles } from '@material-ui/core';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';
import Spacer from '#/src/components/common/Spacer';
import { format } from 'date-fns';
import { Localizer as l } from '#/src/tools/Utils';
import { useTranslation } from 'react-i18next';
import { colors } from '#/src/colors';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import LocalizedLink from '#/src/components/common/LocalizedLink';
import { Link as RouterLink } from 'react-router-dom';
import { HAKULOMAKE_TYYPPI } from '#/src/constants';
import { useOppilaitosOsoite } from '#/src/tools/UseOppilaitosOsoiteHook';

const useStyles = makeStyles((theme) => ({
  gridHeading: {
    ...theme.typography.body1,
    fontWeight: '700',
  },
  hakuName: {
    ...theme.typography.h5,
    fontWeight: '700',
    color: colors.black,
  },
  lomakeButtonGroup: {
    display: 'flex',
    '& > *': {
      marginRight: theme.spacing(1),
    },
  },
}));

const HakuCardGrid = (props) => {
  const classes = useStyles();
  const { type, haut, icon } = props;
  const { t } = useTranslation();

  const oppilaitosOids = haut.map((haku) => haku.jarjestyspaikka?.oid);
  const osoitteet = useOppilaitosOsoite(oppilaitosOids);

  function getJarjestyspaikkaYhteystiedot(jarjestyspaikka, osoitteet) {
    return osoitteet.find((osoite) => osoite.oppilaitosOid === jarjestyspaikka.oid)
      ?.yhteystiedot;
  }

  return (
    <Grid item>
      <Box display="flex" alignItems="center">
        {icon}
        <Box ml={2}>
          <Typography variant="h4">{`${type} ( ${haut.length} )`}</Typography>
        </Box>
      </Box>
      <Box mt={4}>
        <Grid
          container
          spacing={2}
          alignContent="center"
          justify="center"
          alignItems="center">
          {haut.map((haku, i) => {
            const jarjestyspaikkaYhteystiedot = getJarjestyspaikkaYhteystiedot(
              haku.jarjestyspaikka,
              osoitteet
            );

            return (
              <Grid
                key={i}
                item
                xs={12}
                lg={6}
                style={{ maxWidth: '624px', height: '100%' }}>
                <Paper
                  style={{
                    width: '100%',
                    height: '100%',
                    borderTop: `5px solid #43A047`,
                  }}>
                  <Box m={4}>
                    <Grid container direction="column" spacing={3}>
                      <Grid item>
                        <Grid container direction="column" spacing={1}>
                          <Grid item>
                            <Typography className={classes.hakuName}>
                              {l.localize(haku.nimi)}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Typography variant="body1" noWrap>
                              {l.localize(haku.hakulomakeKuvaus)}
                            </Typography>
                          </Grid>
                          {haku.jarjestyspaikka && (
                            <Grid item>
                              <Typography variant="body1">
                                {`${l.localize(
                                  haku.jarjestyspaikka.nimi
                                )} · ${jarjestyspaikkaYhteystiedot}`}
                              </Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                      <Grid item>
                        <div
                          style={{
                            height: '0px',
                            borderTop: '1px solid #B2B2B2',
                          }}
                        />
                      </Grid>
                      <Grid item>
                        <Grid container direction="row" spacing={3}>
                          <Grid item xs={6}>
                            <Grid item>
                              <Typography className={classes.gridHeading} noWrap>
                                {t('toteutus.haku-alkaa:')}
                              </Typography>
                            </Grid>
                            <Grid item>
                              {haku.hakuajat.map((hakuaika, i) => (
                                <Typography key={i} variant="body1" noWrap>
                                  {format(new Date(hakuaika.alkaa), 'd.M.y H:mm')}
                                </Typography>
                              ))}
                            </Grid>
                          </Grid>
                          {haku.hakuajat?.some((hakuaika) => hakuaika.paattyy) && (
                            <Grid item xs={6}>
                              <Grid item>
                                <Typography className={classes.gridHeading} noWrap>
                                  {t('toteutus.haku-paattyy:')}
                                </Typography>
                              </Grid>
                              <Grid item>
                                {haku.hakuajat.map((hakuaika, i) =>
                                  hakuaika.paattyy ? (
                                    <Typography key={i} variant="body1" noWrap>
                                      {format(new Date(hakuaika.paattyy), 'd.M.y H:mm')}
                                    </Typography>
                                  ) : null
                                )}
                              </Grid>
                            </Grid>
                          )}
                          <Grid item xs={6}>
                            <Grid item>
                              <Typography className={classes.gridHeading} noWrap>
                                {t('koulutus.pohjakoulutus') + ':'}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant="body1" noWrap>
                                {haku.pohjakoulutusvaatimus.map((vaatimus) =>
                                  l.localize(vaatimus)
                                )}
                              </Typography>
                            </Grid>
                          </Grid>
                          {haku.aloituspaikat && (
                            <Grid item xs={6}>
                              <Grid item>
                                <Typography className={classes.gridHeading} noWrap>
                                  {t('toteutus.opiskelupaikkoja') + ':'}
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Typography variant="body1" noWrap>
                                  {haku.aloituspaikat}
                                </Typography>
                              </Grid>
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                      <Grid item>
                        <ButtonGroup
                          className={classes.lomakeButtonGroup}
                          orientation="horizontal"
                          color="primary">
                          {haku.hakulomaketyyppi !== HAKULOMAKE_TYYPPI.EI_SAHKOISTA && (
                            <Button
                              variant="contained"
                              size="large"
                              color="primary"
                              target="_blank"
                              href={l.localize(haku.hakulomakeLinkki)}
                              disabled={!haku.isHakuAuki}>
                              <Typography style={{ color: colors.white }} variant="body1">
                                {t('toteutus.tayta-lomake')}
                              </Typography>
                            </Button>
                          )}
                          <LocalizedLink
                            underline="none"
                            component={RouterLink}
                            to={`/hakukohde/${haku.hakukohdeOid}/valintaperuste`}>
                            <Button variant="outlined" size="large" color="primary">
                              <Typography
                                style={{ color: colors.brandGreen }}
                                variant="body1">
                                {t('toteutus.lue-valintaperusteet')}
                              </Typography>
                            </Button>
                          </LocalizedLink>
                        </ButtonGroup>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Grid>
  );
};

const ToteutusHakukohteet = (props) => {
  const { t } = useTranslation();
  const { jatkuvatHaut, erillisHaut, yhteisHaut } = props;
  return (
    <Box
      pt={12}
      display="flex"
      flexDirection="column"
      alignItems="center"
      id="haut"
      style={{ width: '100%' }}>
      <Typography variant="h2">{t('toteutus.koulutuksen-hakukohteet')}</Typography>
      <Spacer />
      <Grid container direction="column" spacing={6}>
        {jatkuvatHaut?.length > 0 ? (
          <HakuCardGrid
            type={t('toteutus.jatkuvahaku')}
            haut={jatkuvatHaut}
            icon={<AutorenewIcon />}
          />
        ) : null}
        {yhteisHaut?.length > 0 ? (
          <HakuCardGrid
            type={t('toteutus.yhteishaku')}
            haut={yhteisHaut}
            icon={<CalendarTodayOutlinedIcon />}
          />
        ) : null}
        {erillisHaut?.length > 0 ? (
          <HakuCardGrid
            type={t('toteutus.erillishaku')}
            haut={erillisHaut}
            icon={<CalendarTodayOutlinedIcon />}
          />
        ) : null}
      </Grid>
    </Box>
  );
};

export default ToteutusHakukohteet;
