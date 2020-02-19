import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Murupolku from './common/Murupolku';
import parse from 'url-parse';
import { useTranslation } from 'react-i18next';
import { useStores } from '../hooks';
import {
  Button,
  Link,
  Grid,
  Card,
  CardContent,
  makeStyles,
  Paper,
  ButtonBase,
  CardMedia,
  InputBase,
  Typography,
  withStyles,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { colors } from '../colors';
import { observer } from 'mobx-react-lite';
import _ from 'lodash';
import ReactiveBorder from './ReactiveBorder';
import koulutusPlaceholderImg from '../assets/images/Opolkuhts.png';
import Preview from './Preview';

const useStyles = makeStyles({
  sisaltohaku: {
    marginTop: '40px',
  },
  details: {},
  paper: {
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    border: '1px solid #B2B2B2',
    borderRadius: '2px',
    paddingLeft: '20px',
    backgroundColor: colors.white,
  },
  root: {
    padding: '15px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  content: {
    flex: '0 1 auto',
    alignSelf: 'flex-start',
  },
  image: {
    flex: '0 0 auto',
    marginLeft: 'auto',
    width: 228,
    minWidth: 228,
    height: 131,
  },
  input: {
    borderRadius: 0,
    flex: 1,
  },
  iconButton: {
    minHeight: '60px',
    minWidth: '60px',
    borderRadius: 0,
  },
});

const TulosPanel = withStyles({
  root: {
    backgroundColor: colors.white,
    marginBottom: '16px',
    boxShadow: '0 2px 8px 0 rgba(0,0,0,0.2)',
    borderRadius: '0 !important',
    '&:before': {
      backgroundColor: colors.white,
    },
  },
})(Card);

const Sisaltohaku = observer((props) => {
  const asKeywords = (s) => s.toLowerCase().split(/[ ,]+/);
  const { contentfulStore } = useStores();
  const { sivu, uutinen } = contentfulStore.data;
  const { t } = useTranslation();
  const classes = useStyles();

  const { forwardTo } = contentfulStore;
  const index = Object.entries(sivu)
    .filter(([key, { id }]) => key === id)
    .map(([, { id, sideContent, content }]) => {
      return {
        id: id,
        content: (content + (sideContent || '')).toLowerCase(),
      };
    });
  const fetchResults = (search) => {
    const keywords = asKeywords(search);
    if (!_.isEmpty(keywords)) {
      return index.filter(({ content }) => {
        return keywords.find((kw) => content.includes(kw));
      });
    } else {
      return [];
    }
  };
  const hakusana = _.trim(
    (parse(props.location.search, true).query || {}).hakusana
  );
  const [state, setState] = useState({
    search: hakusana,
    results: fetchResults(hakusana),
  });
  const doSearch = (event) => {
    props.history.push('/sisaltohaku/?hakusana=' + _.trim(state.search));
    event && event.preventDefault();
    setState({ ...state, results: fetchResults(state.search) });
  };
  const activeSearch = hakusana !== '';
  useEffect(() => {
    doSearch(null);
  }, [contentfulStore.data.loading]); /* eslint-disable-line */

  return (
    <ReactiveBorder>
      <Grid
        container
        direction="row"
        justify="center"
        spacing={2}
        className={classes.sisaltohaku}
        alignItems="center">
        <Grid item xs={12}>
          <Murupolku path={[{ name: t('sisaltohaku.otsikko') }]} />
        </Grid>
        <Grid item xs={12}>
          <Paper
            component="form"
            onSubmit={doSearch}
            elevation={0}
            className={classes.paper}>
            <InputBase
              className={classes.input}
              defaultValue={state.search}
              onKeyPress={(event) => event.key === 'Enter' && doSearch(event)}
              onChange={({ target }) =>
                setState({ ...state, search: target.value })
              }
              placeholder={t('sidebar.etsi-tietoa-opintopolusta')}
              inputProps={{
                'aria-label': t('sidebar.etsi-tietoa-opintopolusta'),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.iconButton}
              aria-label={t('sidebar.etsi-tietoa-opintopolusta')}>
              <SearchIcon />
            </Button>
          </Paper>
        </Grid>
        {activeSearch && _.isEmpty(state.results) ? (
          contentfulStore.data.loading ? null : (
            <React.Fragment>
              <Grid item xs={12}>
                <h1>{t('sisaltohaku.eituloksia')}</h1>
              </Grid>
              <Grid item xs={12}>
                <span>
                  {t('sisaltohaku.summary', { hakusana: hakusana || '' })}
                </span>
              </Grid>
              <Grid item xs={12}>
                <Link href={'/'}>{t('sisaltohaku.takaisin')}</Link>
              </Grid>
            </React.Fragment>
          )
        ) : (
          state.results.map(({ id }) => {
            const s = sivu[id];
            const u = uutinen[id];
            const image = (u || {}).image || {};
            return (
              <Grid item xs={12} key={id}>
                <TulosPanel>
                  <ButtonBase
                    component={Link}
                    className={classes.root}
                    href={`/konfo${forwardTo(s.id)}`}>
                    <CardContent className={classes.content}>
                      <Typography component="h4" variant="h4">
                        {s.name}
                      </Typography>
                      <br />
                      <Typography variant="subtitle1" color="textSecondary">
                        {s.description || <Preview markdown={s.content} />}
                      </Typography>
                    </CardContent>
                    <CardMedia
                      className={classes.image}
                      image={
                        contentfulStore.assetUrl(image.url) ||
                        koulutusPlaceholderImg
                      }
                      title={
                        image.description ||
                        image.name ||
                        t('sisaltohaku.paikanpitäjä')
                      }
                      aria-label={
                        image.description ||
                        image.name ||
                        t('sisaltohaku.paikanpitäjä')
                      }
                    />
                  </ButtonBase>
                </TulosPanel>
              </Grid>
            );
          })
        )}
      </Grid>
    </ReactiveBorder>
  );
});

export default withRouter(Sisaltohaku);
