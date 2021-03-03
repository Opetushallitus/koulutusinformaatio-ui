import React from 'react';

import { Grid, Typography } from '@material-ui/core';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { useQueryParams } from '#/src/hooks';
import { clearPaging, searchAll, setSize } from '#/src/store/reducers/hakutulosSlice';

import { SuodatinMobileSlider } from './hakutulosSuodattimet/CustomizedMuiComponents';

const MobileResultsPerPageExpansionMenu = ({ elevation }) => {
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
