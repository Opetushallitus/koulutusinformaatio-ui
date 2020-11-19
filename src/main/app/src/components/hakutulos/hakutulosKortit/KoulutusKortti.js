import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Hidden,
  Grid,
  makeStyles,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { SchoolOutlined, TimelapseOutlined } from '@material-ui/icons';
import koulutusPlaceholderImg from '#/src/assets/images/Opolkuhts.png';
import { MUI_BREAKPOINTS } from '#/src/constants';
import { educationTypeColorCode } from '#/src/colors';
import LocalizedLink from '#/src/components/common/LocalizedLink';

const useStyles = makeStyles((theme) => ({
  paperRoot: {
    width: '100%',
    marginBottom: theme.spacing(1.5),
    boxShadow: '0 0 8px 0 rgba(0,0,0,0.2)',
    padding: theme.spacing(3),
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(2),
    },
  },
  avatarRoot: {
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
  avatarImg: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
    position: 'relative',
    zIndex: 0,
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
  const theme = useTheme();
  const classes = useStyles();
  const muiScreenSizeMinSm = useMediaQuery(MUI_BREAKPOINTS.MIN_SM);
  const tutkintonimikkeetStr = tutkintonimikkeet
    .reduce((acc, current) => {
      return acc + current.nimi?.[i18n.language] + ', ';
    }, '')
    .replace(/,\s*$/, '');
  const opintojenlaajuusStr = opintojenlaajuus?.nimi?.[i18n.language];
  const opintojenlaajuusyksikkoStr = opintojenlaajuusyksikko?.nimi?.[i18n.language];
  const kuvausStr = (kuvaus) => {
    const kuvausStr = kuvaus && kuvaus?.[i18n.language];

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
    <LocalizedLink underline="none" component={RouterLink} to={props.link}>
      <Paper
        classes={{ root: classes.paperRoot }}
        style={{
          borderTop: `5px solid ${
            educationTypeColorCode[koulutustyyppi] || educationTypeColorCode.muu
          }`,
        }}>
        <Grid container alignItems="stretch" style={{ minHeight: 210 }} spacing={3}>
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
                      classes={{ root: classes.avatarRoot }}
                      src={teemakuva || koulutusPlaceholderImg}
                      alt={t('haku.haku-koulutukseen')}
                    />
                  </Grid>
                </Hidden>
              </Grid>
            </Hidden>

            <Grid item container direction="row" spacing={muiScreenSizeMinSm ? 2 : 0}>
              <Grid item container md={6} sm={6} xs={12}>
                <Grid item xs={1}>
                  <SchoolOutlined />
                </Grid>
                <Grid item xs={11}>
                  <Typography style={{ marginLeft: theme.spacing(1) }}>
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
                  <Typography style={{ marginLeft: theme.spacing(1) }}>
                    {opintojenlaajuusStr && opintojenlaajuusyksikkoStr
                      ? `${opintojenlaajuusStr} ${opintojenlaajuusyksikkoStr}`
                      : t('haku.ei-opintojenlaajuutta')}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Hidden only={['sm', 'md']}>
            <Grid item container lg={4} justify="flex-end" alignContent="center">
              <Avatar
                classes={{
                  root: classes.avatarRoot,
                  img: classes.avatarImg,
                }}
                src={teemakuva || koulutusPlaceholderImg}
                alt={t('haku.haku-koulutukseen')}
              />
            </Grid>
          </Hidden>
        </Grid>
      </Paper>
    </LocalizedLink>
  );
};

export default KoulutusKortti;
