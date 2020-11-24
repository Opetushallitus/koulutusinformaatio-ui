import { colors } from '#/src/colors';
import Spacer from '#/src/components/common/Spacer';
import { IconBackground } from '#/src/components/common/IconBackground';
import { selectEiSahkoistaHaku } from '#/src/store/reducers/toteutusSlice';
import { Localizer as l, sanitizedHTMLParser } from '#/src/tools/Utils';
import { Box, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  hakuName: {
    ...theme.typography.h4,
    fontWeight: 'bold',
    color: colors.black,
  },
}));

export const ToteutusHakuEiSahkoista = ({ oid }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const eiSahkoistaData = useSelector(selectEiSahkoistaHaku(oid), shallowEqual);

  return (
    <Box
      mt={7}
      style={{ width: '100%' }}
      display="flex"
      flexDirection="column"
      alignItems="center">
      <Typography variant="h2">{t('toteutus.ilmoittaudu-koulutukseen')}</Typography>
      <Spacer />
      <Grid
        container
        item
        alignContent="center"
        justify="center"
        alignItems="center"
        xs={12}
        style={{ maxWidth: '800px' }}>
        <Paper style={{ padding: '30px', width: '100%' }}>
          <Grid
            container
            direction="column"
            spacing={2}
            alignContent="center"
            justify="center"
            alignItems="center">
            <IconBackground>
              <DescriptionOutlinedIcon style={{ fontSize: 40, color: colors.white }} />
            </IconBackground>
            <Grid item>
              <Typography className={classes.hakuName}>
                {t('toteutus.ei-sahkoista-hakua')}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1" component="div">
                {sanitizedHTMLParser(
                  l.localize(eiSahkoistaData?.lisatietoaHakeutumisesta)
                )}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Box>
  );
};
