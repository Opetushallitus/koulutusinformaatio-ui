import React from 'react';
import { withRouter } from 'react-router-dom';
import '../../assets/styles/components/_hakupalkki.scss';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { Paper, makeStyles, ThemeProvider, Tooltip } from '@material-ui/core';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import { useStores } from '../../hooks';
import { colors } from '../../colors';
import { theme } from '../../theme';
import { observer } from 'mobx-react-lite';

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

const Hakupalkki = observer(({ history }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { hakuehtoStore } = useStores();
  const doSearch = (event) => {
    event.preventDefault();
    history.push(hakuehtoStore.createHakuUrl);
  };
  const setSearch = (event) => {
    if (event.target.value) {
      hakuehtoStore.keyword = event.target.value;
    } else {
      hakuehtoStore.keyword = '';
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
          open={_.inRange(hakuehtoStore.keyword.length, 1, 3)}
          title={t('haku.syota-ainakin-kolme-merkkia')}>
          <InputBase
            defaultValue={hakuehtoStore.keyword}
            className={classes.input}
            autoFocus
            onKeyPress={(event) =>
              event.key === 'Enter' &&
              hakuehtoStore.keyword.length > 2 &&
              doSearch(event)
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
          disabled={hakuehtoStore.keyword.length < 3}
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
});

export default withRouter(Hakupalkki);
