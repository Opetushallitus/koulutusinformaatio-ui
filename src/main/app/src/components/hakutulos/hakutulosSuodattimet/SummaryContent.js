import { Grid, Typography } from '@material-ui/core';
import _ from 'lodash';
import React from 'react';
import { SuodatinMobileChip } from './CustomizedMuiComponents';

export const SummaryContent = ({
  selectedFiltersStr,
  maxCharLengthBeforeChipWithNumber,
  filterName,
  displaySelected,
}) => {
  return (
    <Grid container justify="space-between" alignItems="center" wrap="nowrap">
      <Grid item>
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
};
