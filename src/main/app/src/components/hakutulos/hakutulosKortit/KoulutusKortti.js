import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import '../../../assets/styles/components/_hakutulos-box.scss';
import { Grid, Paper, Typography, ButtonBase } from '@material-ui/core';
import { SchoolOutlined, TimelapseOutlined } from '@material-ui/icons';
import { styles } from '../../../styles';
import { fontWeight } from '@material-ui/system';
import hakuKoulutukseen_img from '../../../assets/images/haku-koulutukseen.jpg';

const KoulutusKortti = props => {
  const {
    classes,
    nimi,
    kuvaus,
    opintojenlaajuus,
    opintojenlaajuusyksikko,
    tutkintonimikkeet
  } = props;

  console.log(props);

  const tutkintonimikkeetStr = tutkintonimikkeet
    .reduce((acc, current) => {
      return acc + current.nimi.fi + ', ';
    }, '')
    .replace(/,\s*$/, '');

  const opintojenlaajuusStr = opintojenlaajuus && opintojenlaajuus.nimi && opintojenlaajuus.nimi.fi;
  const opintojenlaajuusyksikkoStr = opintojenlaajuusyksikkoStr || 'opintopistettä';
  const kuvausStr = kuvaus => {
    const kuvausStr = kuvaus && kuvaus.fi;

    if (!kuvausStr) {
      return 'Ei kuvausta';
    }
    if (kuvausStr.length > 255) {
      return `${kuvausStr.slice(0,250)}...`;
    }
    return kuvausStr;
  };

  console.log(tutkintonimikkeetStr);

  //   console.log(result);
  return (
    <Paper className={classes.hakutulosKortti}>
      <Grid container spacing={4}>
        <Grid container item xs={8} spacing={3} direction="column">
          <Grid item>
            <Typography variant="h6" style={{ fontWeight: 'bold' }}>
              {nimi.fi || ''}
            </Typography>
          </Grid>
          <Grid item>
            {/* <Typography className={classes.koulutusKorttiKuvaus}>{kuvaus.fi}</Typography> */}
            <Typography>{kuvausStr(kuvaus)}</Typography>
          </Grid>

          <Grid item container direction="row">
            <Grid item container xs={6}>
              <Grid item xs={1}>
                <SchoolOutlined />
              </Grid>
              <Grid item xs={11}>
                <Typography className={classes.koulutusKorttiLeftMargin}>
                  {tutkintonimikkeetStr}
                </Typography>
              </Grid>
            </Grid>
            <Grid item container xs={6}>
              <Grid item xs={1}>
                <TimelapseOutlined />
              </Grid>
              <Grid item xs={11}>
                <Typography
                  className={classes.koulutusKorttiLeftMargin}
                >{`${opintojenlaajuusStr} ${opintojenlaajuusyksikkoStr}`}</Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container xs={4} justify="center">
          <ButtonBase className={classes.koulutusKorttiImgBtn}>
            <img
              className={classes.koulutusKorttiImg}
              src={hakuKoulutukseen_img}
              alt="haku koulutukseen"
            />
          </ButtonBase>
        </Grid>
      </Grid>
    </Paper>
    // <div key={props.oid} className={`col-12 col-md-12 ${props.oppilaitos ? "col-lg-12": "col-lg-6"} box-container`}>
    //     <div className={`col-12 search-box ${props.tyyppi}`}>
    //         {props.haettavissa && <div className="haku">{props.t("haku.haku")}</div>}
    //         <div className="d-flex justify-content-between">
    //             <div className="text">
    //                 <Link to={props.link} className={"hakutulosbox-link"}>{props.nimi}</Link>
    //                 <p>{props.text1}<br/>{props.text2}</p>
    //             </div>
    //         </div>
    //     </div>
    // </div>
  );
};

const KoulutusKorttiWithStylesRouterTranslation = withTranslation()(
  withRouter(withStyles(styles)(KoulutusKortti))
);

export default KoulutusKorttiWithStylesRouterTranslation;
