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
import { SchoolOutlined, TimelapseOutlined, ExtensionOutlined } from '@material-ui/icons';
import _ from 'lodash';
import koulutusPlaceholderImg from '#/src/assets/images/Opolkuhts.png';
import { MUI_BREAKPOINTS } from '#/src/constants';
import { educationTypeColorCode } from '#/src/colors';
import LocalizedLink from '#/src/components/common/LocalizedLink';
import { Localizer as l } from '#/src/tools/Utils';

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
      maxHeight: '155px',
    },
  },
}));

const KoulutusKortti = ({ koulutus }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const muiScreenSizeMinSm = useMediaQuery(MUI_BREAKPOINTS.MIN_SM);

  const kuvaus =
    _.truncate(
      l
        .localize(koulutus?.kuvaus)
        .replace(/<\/li>/gm, ',</li>')
        .replace(/\.,<\/li>/gm, '.</li>')
        .replace(/<[^>]*>/gm, ''),
      { length: 255 }
    ) || t('haku.ei_kuvausta');
  const isOsaamisalaOrTutkinnonOsa = _.includes(
    ['amm-osaamisala', 'amm-tutkinnon-osa'],
    koulutus?.koulutustyyppi
  );
  const tutkintoNimikkeet = isOsaamisalaOrTutkinnonOsa
    ? t(`haku.${koulutus?.koulutustyyppi}`)
    : (koulutus?.tutkintonimikkeet || [])
        .map((nimike) => l.localize(nimike))
        .join(', ')
        .replace(/,\s*$/, '') || t('haku.ei-tutkintonimiketta');
  const colorCode =
    educationTypeColorCode[koulutus?.koulutustyyppi] || educationTypeColorCode.muu;

  function getOpintojenLaajuus() {
    const tutkinnotOsat = koulutus?.tutkinnonOsat || [];
    const opintojenLaajuusNumero =
      koulutus?.opintojenLaajuusNumero ||
      tutkinnotOsat.map((k) => k?.opintojenLaajuusNumero).join(' + ');
    const opintojenLaajuusYksikko =
      l.localize(
        koulutus?.opintojenLaajuusyksikko ||
          _.find(tutkinnotOsat, 'opintojenLaajuusyksikko')?.opintojenLaajuusyksikko
      ) || '';
    const opintojenLaajuus = `${opintojenLaajuusNumero} ${opintojenLaajuusYksikko}`.trim();
    return opintojenLaajuus || t('haku.ei-opintojenlaajuutta');
  }

  return (
    <LocalizedLink
      underline="none"
      component={RouterLink}
      to={`/koulutus/${koulutus?.oid}`}>
      <Paper
        data-cy={koulutus?.oid}
        classes={{ root: classes.paperRoot }}
        style={{ borderTop: `5px solid ${colorCode}` }}>
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
                {l.localize(koulutus)}
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
                  <Typography>{kuvaus}</Typography>
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
                      src={koulutus?.teemakuva || koulutusPlaceholderImg}
                      alt={`${l.localize(koulutus)} ${t(
                        'koulutus.koulutuksen-teemakuva'
                      )}`}
                    />
                  </Grid>
                </Hidden>
              </Grid>
            </Hidden>

            <Grid item container direction="row" spacing={muiScreenSizeMinSm ? 2 : 0}>
              <Grid item container md={6} sm={6} xs={12}>
                <Grid item xs={1}>
                  {isOsaamisalaOrTutkinnonOsa ? (
                    <ExtensionOutlined />
                  ) : (
                    <SchoolOutlined />
                  )}
                </Grid>
                <Grid item xs={11}>
                  <Typography
                    data-cy={`tutkintonimikkeet-${koulutus?.oid}`}
                    style={{ marginLeft: theme.spacing(1) }}>
                    {tutkintoNimikkeet}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container md sm xs>
                <Grid item xs={1}>
                  <TimelapseOutlined />
                </Grid>
                <Grid item xs={11}>
                  <Typography
                    data-cy={`opintojenlaajuus-${koulutus?.oid}`}
                    style={{ marginLeft: theme.spacing(1) }}>
                    {getOpintojenLaajuus()}
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
                src={koulutus?.teemakuva || koulutusPlaceholderImg}
                alt={`${l.localize(koulutus)} ${t('koulutus.koulutuksen-teemakuva')}`}
              />
            </Grid>
          </Hidden>
        </Grid>
      </Paper>
    </LocalizedLink>
  );
};

export default KoulutusKortti;
