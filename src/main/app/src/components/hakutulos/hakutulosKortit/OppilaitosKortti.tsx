import React from 'react';

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
import { SchoolOutlined, PublicOutlined } from '@material-ui/icons';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import oppilaitos_img from '#/src/assets/images/logo-oppilaitos.png';
import { educationTypeColorCode } from '#/src/colors';
import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import { MUI_BREAKPOINTS } from '#/src/constants';
import { localize } from '#/src/tools/localization';
import { Koodi, Translateable } from '#/src/types/common';

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
    [theme.breakpoints.up('lg')]: {
      width: '150px',
      height: '150px',
    },
    [theme.breakpoints.up('sm')]: {
      width: '125px',
      height: '125px',
    },
    [theme.breakpoints.down('xs')]: {
      width: theme.spacing(9),
      height: theme.spacing(9),
    },
  },
}));

type Props = {
  oppilaitos: {
    koulutusohjelmia: number;
    kuvaus?: Translateable;
    logo?: string;
    oid: string;
    nimi: Translateable;
    paikkakunnat: Array<Koodi>;
  };
};

export const OppilaitosKortti = ({ oppilaitos }: Props) => {
  console.log('oppilaitos', oppilaitos);
  const { t } = useTranslation();
  const classes = useStyles();
  const theme = useTheme();
  const muiScreenSizeMinLg = useMediaQuery(MUI_BREAKPOINTS.MIN_LG);
  const screenSizeMinCustomXs = useMediaQuery(MUI_BREAKPOINTS.MIN_XS_400);

  const paikkakunnatStr = (oppilaitos?.paikkakunnat || []).map(localize).join(', ');

  const kuvaus =
    _.truncate(localize(oppilaitos?.kuvaus).replace(/<[^>]*>/gm, ''), {
      length: 255,
    }) || t('haku.ei_kuvausta');

  const koulutusOhjelmatStr = `${oppilaitos?.koulutusohjelmia || 0} ${t(
    'haku.tutkintoon-johtavaa-koulutusta'
  )}`;
  const logoAltText = `${localize(oppilaitos)} ${t('haku.oppilaitoksen-logo')}`;

  return (
    <LocalizedLink
      underline="none"
      component={RouterLink}
      to={`/oppilaitos/${oppilaitos?.oid}`}>
      <Paper
        classes={{ root: classes.paperRoot }}
        style={{ borderTop: `5px solid ${educationTypeColorCode.amm}` }}>
        <Grid container alignItems="center" spacing={3} style={{ minHeight: '180px' }}>
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
                  {localize(oppilaitos)}
                </Typography>
              </Grid>
              <Hidden smUp>
                <Grid item xs>
                  <Avatar
                    classes={{ root: classes.avatarRoot }}
                    src={oppilaitos?.logo || oppilaitos_img}
                    alt={logoAltText}
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
                  <Typography>{kuvaus}</Typography>
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
                      classes={{ root: classes.avatarRoot }}
                      src={oppilaitos?.logo || oppilaitos_img}
                      alt={logoAltText}
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
                  <Typography style={{ marginLeft: theme.spacing(1) }}>
                    {koulutusOhjelmatStr}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container md sm xs>
                <Grid item xs={1}>
                  <PublicOutlined />
                </Grid>
                <Grid item xs={11}>
                  <Typography style={{ marginLeft: theme.spacing(1) }}>
                    {paikkakunnatStr}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Hidden mdDown>
            <Grid item container lg={4} justify="center">
              <Avatar
                classes={{ root: classes.avatarRoot }}
                src={oppilaitos?.logo || oppilaitos_img}
                alt={logoAltText}
              />
            </Grid>
          </Hidden>
        </Grid>
      </Paper>
    </LocalizedLink>
  );
};
