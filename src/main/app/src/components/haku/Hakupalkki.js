import React from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Paper, makeStyles, ThemeProvider, Tooltip } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import {
  searchAll,
  setKeyword,
  clearPaging,
  clearSelectedFilters,
  setKeywordEditMode,
} from '#/src/store/reducers/hakutulosSlice';
import { getHakupalkkiProps } from '#/src/store/reducers/hakutulosSliceSelector';
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
  const {
    keyword,
    keywordEditMode,
    size,
    order,
    showTooltip,
    isKeyworValid,
  } = useSelector(getHakupalkkiProps);

  const doSearch = (event) => {
    event.preventDefault();
    dispatch(clearPaging());
    dispatch(clearSelectedFilters());
    history.push(`/haku/${keyword}?order=${order}&size=${size}`);
    dispatch(setKeywordEditMode({ newKeywordEditMode: false }));
    dispatch(searchAll({ keyword, size }, true));
  };
  const setSearch = (event) => {
    if (event.target.value) {
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
          open={showTooltip}
          title={t('haku.syota-ainakin-kolme-merkkia')}>
          <InputBase
            defaultValue={keyword}
            className={classes.input}
            onKeyPress={(event) =>
              event.key === 'Enter' && isKeyworValid && doSearch(event)
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
          disabled={!isKeyworValid}
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
