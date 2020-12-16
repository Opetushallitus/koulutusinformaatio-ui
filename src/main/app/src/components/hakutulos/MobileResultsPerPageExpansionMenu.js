import React from 'react';
import { useHistory } from 'react-router-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import qs from 'query-string';
import { Grid, Typography } from '@material-ui/core';
import { clearPaging, searchAll, setSize } from '#/src/store/reducers/hakutulosSlice';
import { SuodatinMobileSlider } from './hakutulosSuodattimet/CustomizedMuiComponents';
import { useQueryParams } from '#/src/hooks';

const MobileResultsPerPageExpansionMenu = ({ elevation }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const apiRequestPaparms = useQueryParams();
  const { pageSizeArray, size } = useSelector(
    (state) => ({
      pageSizeArray: state.hakutulos.pageSizeArray,
      size: state.hakutulos.size,
    }),
    shallowEqual
  );
  const marks = pageSizeArray.map((_size) => ({
    value: _size,
    label: _.toString(_size),
  }));

  const valueText = (value) => value;

  const handleSliderValueChange = (e, newSize) => {
    const search = qs.parse(history.location.search);

    search.pagesize = newSize;
    search.kpage = 1;
    search.opage = 1;
    history.replace({ search: qs.stringify(search) });
    dispatch(clearPaging());
    dispatch(setSize({ newSize }));
    dispatch(searchAll({ ...apiRequestPaparms, size: newSize }));
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
          {t('haku.tuloksia-per-sivu')}
        </Typography>
      </Grid>
      <Grid item xs={12} sm>
        <SuodatinMobileSlider
          defaultValue={size}
          track={false}
          min={_.min(pageSizeArray)}
          max={_.max(pageSizeArray)}
          marks={marks}
          step={null}
          getAriaValueText={valueText}
          aria-label={t('haku.tuloksia-per-sivu')}
          onChange={handleSliderValueChange}
        />
      </Grid>
    </Grid>
  );
};

export default MobileResultsPerPageExpansionMenu;
