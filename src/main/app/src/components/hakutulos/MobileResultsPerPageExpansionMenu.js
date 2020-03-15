import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useHistory, useLocation } from 'react-router-dom';
import { Grid, Typography } from '@material-ui/core';
import qs from 'query-string';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks';
import { SuodatinMobileSlider } from './hakutulosSuodattimet/CustomizedMuiComponents';

const MobileResultsPerPageExpansionMenu = ({ elevation }) => {
  const history = useHistory();
  const { t } = useTranslation();
  const { hakuStore } = useStores();
  const { pageSizeArray, paging } = hakuStore;

  const marks = pageSizeArray.map((size) => ({
    value: size,
    label: _.toString(size),
  }));

  const valueText = (value) => value;

  const handleSliderValueChange = (e, newValue) => {
    const search = qs.parse(history.location.search);

    search.pagesize = newValue;
    search.kpage = 1;
    search.opage = 1;
    history.replace({ search: qs.stringify(search) });
    hakuStore.clearOffsetAndPaging();
    hakuStore.setPagingPageSize(newValue);
    hakuStore.searchKoulutukset();
    hakuStore.searchOppilaitokset();
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
          defaultValue={paging.pageSize}
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

export default observer(MobileResultsPerPageExpansionMenu);
