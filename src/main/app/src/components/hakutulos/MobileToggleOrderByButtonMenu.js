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
    if (!hakuStore.isScoreSort) {
      updateSortAndOrder('score', 'desc');
    }
  };

  const toggleToNameSort = () => updateSortAndOrder('name', 'asc');

  const toggleNameSortOrder = () =>
    updateSortAndOrder('name', hakuStore.order !== 'asc' ? 'asc' : 'desc');

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
              hakuStore.isScoreSort ? classes.buttonActive : classes.buttonInactive
            }
            onClick={toggleToScoreSort}>
            {t('haku.jarjesta_mobiili_osuvin')}
          </Button>
          <Button
            className={
              hakuStore.isNameSort ? classes.buttonActive : classes.buttonInactive
            }
            onClick={hakuStore.isNameSort ? toggleNameSortOrder : toggleToNameSort}
            endIcon={hakuStore.isNameSortDesc ? <ExpandLess /> : <ExpandMore />}>
            {hakuStore.isNameSortDesc
              ? t('haku.jarjesta_mobiili_aakkoset_o_a')
              : t('haku.jarjesta_mobiili_aakkoset_a_o')}
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
};

export default observer(MobileToggleOrderByButtonMenu);
