import React from 'react';
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import { colors } from '../../colors';
import { makeStyles } from '@material-ui/core';
import Link from '@material-ui/core/Link';
import { observer } from 'mobx-react-lite';
import Sivu from './Sivu';
import SivuKooste from './SivuKooste';
import { useStores } from '../../hooks';
import { useTranslation } from 'react-i18next';

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

const SivuRouter = observer((props) => {
  const { t } = useTranslation();
  const { contentfulStore } = useStores();
  const pageId = props.match.params.id;
  const classes = useStyles();
  const { sivu, sivuKooste, loading } = contentfulStore.data;
  if (sivu[pageId]) {
    return <Sivu id={pageId} />;
  } else if (sivuKooste[pageId]) {
    return <SivuKooste id={pageId} />;
  } else {
    return (
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        className={classes.component}
      >
        {loading ? null : (
          <Grid item xs={12} sm={6} md={6} className={classes.notFound}>
            <h1 className={classes.header1}>
              {t('sisaltohaku.sivua-ei-löytynyt')}
            </h1>
            <p>{t('sisaltohaku.etsimääsi-ei-löydy')}</p>
            <Link href={'/'}>{t('sisaltohaku.takaisin')}</Link>
          </Grid>
        )}
      </Grid>
    );
  }
});

export default withRouter(SivuRouter);
