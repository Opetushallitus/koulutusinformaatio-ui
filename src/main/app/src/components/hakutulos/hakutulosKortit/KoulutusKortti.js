import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import '../../../assets/styles/components/_hakutulos-box.scss';
import {
  Avatar,
  Hidden,
  Grid,
  Link,
  Paper,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { SchoolOutlined, TimelapseOutlined } from '@material-ui/icons';
import { styles } from '../../../styles';
import hakuKoulutukseen_img from '../../../assets/images/haku-koulutukseen.jpg';
import { educationTypeColorCode } from '../../../colors';

const KoulutusKortti = (props) => {
  const {
    classes,
    nimi,
    kuvaus,
    koulutustyyppi,
    opintojenlaajuus,
    opintojenlaajuusyksikko,
    tutkintonimikkeet,
    i18n,
    t,
  } = props;
  const xs_600_up = useMediaQuery('(min-width:600px)');
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
    <Link href={props.link} underline="none">
      <Paper
        classes={{ root: classes.hakuTulosKorttiPaperRoot }}
        style={{
          borderTop: `5px solid ${educationTypeColorCode[koulutustyyppi] ||
            educationTypeColorCode.muu}`,
        }}>
        <Grid container alignItems="center" spacing={3}>
          <Grid
            container
            item
            lg={8}
            md={12}
            sm
            xs={12}
            spacing={3}
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
                  <Grid item md sm xs justify="center">
                    <Avatar
                      classes={{ root: classes.koulutusKorttiAvatar }}
                      src={hakuKoulutukseen_img}
                      alt="haku koulutukseen"
                    />
                  </Grid>
                </Hidden>
              </Grid>
            </Hidden>

            <Grid item container direction="row" spacing={xs_600_up ? 2 : 0}>
              <Grid item container md={6} sm={6} xs={12}>
                <Grid item xs={1}>
                  <SchoolOutlined />
                </Grid>
                <Grid item xs={11}>
                  <Typography className={classes.koulutusKorttiLeftMargin}>
                    {tutkintonimikkeetStr}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item container md sm xs>
                <Grid item xs={1}>
                  <TimelapseOutlined />
                </Grid>
                <Grid item xs={11}>
                  <Typography
                    className={
                      classes.koulutusKorttiLeftMargin
                    }>{`${opintojenlaajuusStr} ${opintojenlaajuusyksikkoStr}`}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Hidden only={['sm', 'md']}>
            <Grid item container lg={4} justify="center">
              <Avatar
                classes={{ root: classes.koulutusKorttiAvatar }}
                src={hakuKoulutukseen_img}
                alt="haku koulutukseen"
              />
            </Grid>
          </Hidden>
        </Grid>
      </Paper>
    </Link>
  );
};

const KoulutusKorttiWithStylesRouterTranslation = withTranslation()(
  withRouter(withStyles(styles)(KoulutusKortti))
);

export default KoulutusKorttiWithStylesRouterTranslation;
