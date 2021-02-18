import React from 'react';

import { Box, Button, Grid, makeStyles, Typography } from '@material-ui/core';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import DefaultHeroImage from '#/src/assets/images/herokuva_default.png';
import { colors } from '#/src/colors';
import OskariKartta from '#/src/components/common/OskariKartta';
import Spacer from '#/src/components/common/Spacer';
import { koodiUriToPostinumero, Localizer as l } from '#/src/tools/Utils';
import { Yhteystiedot as YhteystiedotType } from '#/src/types/common';

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

type Props = {
  className: string;
  heading: string;
  logo: string;
  yhteystiedot: YhteystiedotType;
  nimi: string;
};

export const Yhteystiedot = ({ className, heading, logo, yhteystiedot, nimi }: Props) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const osoite = l.localize(yhteystiedot?.osoite?.osoite);
  const postinumero = koodiUriToPostinumero(yhteystiedot?.osoite?.postinumero?.koodiUri);
  const postitoimipaikka = _.capitalize(l.localize(yhteystiedot?.osoite?.postinumero));

  const shownYhteystiedot =
    !osoite && !postinumero && !postitoimipaikka
      ? t('oppilaitos.ei-yhteystietoja')
      : _.trim(`${osoite}, ${postinumero} ${postitoimipaikka}`, ', ');

  const homePage = yhteystiedot?.wwwSivu;

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
              alt={t('oppilaitos.oppilaitoksen-logo')}
            />
            <Typography className={classes.text} component="div" variant="body1">
              {nimi}
            </Typography>
            <Typography component="div" variant="body1">
              {shownYhteystiedot}
            </Typography>
            {homePage && (
              <Button
                className={classes.button}
                target="_blank"
                href={l.localize(homePage)}
                fullWidth
                variant="contained"
                size="medium"
                color="primary">
                {t('oppilaitos.oppilaitoksen-www-sivut')}
              </Button>
            )}
          </Box>
        </Grid>
        {osoite && postitoimipaikka && (
          <Grid item container justify="center" lg={6} md={7} sm={8} xs={12}>
            <Box component="div" className={classes.oskariMap}>
              <OskariKartta osoite={osoite} postitoimipaikka={postitoimipaikka} />
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
