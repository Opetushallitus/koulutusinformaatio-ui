import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import qs from 'query-string';
import { Grid, Typography, ButtonGroup, Button, makeStyles } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import {
  getMobileToggleOrderByButtonMenuProps,
  getAPIRequestParams,
} from '#/src/reducers/hakutulosSliceSelector';
import { setSort, setOrder, searchAll } from '#/src/reducers/hakutulosSlice';
import { colors } from '#/src/colors';
import { Common as C } from '#/src/tools/Utils';

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
  const dispatch = useDispatch();
  const apiRequstParams = useSelector(getAPIRequestParams);
  const mobileToggleOrderByButtonMenuProps = useSelector(
    getMobileToggleOrderByButtonMenuProps
  );
  const {
    isNameSort,
    isNameSortDesc,
    isScoreSort,
    order,
  } = mobileToggleOrderByButtonMenuProps;

  const updateSortAndOrder = (newSort, newOrder) => {
    const search = qs.parse(history.location.search);
    search.sort = newSort;
    search.order = newOrder;
    history.replace({ search: qs.stringify(C.withoutNilValues(search)) });
    dispatch(setSort({ newSort }));
    dispatch(setOrder({ newOrder }));
    dispatch(searchAll({ ...apiRequstParams, order: newOrder, sort: newSort }));
  };

  const toggleToScoreSort = () => {
    if (!isScoreSort) {
      updateSortAndOrder('score', 'desc');
    }
  };

  const toggleToNameSort = () => updateSortAndOrder('name', 'asc');

  const toggleNameSortOrder = () =>
    updateSortAndOrder('name', order !== 'asc' ? 'asc' : 'desc');

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
            className={isScoreSort ? classes.buttonActive : classes.buttonInactive}
            onClick={toggleToScoreSort}>
            {t('haku.jarjesta_mobiili_osuvin')}
          </Button>
          <Button
            className={isNameSort ? classes.buttonActive : classes.buttonInactive}
            onClick={isNameSort ? toggleNameSortOrder : toggleToNameSort}
            endIcon={isNameSortDesc ? <ExpandLess /> : <ExpandMore />}>
            {isNameSortDesc
              ? t('haku.jarjesta_mobiili_aakkoset_o_a')
              : t('haku.jarjesta_mobiili_aakkoset_a_o')}
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
};

export default MobileToggleOrderByButtonMenu;
