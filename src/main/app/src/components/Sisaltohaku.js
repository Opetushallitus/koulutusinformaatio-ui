import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import Murupolku from './common/Murupolku';
import Preview from './Preview';
import parse from 'url-parse';
import { useTranslation } from 'react-i18next';
import { useStores } from '../hooks';
import {
  Button,
  Link,
  Grid,
  Card,
  CardContent,
  CardHeader,
  makeStyles,
  Paper,
  InputBase,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { colors } from '../colors';
import { observer } from 'mobx-react-lite';
import _ from 'lodash';
import ReactiveBorder from './ReactiveBorder';

const useStyles = makeStyles({
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
  input: {
    borderRadius: 0,
    flex: 1,
  },
  iconButton: {
    minHeight: '60px',
    minWidth: '60px',
    borderRadius: 0,
  },
  card: {
    display: 'flex',
    cursor: 'pointer',
    paddingRight: '10px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    backgroundColor: colors.white,
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
    maxHeight: '150px',
  },
  title: {
    color: '#1D1D1D',
    fontFamily: 'Open Sans',
    fontSize: '20px',
    fontWeight: 'bold',
  },
});

const Sisaltohaku = (props) => {
  const asKeywords = (s) => s.toLowerCase().split(/[ ,]+/);
  const { contentfulStore } = useStores();
  const forwardToPage = (id) => {
    props.history.push(contentfulStore.forwardTo(id));
  };
  const { sivu } = contentfulStore.data;
  const index = Object.entries(sivu)
    .filter(([key, { id }]) => key === id)
    .map(([, { id, sideContent, content }]) => {
      return {
        id: id,
        content: (content + (sideContent || '')).toLowerCase(),
      };
    });
  const fetchResults = (search) => {
    console.log('updating results ' + search);
    const keywords = asKeywords(search);
    if (!_.isEmpty(keywords)) {
      const r = index.filter(({ content }) => {
        return keywords.find((kw) => content.includes(kw));
      });
      console.log(r);
      return r;
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
  const classes = useStyles();
  const { t } = useTranslation();
  const doSearch = (event) => {
    props.history.push('/sisaltohaku/?hakusana=' + _.trim(state.search));
    event.preventDefault();
    setState({ ...state, results: fetchResults(state.search) });
  };
  const activeSearch = hakusana !== '';
  const keywords = asKeywords(hakusana);

  return (
    <ReactiveBorder>
      <Grid
        container
        direction="row"
        justify="center"
        spacing={2}
        alignItems="center"
      >
        <Grid item xs={12}>
          <Murupolku
            path={[{ name: t('sisaltohaku.otsikko'), link: '/sisaltohaku/' }]}
          />
        </Grid>
        <Grid item xs={12}>
          <Paper
            component="form"
            onSubmit={doSearch}
            elevation={0}
            className={classes.paper}
          >
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
              aria-label={t('sidebar.etsi-tietoa-opintopolusta')}
            >
              <SearchIcon />
            </Button>
          </Paper>
        </Grid>
        {activeSearch && _.isEmpty(state.results) ? (
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
        ) : (
          state.results.map(({ id }) => {
            const s = sivu[id];
            const parts = (s.content.split(/\n/g) || []).concat(
              (s.sideContent || '').split(/\n/g) || []
            );
            return (
              <Grid item xs={12} key={id}>
                <Card
                  className={classes.card}
                  onClick={(e) => {
                    e.preventDefault();
                    forwardToPage(id);
                  }}
                >
                  <CardHeader className={classes.title} title={s.name} />
                  <CardContent className={classes.content}>
                    <Preview
                      parts={parts}
                      id={id}
                      contentfulStore={contentfulStore}
                      keywords={keywords}
                    />
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>
    </ReactiveBorder>
  );
};

export default withRouter(observer(Sisaltohaku));
