import React from 'react';
import Hakupalkki from './haku/Hakupalkki';
import ReactiveBorder from './ReactiveBorder';
import { withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  makeStyles,
  ThemeProvider,
} from '@material-ui/core';
import { colors } from '../colors';
import Image from '../assets/images/o-EDUCATION-facebook.jpg';
import { theme } from '../theme';

const useStyles = makeStyles((theme) => ({
  callToAction: {
    backgroundImage: `url(${Image})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'block',
  },
  jumpotron: {
    backgroundColor: colors.green,
    marginTop: '145px',
    marginBottom: '65px',
    paddingTop: '48px',
    paddingLeft: '68px',
    paddingRight: '68px',
    paddingBottom: '48px',
  },
  title: {
    color: colors.white,
    fontFamily: 'Open Sans',
    fontSize: '40px',
    fontWeight: 'bold',
    letterSpacing: '-1.5px',
    lineHeight: '48px',
  },
  subheader: {
    color: colors.white,
    fontFamily: 'Open Sans',
    fontSize: '16px',
    lineHeight: '27px',
  },
  content: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

const Jumpotron = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.callToAction}>
        <Grid
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
        >
          <Grid item xs={12} sm={12} md={10} lg={8}>
            <ReactiveBorder>
              <Card className={classes.jumpotron}>
                <CardHeader
                  disableTypography={true}
                  title={
                    <h1 className={classes.title}>{t('jumpotron.otsikko')}</h1>
                  }
                  subheader={
                    <p className={classes.subheader}>
                      {t('jumpotron.esittely')}
                    </p>
                  }
                ></CardHeader>
                <CardContent className={classes.content}>
                  <Hakupalkki />
                </CardContent>
              </Card>
            </ReactiveBorder>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
};

export default withRouter(Jumpotron);
