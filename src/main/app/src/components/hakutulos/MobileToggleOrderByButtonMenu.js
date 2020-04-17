import React from 'react';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { Grid, Typography, ButtonGroup, Button, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { colors } from '../../colors';
import qs from 'query-string';

const useStyles = makeStyles((theme) => ({
  buttonActive: {
    backgroundColor: colors.green,
    color: colors.white,
    fontSize: 14,
    fontWeight: 600,
    whiteSpace: 'nowrap',
    '&:hover': {
      backgroundColor: colors.green,
    },
  },
  buttonInactive: {
    backgroundColor: colors.white,
    color: colors.green,
    fontSize: 14,
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
}));

const MobileToggleOrderByButtonMenu = ({ elevation }) => {
  const classes = useStyles();
  const history = useHistory();
  const { t } = useTranslation();
  const { hakuStore } = useStores();

  const updateSortAndOrder = (newSort, newOrder) => {
    console.log(newSort + ' ' + newOrder);
    const search = qs.parse(history.location.search);
    search.sort = newSort;
    search.order = newOrder;
    hakuStore.toggleSort(newSort);
    hakuStore.toggleOrder(newOrder);
    history.replace({ search: qs.stringify(search) });
    hakuStore.searchKoulutukset();
    hakuStore.searchOppilaitokset();
  };

  const toggleToScoreSort = () => {
    if (hakuStore.sort !== 'score') {
      updateSortAndOrder('score', 'desc');
    }
  };

  const toggleToNameSort = () => {
    updateSortAndOrder('name', 'asc');
  };

  const toggleNameSortOrder = () => {
    updateSortAndOrder('name', hakuStore.order !== 'asc' ? 'asc' : 'desc');
  };

  return (
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="flex-start"
      style={{ padding: '12px 24px' }}>
      <Grid item xs={12} sm={4}>
        <Typography variant="subtitle1" noWrap>
          {t('haku.jarjestys')}
        </Typography>
      </Grid>
      <Grid item xs={12} sm style={{ padding: '20px 0' }}>
        <ButtonGroup fullWidth>
          <Button
            className={
              hakuStore.sort !== 'name' ? classes.buttonActive : classes.buttonInactive
            }
            onClick={toggleToScoreSort}>
            {t('haku.jarjesta_mobiili_score_desc')}
          </Button>
          <Button
            className={
              hakuStore.sort === 'name' ? classes.buttonActive : classes.buttonInactive
            }
            onClick={hakuStore.sort === 'name' ? toggleNameSortOrder : toggleToNameSort}
            endIcon={
              hakuStore.sort == 'name' && hakuStore.order !== 'asc' ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              )
            }>
            {hakuStore.sort == 'name' && hakuStore.order !== 'asc'
              ? t('haku.jarjesta_mobiili_name_desc')
              : t('haku.jarjesta_mobiili_name_asc')}
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
};

export default observer(MobileToggleOrderByButtonMenu);
