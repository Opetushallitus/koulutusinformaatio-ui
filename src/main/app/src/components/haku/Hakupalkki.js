import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { Paper, makeStyles, ThemeProvider, Tooltip } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import {
  searchAll,
  setKeyword,
  clearOffsetAndPaging,
  clearSelectedFilters,
  setKeywordEditMode,
} from '#/src/store/reducers/hakutulosSlice';
import { colors } from '#/src/colors';
import { theme } from '#/src/theme';

const useStyles = makeStyles((theme) => ({
  input: {
    borderRadius: 0,
    marginLeft: theme.spacing(3),
    flex: 1,
    color: colors.grey,
    fontFamily: 'Open Sans',
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '27px',
  },
  iconButton: {
    color: colors.white,
    borderRadius: '2px',
    height: '40px',
    width: '114px',
    fontFamily: 'Open Sans',
    fontSize: '16px',
    fontWeight: '600',
    lineHeight: '16px',
    textAlign: 'center',
    marginRight: '20px',
    marginLeft: '20px',
  },
  inputRoot: {
    height: '73px',
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    border: '1px solid #B2B2B2',
    borderRadius: '2px',
  },
}));

const Hakupalkki = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { keyword, keywordEditMode, size, order } = useSelector(
    (state) => ({
      keyword: state.hakutulos.keyword,
      keywordEditMode: state.hakutulos.keywordEditMode,
      size: state.hakutulos.size,
      order: state.hakutulos.order,
    }),
    shallowEqual
  );

  const [_keyword, _setKeyword] = useState('');

  useEffect(() => {
    _setKeyword(keyword);
  }, [keyword]);

  const doSearch = (event) => {
    event.preventDefault();
    dispatch(clearOffsetAndPaging());
    dispatch(clearSelectedFilters());
    history.push(`/haku/${_keyword}?order=${order}&size=${size}`);
    dispatch(setKeywordEditMode({ newKeywordEditMode: false }));
    dispatch(searchAll({ keyword: _keyword, size }, true));
  };
  const setSearch = (event) => {
    if (event.target.value) {
      _setKeyword(event.target.value);
      !keywordEditMode && dispatch(setKeywordEditMode({ newKeywordEditMode: true }));
      dispatch(setKeyword({ keyword: event.target.value }));
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <Paper
        component="form"
        onSubmit={doSearch}
        className={classes.inputRoot}
        elevation={4}>
        <Tooltip
          placement="bottom-start"
          open={_.inRange(keyword.length, 1, 3)}
          title={t('haku.syota-ainakin-kolme-merkkia')}>
          <InputBase
            defaultValue={keyword}
            className={classes.input}
            onKeyPress={(event) =>
              event.key === 'Enter' && _keyword.length > 2 && doSearch(event)
            }
            onChange={setSearch}
            type="search"
            placeholder={t('haku.kehoite')}
            inputProps={{
              'aria-label': t('haku.kehoite'),
            }}
          />
        </Tooltip>
        <Button
          disabled={_keyword.length < 3}
          type="submit"
          variant="contained"
          color="secondary"
          className={classes.iconButton}
          aria-label={t('haku.etsi')}>
          {t('haku.etsi')}
        </Button>
      </Paper>
    </ThemeProvider>
  );
};

export default Hakupalkki;
