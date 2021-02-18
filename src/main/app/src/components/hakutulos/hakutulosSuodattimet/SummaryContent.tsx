import React from 'react';

import { Grid, Typography } from '@material-ui/core';
import { TFunction } from 'i18next';
import _ from 'lodash';

import { SuodatinMobileChip } from './CustomizedMuiComponents';

type Props = {
  maxCharLengthBeforeChipWithNumber: number;
  filterName: ReturnType<TFunction>;
  selectedFiltersStr?: string;
  displaySelected?: boolean;
};

export const SummaryContent = ({
  selectedFiltersStr,
  maxCharLengthBeforeChipWithNumber,
  filterName,
  displaySelected,
}: Props) => (
  <Grid container justify="space-between" alignItems="center" wrap="nowrap">
    <Grid item style={{ paddingRight: '8px' }}>
      <Typography variant="subtitle1">{filterName}</Typography>
    </Grid>
    {displaySelected && (
      <Grid item>
        {_.inRange(_.size(selectedFiltersStr), 0, maxCharLengthBeforeChipWithNumber) ? (
          selectedFiltersStr
        ) : (
          <SuodatinMobileChip label={_.size(_.split(selectedFiltersStr, ','))} />
        )}
      </Grid>
    )}
  </Grid>
);
