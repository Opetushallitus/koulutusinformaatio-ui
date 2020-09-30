import React from 'react';
import { useParams, Link as RouterLink, Redirect } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { colors } from '../../colors';
import { makeStyles } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import Sivu from './Sivu';
import SivuKooste from './SivuKooste';
import { useStores } from '../../hooks';
import { useTranslation } from 'react-i18next';
import LocalizedLink from '#/src/components/common/LocalizedLink';
import LoadingCircle from '#/src/components/common/LoadingCircle';

const useStyles = makeStyles({
  notFound: {
    textAlign: 'center',
  },
  header1: {
    fontSize: '40px',
    lineHeight: '48px',
    marginTop: '15px',
    marginBottom: '30px',
    fontWeight: '700',
    color: colors.black,
  },
  component: {
    paddingLeft: '10px',
    paddingRight: '10px',
    paddingTop: '32px',
    '&:last-child': {
      paddingBottom: '32px',
    },
    fontSize: '16px',
    lineHeight: '27px',
    color: colors.grey,
  },
});

const NotFound = ({ loading }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  return (
    <Grid
      container
      direction="row"
      justify="center"
      alignItems="center"
      className={classes.component}>
      {loading ? null : (
        <Grid item xs={12} sm={6} md={6} className={classes.notFound}>
          <h1 className={classes.header1}>{t('sisaltohaku.sivua-ei-löytynyt')}</h1>
          <p>{t('sisaltohaku.etsimääsi-ei-löydy')}</p>
          <LocalizedLink component={RouterLink} to={'/'}>
            {t('sisaltohaku.takaisin')}
          </LocalizedLink>
        </Grid>
      )}
    </Grid>
  );
};

const SivuRouter = (props) => {
  const { i18n } = useTranslation();
  const { contentfulStore } = useStores();
  const { id: slug, lng: lngParam } = useParams();
  const { sivu, sivuKooste, loading } = contentfulStore.data;
  const { slugsToIds } = contentfulStore;
  const idInfo = slugsToIds[slug];
  if (lngParam !== i18n.language || loading) return <LoadingCircle />; //This eliminates an infinite loop that would happen if you pressed back button after changing language
  if (idInfo?.language === i18n.language) {
    if (sivu[slug]) {
      return <Sivu id={slug} />;
    } else if (sivuKooste[slug]) {
      return <SivuKooste id={slug} />;
    } else {
      return <NotFound loading={loading} />;
    }
  } else {
    const newSlug = Object.keys(slugsToIds).find(
      (key) =>
        slugsToIds[key].id === idInfo?.id && slugsToIds[key]?.language === i18n.language
    );
    if (newSlug) {
      return <Redirect to={`/${i18n.language}/sivu/${newSlug}`} />;
    } else {
      return <NotFound loading={loading} />;
    }
  }
};

export default observer(SivuRouter);
