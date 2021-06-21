import React, { useState, useCallback } from 'react';

import {
  Button,
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
import _ from 'lodash';
import MuiFlatPagination from 'material-ui-flat-pagination';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
// @ts-ignore no types
import parse from 'url-parse';

import { LocalizedLink } from '#/src/components/common/LocalizedLink';
import { useContentful } from '#/src/hooks';

import koulutusPlaceholderImg from '../assets/images/Opolkuhts.png';
import { colors } from '../colors';
import Murupolku from './common/Murupolku';
import { Preview } from './Preview';
import { ReactiveBorder } from './ReactiveBorder';

const useStyles = makeStyles({
  sisaltohaku: {
    marginTop: '40px',
  },
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

type ResultProps = {
  id: string;
  url: string;
  image: { name: string; description: string };
  sivu: { name: string; description: string; content: string; sideContent: string };
  assetUrl: string;
  classes: Record<string, string>;
};

const Result = withStyles({
  root: {
    padding: '15px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  image: {
    flex: '0 0 auto',
    marginLeft: 'auto',
    width: 228,
    minWidth: 228,
    height: 131,
  },
  content: {
    flex: '0 1 auto',
    alignSelf: 'flex-start',
  },
})(({ id, url, image, sivu, classes, assetUrl }: ResultProps) => {
  const { t } = useTranslation();

  return (
    <Grid item xs={12} key={id}>
      <TulosPanel>
        <ButtonBase component={LocalizedLink} className={classes.root} to={url}>
          <CardContent className={classes.content}>
            <Typography component="h4" variant="h4">
              {sivu.name}
            </Typography>
            <br />
            <Typography variant="subtitle1" color="textSecondary">
              {sivu.description || <Preview markdown={sivu.content} />}
            </Typography>
          </CardContent>
          <CardMedia
            className={classes.image}
            image={assetUrl || koulutusPlaceholderImg}
            title={image.description || image.name || t('sisaltohaku.paikanpitäjä')}
            aria-label={image.description || image.name || t('sisaltohaku.paikanpitäjä')}
            role="img"
          />
        </ButtonBase>
      </TulosPanel>
    </Grid>
  );
});

const PAGESIZE = 10;
const asKeywords = (s: string) => s.toLowerCase().split(/[ ,]+/);

export const Sisaltohaku = () => {
  const { data, forwardTo, assetUrl } = useContentful();
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const { sivu, uutinen } = data;
  const index = Object.entries(sivu)
    .filter(([key, { id }]: any) => key === id)
    .map(([ignored, { id, sideContent, content }]: any) => {
      return {
        id: id,
        content: (content + (sideContent || '')).toLowerCase(),
      };
    });
  const fetchResults = useCallback(
    (input) => {
      const keywords = asKeywords(input);
      if (!_.isEmpty(keywords)) {
        return index.filter(({ content }) => keywords.find((kw) => content.includes(kw)));
      } else {
        return [];
      }
    },
    [index]
  );
  const hakusana = _.trim((parse(location.search, true).query || {}).hakusana);

  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState(hakusana);
  const [results, setResults] = useState(fetchResults(hakusana));

  const doSearch = useCallback(
    (event) => {
      event?.preventDefault();
      history.push(`/${i18n.language}/sisaltohaku/?hakusana=${_.trim(search)}`);
      setOffset(0);
      setResults(fetchResults(search));
    },
    [fetchResults, i18n, history, search]
  );

  const activeSearch = hakusana !== '';
  const pagination = (results || []).length > PAGESIZE;
  const paginate = () =>
    pagination ? results.slice(offset, PAGESIZE + offset) : results;

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
              defaultValue={search}
              onKeyPress={(event) => event.key === 'Enter' && doSearch(event)}
              onChange={({ target }) => setSearch(target.value)}
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
        {activeSearch && _.isEmpty(results) ? (
          data.loading ? null : (
            <React.Fragment>
              <Grid item xs={12}>
                <h1>{t('sisaltohaku.eituloksia')}</h1>
              </Grid>
              <Grid item xs={12}>
                <span>{t('sisaltohaku.summary', { hakusana: hakusana || '' })}</span>
              </Grid>
              <Grid item xs={12}>
                <LocalizedLink to={'/'}>{t('sisaltohaku.takaisin')}</LocalizedLink>
              </Grid>
            </React.Fragment>
          )
        ) : (
          <>
            {paginate().map(({ id }) => {
              const s = sivu[id];
              const u = uutinen[id];
              const image = u?.image || {};
              return (
                <Result
                  id={id}
                  key={id}
                  url={forwardTo(s.id)!}
                  sivu={s}
                  assetUrl={assetUrl(image.url)}
                  image={image}
                />
              );
            })}
            {pagination && (
              <MuiFlatPagination
                limit={PAGESIZE}
                offset={offset}
                total={results.length}
                onClick={(e, newOffset) => setOffset(newOffset)}
              />
            )}
          </>
        )}
      </Grid>
    </ReactiveBorder>
  );
};
