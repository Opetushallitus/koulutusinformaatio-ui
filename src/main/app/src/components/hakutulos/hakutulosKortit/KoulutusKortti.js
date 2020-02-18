import React from 'react';
import { withRouter, Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Hidden,
  Grid,
  Link,
  makeStyles,
  Paper,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { SchoolOutlined, TimelapseOutlined } from '@material-ui/icons';
import koulutusPlaceholderImg from '../../../assets/images/Opolkuhts.png';
import { MUI_BREAKPOINTS } from '../../../constants';
import { educationTypeColorCode } from '../../../colors';

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
  koulutusKorttiAvatar: {
    borderRadius: 0,
    [theme.breakpoints.up('md')]: {
      width: '80%',
      height: '80%',
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
      height: '100%',
    },
  },
  koulutusKorttiLeftMargin: {
    marginLeft: theme.spacing(1),
  },
  koulutusKorttiImg: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
    [theme.breakpoints.up('sm')]: {
      objectFit: 'scale-down',
      maxHeight: 155,
    },
  },
}));

const KoulutusKortti = (props) => {
  const {
    nimi,
    kuvaus,
    koulutustyyppi,
    opintojenlaajuus,
    opintojenlaajuusyksikko,
    teemakuva,
    tutkintonimikkeet,
  } = props;
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const muiScreenSizeMinSm = useMediaQuery(MUI_BREAKPOINTS.MIN_SM);
  const tutkintonimikkeetStr = tutkintonimikkeet
    .reduce((acc, current) => {
      return acc + current.nimi.fi + ', ';
    }, '')
    .replace(/,\s*$/, '');
  const opintojenlaajuusStr = opintojenlaajuus?.nimi?.[i18n.language];
  const opintojenlaajuusyksikkoStr =
    opintojenlaajuusyksikko?.nimi?.[i18n.language];
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

  return (
    <Link underline="none" component={RouterLink} to={props.link}>
      <Paper
        classes={{ root: classes.hakuTulosKorttiPaperRoot }}
        style={{
          borderTop: `5px solid ${educationTypeColorCode[koulutustyyppi] ||
            educationTypeColorCode.muu}`,
        }}>
        <Grid
          container
          alignItems="stretch"
          style={{ minHeight: 210 }}
          spacing={3}>
          <Grid
            container
            item
            lg={8}
            md={12}
            sm
            xs={12}
            spacing={2}
            justify="space-between"
            direction="column">
            <Grid item>
              <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                {nimi?.[i18n.language]}
              </Typography>
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
                <Grid item lg={12} md={8} sm={8} xs={12}>
                  <Typography>{kuvausStr(kuvaus)}</Typography>
                </Grid>
                <Hidden lgUp xsDown>
                  <Grid
                    item
                    container
                    md
                    sm
                    xs
                    justify="flex-end"
                    style={{ paddingRight: 0 }}>
                    <Avatar
                      classes={{ root: classes.koulutusKorttiAvatar }}
                      src={teemakuva || koulutusPlaceholderImg}
                      alt="haku koulutukseen"
                    />
                  </Grid>
                </Hidden>
              </Grid>
            </Hidden>

            <Grid
              item
              container
              direction="row"
              spacing={muiScreenSizeMinSm ? 2 : 0}>
              <Grid item container md={6} sm={6} xs={12}>
                <Grid item xs={1}>
                  <SchoolOutlined />
                </Grid>
                <Grid item xs={11}>
                  <Typography className={classes.koulutusKorttiLeftMargin}>
                    {tutkintonimikkeetStr
                      ? tutkintonimikkeetStr
                      : t('haku.ei-tutkintonimiketta')}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container md sm xs>
                <Grid item xs={1}>
                  <TimelapseOutlined />
                </Grid>
                <Grid item xs={11}>
                  <Typography className={classes.koulutusKorttiLeftMargin}>
                    {opintojenlaajuusStr && opintojenlaajuusyksikkoStr
                      ? `${opintojenlaajuusStr} ${opintojenlaajuusyksikkoStr}`
                      : t('haku.ei-opintojenlaajuutta')}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Hidden only={['sm', 'md']}>
            <Grid
              item
              container
              lg={4}
              justify="flex-end"
              alignContent="center">
              <Avatar
                classes={{
                  root: classes.koulutusKorttiAvatar,
                  img: classes.koulutusKorttiImg,
                }}
                src={teemakuva || koulutusPlaceholderImg}
                alt="haku koulutukseen"
              />
            </Grid>
          </Hidden>
        </Grid>
      </Paper>
    </Link>
  );
};

export default withRouter(KoulutusKortti);
