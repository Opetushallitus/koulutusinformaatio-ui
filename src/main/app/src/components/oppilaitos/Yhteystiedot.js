import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Grid, makeStyles, Typography, Box } from '@material-ui/core';
import OskariKartta from '#/src/components/common/OskariKartta';
import _ from 'lodash';
import { Parser as p, Localizer as l } from '#/src/tools/Utils';
import DefaultHeroImage from '#/src/assets/images/herokuva_default.png';
import { colors } from '#/src/colors';
import Spacer from '#/src/components/common/Spacer';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 20,
  },
  koulutusInfoGridIcon: {
    color: theme.palette.primary.main,
  },
  info: {
    width: 230,
  },
  logoImage: {
    maxWidth: '100%',
    marginBottom: 10,
  },
  oskariMap: {
    height: 350,
    width: '100%',
    maxWidth: 625,
  },
  text: {
    color: colors.black,
    fontWeight: 600,
  },
  button: {
    marginTop: 20,
    fontWeight: 600,
  },
}));

const Yhteystiedot = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { className, heading, logo, metadata, nimi } = props;
  const osoite = _.get(metadata, 'yhteystiedot.osoite.osoite.fi', '');
  const postinumero = p.koodiUriToPostinumero(
    _.get(metadata, 'yhteystiedot.osoite.postinumero.koodiUri', '')
  );
  const postitoimipaikka = _.capitalize(
    _.get(metadata, 'yhteystiedot.osoite.postinumero.nimi.fi', '')
  );

  const yhteysTiedot = () => {
    if (!osoite && !postinumero && !postitoimipaikka) {
      return t('oppilaitos.ei-yhteystietoja');
    }
    if (osoite) return _.trim(`${osoite}, ${postinumero} ${postitoimipaikka}`, ', ');
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      className={className}>
      <Typography variant="h2">{heading}</Typography>
      <Spacer />

      <Grid
        className={classes.container}
        container
        spacing={5}
        alignItems="center"
        justify="center">
        <Grid item container justify="center" lg md sm xs>
          <Box className={classes.info} component="div">
            <img
              className={classes.logoImage}
              src={logo || DefaultHeroImage}
              alt="Oppilaitoksen logo"
            />
            <Typography className={classes.text} component="div" variant="body1">
              {nimi}
            </Typography>
            <Typography component="div" variant="body1">
              {yhteysTiedot()}
            </Typography>
            <Button
              className={classes.button}
              target="_blank"
              href={l.localize(_.get(metadata, 'yhteystiedot.wwwSivu', ''))}
              fullWidth
              variant="contained"
              size="medium"
              color="primary">
              {t('oppilaitos.oppilaitoksen-www-sivut')}
            </Button>
          </Box>
        </Grid>
        <Grid item container justify="center" lg={6} md={7} sm={8} xs={12}>
          <Box component="div" className={classes.oskariMap}>
            <OskariKartta osoite={osoite} postitoimipaikka={postitoimipaikka} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Yhteystiedot;
