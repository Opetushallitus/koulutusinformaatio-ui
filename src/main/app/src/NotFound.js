import Grid from '@material-ui/core/Grid';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { colors } from '#/src/colors';
import { Box, Button, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  component: {
    textAlign: 'center',
    paddingLeft: '10px',
    paddingRight: '10px',
    paddingTop: '132px',
    paddingBottom: '132px',
    fontSize: '16px',
    color: colors.grey,
  },
});

const NotFound = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      className={classes.component}>
      <Grid item xs={12} sm={6} md={6} className={classes.notFound}>
        <Box mt={1}>
          <Typography variant="h1" component="h1" color="secondary">
            {t('ei-loydy.404')}
          </Typography>
        </Box>
        <Box mt={1}>
          <Typography variant="h1" component="h1">
            {t('ei-loydy.sivua-ei-löytynyt')}
          </Typography>
        </Box>
        <Box mt={1}>
          <Typography variant={'body1'} paragraph>
            {t('ei-loydy.linkki-on-virheellinen')}
          </Typography>
        </Box>
        <Button
          variant="contained"
          aria-label={t('ei-loydy.etusivulle')}
          color="primary"
          href={'/konfo'}>
          {t('ei-loydy.etusivulle')}
        </Button>
        <Button
          variant="contained"
          aria-label={t('ei-loydy.takaisin')}
          onClick={() => window.history.back()}>
          {t('ei-loydy.takaisin')}
        </Button>
      </Grid>
    </Grid>
  );
};

export default NotFound;
