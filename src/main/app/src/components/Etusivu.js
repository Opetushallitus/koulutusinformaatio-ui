import React, { useState } from 'react';
import Jumpotron from './Jumpotron';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';
import _ from 'lodash';
import Markdown from 'markdown-to-jsx';
import Kortti from './kortti/Kortti';
import Uutiset from './uutinen/Uutiset';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { colors } from '#/src/colors';
import Button from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';
import ReactiveBorder from './ReactiveBorder';
import { useStores } from '#/src/hooks';
import LoadingCircle from '#/src/components/common/LoadingCircle';

const useStyles = makeStyles({
  info: {
    backgroundColor: colors.veryLightGreyBackground,
    borderRadius: 2,
    padding: '25px 20px',
    cursor: 'pointer',
  },
  header: {
    fontSize: '28px',
    paddingTop: '60px',
    paddingBottom: '28px',
    fontWeight: '700',
  },
  oikopolut: {
    backgroundColor: colors.white,
    paddingBottom: '100px',
  },
  uutiset: {
    backgroundColor: colors.lightGreyBackground,
    paddingBottom: '100px',
  },
  palvelut: {
    backgroundColor: colors.white,
    paddingBottom: '100px',
  },
  showMore: {
    marginTop: '55px',
    fontWeight: '600',
    textTransform: 'none',
  },
});

const Etusivu = observer(({ history }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { i18n } = useTranslation();
  const { contentfulStore } = useStores();
  const { info, uutiset, kortit } = contentfulStore.data;

  const { forwardTo } = contentfulStore;
  const forwardToPage = (id) => {
    history.push(`/${i18n.language}${forwardTo(id)}`);
  };
  const infos = Object.values(info || {});

  const single = (entry) => Object.values(entry || {})[0] || {};
  let uutislinkit = ((uutiset || {})['etusivun-uutiset'] || {}).linkit || [];

  const [showMore, setShowMore] = useState(!(uutislinkit.length > 3));

  return (
    <React.Fragment>
      <Jumpotron />
      {contentfulStore.data.loading ? (
        <LoadingCircle />
      ) : (
        <>
          <ReactiveBorder className={classes.oikopolut}>
            <Grid container spacing={3}>
              {infos.map((info) => {
                return (
                  <Grid item xs={12} key={info.id}>
                    <Paper
                      className={classes.info}
                      elevation={0}
                      onClick={() => forwardToPage(info.linkki.id)}>
                      <span className="notification-content">
                        <Markdown>{info.content}</Markdown>
                      </span>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>

            <Grid container>
              <h1 className={classes.header}>{t('oikopolut')}</h1>
              <Grid container spacing={3}>
                {(single(kortit).kortit || []).map((k) => {
                  return <Kortti id={k.id} key={k.id} />;
                })}
              </Grid>
            </Grid>
          </ReactiveBorder>
          <ReactiveBorder className={classes.uutiset}>
            <Grid container>
              <Grid item xs={12}>
                <h1 className={classes.header}>{t('ajankohtaista-ja-uutisia')}</h1>
              </Grid>
              <Grid container spacing={3}>
                <Uutiset uutiset={showMore ? _.take(uutislinkit, 3) : uutislinkit} />
              </Grid>

              <Grid container direction="row" justify="center" alignItems="center">
                {showMore ? (
                  <Button
                    className={classes.showMore}
                    variant="contained"
                    onClick={(e) => setShowMore(false)}
                    color="primary">
                    {t('näytä-kaikki')}
                  </Button>
                ) : null}
              </Grid>
            </Grid>
          </ReactiveBorder>
        </>
      )}
    </React.Fragment>
  );
});

export default withRouter(Etusivu);
