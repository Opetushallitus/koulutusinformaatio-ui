import React from 'react';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Hidden,
  Grid,
  makeStyles,
  Paper,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { SchoolOutlined, PublicOutlined } from '@material-ui/icons';
import oppilaitos_img from '../../../assets/images/logo-oppilaitos.png';
import { educationTypeColorCode } from '../../../colors';
import { MUI_BREAKPOINTS } from '../../../constants';
import _ from 'lodash';

const useStyles = makeStyles((theme) => ({
  hakuTulosKorttiPaperRoot: {
    width: '100%',
    marginBottom: theme.spacing(1.5),
    boxShadow: '0 0 8px 0 rgba(0,0,0,0.2)',
    padding: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  },
  oppilaitosLogoAvatar: {
    borderRadius: 0,
    [theme.breakpoints.up('lg')]: {
      width: 150,
      height: 150,
    },
    [theme.breakpoints.up('sm')]: {
      width: 125,
      height: 125,
    },
    [theme.breakpoints.down('xs')]: {
      width: theme.spacing(9),
      height: theme.spacing(9),
    },
  },
  koulutusKorttiLeftMargin: {
    marginLeft: theme.spacing(1),
  },
}));

const OppilaitosKortti = ({ nimi, oppilaitos }) => {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const muiScreenSizeMinLg = useMediaQuery(MUI_BREAKPOINTS.MIN_LG);
  const screenSizeMinCustomXs = useMediaQuery(MUI_BREAKPOINTS.MIN_XS_400);

  const paikkakunnatStr = oppilaitos.paikkakunnat
    .reduce((acc, current) => {
      return acc + current.nimi.fi + ', ';
    }, '')
    .replace(/,\s*$/, '');

  const kuvausStr = (kuvaus) => {
    const kuvausStr = kuvaus && kuvaus.fi;

    if (!kuvausStr) {
      return t('haku.ei_kuvausta');
    }
    const strippedHTMLKuvausStr = kuvausStr.replace(/<[^>]*>/gm, '');

    if (strippedHTMLKuvausStr.length > 255) {
      return `${strippedHTMLKuvausStr.slice(0, 250)}...`;
    }
    return strippedHTMLKuvausStr;
  };
  const koulutusOhjelmatStr = () => {
    const amount = _.get(oppilaitos, 'koulutusohjelmia', 0);
    if (amount === 0) return t('haku.ei_koulutusohjelmia');
    if (amount === 1) return `${amount} ${t('haku.koulutusohjelma')}`;
    return `${amount} ${t('haku.koulutusohjelmaa')}`;
  };

  return (
    <Paper
      classes={{ root: classes.hakuTulosKorttiPaperRoot }}
      style={{ borderTop: `5px solid ${educationTypeColorCode.amm}` }}>
      <Grid
        container
        alignItems="center"
        spacing={3}
        style={{ minHeight: 180 }}>
        <Grid
          container
          item
          lg={8}
          md={12}
          sm
          xs={12}
          spacing={muiScreenSizeMinLg ? 3 : 0}
          direction="column">
          <Grid
            item
            container
            direction="row"
            wrap={screenSizeMinCustomXs ? 'nowrap' : 'wrap-reverse'}
            justify="space-between"
            spacing={2}
            alignItems="center">
            <Grid item sm={12} xs={screenSizeMinCustomXs ? 10 : 12}>
              <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                {nimi?.[i18n.language]}
              </Typography>
            </Grid>
            <Hidden smUp>
              <Grid item xs>
                <Avatar
                  className={classes.oppilaitosLogoAvatar}
                  src={oppilaitos_img}
                  alt="oppilaitoksen logo"
                />
              </Grid>
            </Hidden>
          </Grid>

          <Hidden xsDown>
            <Grid
              item
              container
              spacing={2}
              alignItems="center"
              direction="row"
              wrap="nowrap"
              justify="space-between">
              <Grid item lg={12} md={9} sm={9} xs={12}>
                <Typography>{kuvausStr(oppilaitos.kuvaus)}</Typography>
              </Grid>
              <Hidden lgUp xsDown>
                <Grid
                  item
                  container
                  md
                  sm
                  alignItems="flex-end"
                  justify="flex-end"
                  alignContent="flex-end">
                  <Avatar
                    className={classes.oppilaitosLogoAvatar}
                    src={oppilaitos_img}
                    alt="oppilaitoksen logo"
                  />
                </Grid>
              </Hidden>
            </Grid>
          </Hidden>

          <Grid
            item
            container
            direction="row"
            style={{ marginTop: screenSizeMinCustomXs ? 0 : 15 }}>
            <Grid item container md={6} sm={6} xs={12}>
              <Grid item xs={1}>
                <SchoolOutlined />
              </Grid>
              <Grid item xs={11}>
                <Typography className={classes.koulutusKorttiLeftMargin}>
                  {koulutusOhjelmatStr()}
                </Typography>
              </Grid>
            </Grid>
            <Grid item container md sm xs>
              <Grid item xs={1}>
                <PublicOutlined />
              </Grid>
              <Grid item xs={11}>
                <Typography className={classes.koulutusKorttiLeftMargin}>
                  {paikkakunnatStr}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Hidden mdDown>
          <Grid item container lg={4} justify="center">
            <Avatar
              className={classes.oppilaitosLogoAvatar}
              src={oppilaitos_img}
              alt="oppilaitoksen logo"
            />
          </Grid>
        </Hidden>
      </Grid>
    </Paper>
  );
};

export default withRouter(OppilaitosKortti);
