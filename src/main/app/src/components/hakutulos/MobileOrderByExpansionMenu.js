import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import { useHistory, useLocation } from 'react-router-dom';
import { Grid, Typography } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import qs from 'query-string';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks';
import {
  SuodatinExpansionPanel,
  SuodatinExpansionPanelSummary,
} from './hakutulosSuodattimet/CustomizedMuiComponents';

const MobileOrderByExpansionMenu = ({ elevation }) => {
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();
  const { hakuStore } = useStores();
  const { sort } = hakuStore;

  useEffect(() => {}, [location, sort]);

  const handleSortToggle = () => {
    const search = qs.parse(history.location.search);
    const newSort = hakuStore.sort === 'asc' ? 'desc' : 'asc';
    search.sort = newSort;
    hakuStore.toggleSort(newSort);
    history.replace({ search: qs.stringify(search) });
    hakuStore.searchKoulutukset();
    hakuStore.searchOppilaitokset();
  };

  return (
    <SuodatinExpansionPanel
      elevation={elevation}
      onChange={() => handleSortToggle(hakuStore.sort)}
      expanded={hakuStore.sort !== 'asc'}>
      <SuodatinExpansionPanelSummary expandIcon={<ExpandMore />}>
        <Grid
          container
          justify="space-between"
          alignItems="baseline"
          wrap="nowrap">
          <Grid item>
            <Typography variant="subtitle1">{t('haku.jarjestys')}</Typography>
          </Grid>
          <Grid item>
            {hakuStore.sort === 'asc'
              ? t('haku.aakkoset_a_o')
              : t('haku.aakkoset_o_a')}
          </Grid>
        </Grid>
      </SuodatinExpansionPanelSummary>
    </SuodatinExpansionPanel>
  );
};

export default observer(MobileOrderByExpansionMenu);
