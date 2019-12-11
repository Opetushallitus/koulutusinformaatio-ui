import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import '../../../assets/styles/components/_hakutulos-box.scss';
import { Grid, Paper, Typography, ButtonBase } from '@material-ui/core';
import { SchoolOutlined, PublicOutlined } from '@material-ui/icons';
import { styles } from '../../../styles';
import oppilaitos_img from '../../../assets/images/logo-oppilaitos.png';
import { educationTypeColorCode } from '../../../colors';
import _get from 'lodash/get';

const OppilaitosKortti = (props) => {
  const { classes, nimi, i18n, oppilaitos } = props;

  const paikkakunnatStr = oppilaitos.paikkakunnat
    .reduce((acc, current) => {
      return acc + current.nimi[i18n.language] + ', ';
    }, '')
    .replace(/,\s*$/, '');

  const kuvausStr = (kuvaus) => {
    const kuvausStr = kuvaus && kuvaus[i18n.language];

    if (!kuvausStr) {
      return 'Ei kuvausta';
    }
    const strippedHTMLKuvausStr = kuvausStr.replace(/<[^>]*>/gm, '');

    if (strippedHTMLKuvausStr.length > 255) {
      return `${strippedHTMLKuvausStr.slice(0, 250)}...`;
    }
    return strippedHTMLKuvausStr;
  };
  const koulutusOhjelmatStr = () => {
    const amount = _get(oppilaitos, 'koulutusohjelmia', 0);
    if (amount === 0) return 'ei kolutusohjelmia';
    if (amount === 1) return `${amount} koulutusohjelma`;
    return `${amount} koukutusohjelmaa`;
  };

  return (
    <Paper
      className={classes.hakutulosKortti}
      style={{ borderTop: `5px solid ${educationTypeColorCode.amm}` }}
    >
      <Grid container spacing={4}>
        <Grid container item xs={8} spacing={3} direction="column">
          <Grid item>
            <Typography variant="h6" style={{ fontWeight: 'bold' }}>
              {nimi[i18n.language] || 'Ei nimeä'}
            </Typography>
          </Grid>
          <Grid item>
            <Typography>{kuvausStr(oppilaitos.kuvaus)}</Typography>
          </Grid>

          <Grid item container direction="row">
            <Grid item container xs={6}>
              <Grid item xs={1}>
                <SchoolOutlined />
              </Grid>
              <Grid item xs={11}>
                <Typography className={classes.koulutusKorttiLeftMargin}>
                  {koulutusOhjelmatStr()}
                </Typography>
              </Grid>
            </Grid>
            <Grid item container xs={6}>
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
        <Grid item container xs={4} justify="center">
          <ButtonBase className={classes.koulutusKorttiImgBtn}>
            <img
              className={classes.koulutusKorttiImg}
              src={oppilaitos_img}
              alt="haku koulutukseen"
            />
          </ButtonBase>
        </Grid>
      </Grid>
    </Paper>
  );
};

const OppilaitosKorttiWithStylesRouterTranslation = withTranslation()(
  withRouter(withStyles(styles)(OppilaitosKortti))
);

export default OppilaitosKorttiWithStylesRouterTranslation;
