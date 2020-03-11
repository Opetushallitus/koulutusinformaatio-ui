import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useHistory, useLocation } from 'react-router-dom';
import { Grid, Typography, Container } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import qs from 'query-string';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks';
import {
  SuodatinExpansionPanel,
  SuodatinExpansionPanelSummary,
  SuodatinExpansionPanelDetails,
  SuodatinMobileSlider,
} from './hakutulosSuodattimet/CustomizedMuiComponents';

const MobileResultsPerPageExpansionMenu = ({ elevation }) => {
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();
  const { hakuStore } = useStores();
  const { pageSizeArray, paging } = hakuStore;
  const marks = _.map(pageSizeArray, (size) => {
    return { value: size, label: _.toString(size) };
  });
  console.log(marks);

  useEffect(() => {}, [location]);

  const valueText = (value) => value;

  return (
    <Grid
      container
      //   justify="space-between"
      alignItems="center"
      spacing={3}
      direction="column"
      style={{ padding: '12px 24px' }}
      wrap="nowrap">
      {/* <Grid item>
        </Grid> */}
      <Grid item style={{ width: '100%' }}>
        <Typography variant="subtitle1" noWrap>
          {t('haku.tuloksia-per-sivu')}
        </Typography>
        <SuodatinMobileSlider
          defaultValue={paging.pageSize}
          min={_.min(pageSizeArray)}
          max={_.max(pageSizeArray)}
          marks={marks}
          step={null}
          getAriaValueText={valueText}
          aria-label={t('haku.tuloksia-per-sivu')}
        />
      </Grid>
    </Grid>
  );
};

export default observer(MobileResultsPerPageExpansionMenu);
