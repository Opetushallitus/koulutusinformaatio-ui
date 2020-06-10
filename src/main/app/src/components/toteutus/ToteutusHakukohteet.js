import React from 'react';
import { Box, Typography, Grid, Paper, Button, makeStyles } from '@material-ui/core';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import CalendarTodayOutlinedIcon from '@material-ui/icons/CalendarTodayOutlined';
import Spacer from '#/src/components/common/Spacer';
import { format } from 'date-fns';
import { Localizer as l } from '#/src/tools/Utils';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles((theme) => ({
  gridHeading: {
    ...theme.typography.body1,
    fontWeight: '700',
  },
  hakuName: {
    ...theme.typography.h5,
    fontWeight: 700,
    color: '#1D1D1D',
  },
}));

const HakuCardGrid = (props) => {
  const classes = useStyles();
  const { type, haut, icon } = props;
  const { t } = useTranslation();
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
          {props.haut.map((haku, i) => (
            <Grid
              key={i}
              item
              xs={12}
              lg={6}
              style={{ maxWidth: '624px', height: '390px' }}>
              <Paper
                style={{
                  width: '100%',
                  height: '100%',
                  borderTop: `5px solid #43A047`,
                }}>
                <Box m={4} display="flex" direction="column">
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
                      <Grid container direction="row">
                        <Grid item xs={6}>
                          <Grid container direction="column">
                            <Grid item>
                              <Typography className={classes.gridHeading} noWrap>
                                {t('toteutus.haku-alkaa') + ':'}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant="body1" noWrap>
                                {format(new Date(haku.hakuajat[0].alkaa), 'd.M.y H:mm')}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={6}>
                          <Grid container direction="column">
                            <Grid item>
                              <Typography className={classes.gridHeading} noWrap>
                                {t('toteutus.haku-paattyy') + ':'}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Typography variant="body1" noWrap>
                                {format(new Date(haku.hakuajat[0].paattyy), 'd.M.y H:mm')}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Grid container direction="row">
                        <Grid item xs={6}>
                          <Grid container direction="column">
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
                        </Grid>
                        <Grid item xs={6}>
                          <Grid container direction="column">
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
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Button variant="contained" size="large" color="primary" disabled>
                        <Typography style={{ color: '#FFFFFF' }} variant="body1">
                          {t('toteutus.tayta-lomake')}
                        </Typography>
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
          ))}
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
      style={{ width: '80%' }}>
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
