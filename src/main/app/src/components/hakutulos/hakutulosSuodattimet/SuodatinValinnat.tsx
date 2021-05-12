import React from 'react';

import { Button, Chip, Grid, makeStyles } from '@material-ui/core';
import { Clear } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { colors } from '#/src/colors';
import {
  clearSelectedFilters,
  handleFilterOperations,
  newSearchAll,
} from '#/src/store/reducers/hakutulosSlice';
import { getAllSelectedFilters } from '#/src/store/reducers/hakutulosSliceSelector';
import { localize } from '#/src/tools/localization';

import { FilterValue } from './SuodatinTypes';

const useStyles = makeStyles(() => ({
  chipRoot: {
    marginBottom: 5,
    marginRight: 5,
    borderRadius: 5,
    backgroundColor: colors.lightGrey,
    border: 'none',
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: 600,
  },
  clearButtonLabel: {
    fontWeight: 600,
    fontSize: 14,
    textDecoration: 'underline',
    whiteSpace: 'nowrap',
  },
  clearButtonSizeSmall: {
    padding: '1px 5px',
  },
}));

type ChosenFiltersProps = {
  filters: Array<FilterValue>;
  getHandleDelete: (entry: FilterValue) => VoidFunction;
  handleClearFilters: VoidFunction;
};

const ChipList = ({
  getHandleDelete,
  handleClearFilters,
  filters,
}: ChosenFiltersProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  return (
    <Grid
      container
      wrap="nowrap"
      justify="space-between"
      style={{ paddingBottom: '5px' }}>
      <Grid item style={{ paddingTop: '5px' }}>
        {filters.map((entry) => (
          <Chip
            size="small"
            data-cy={`chip-${entry.id}`}
            key={`chip_${entry.id}`}
            classes={{
              root: classes.chipRoot,
              label: classes.chipLabel,
            }}
            // NOTE: Some filters are not koodisto values and must be translated
            label={localize(entry) || t(`haku.${entry.id}`)}
            onDelete={getHandleDelete(entry)}
          />
        ))}
      </Grid>
      <Grid item>
        <Button
          size="small"
          startIcon={<Clear />}
          classes={{
            label: classes.clearButtonLabel,
            sizeSmall: classes.clearButtonSizeSmall,
          }}
          onClick={handleClearFilters}>
          {t('haku.poista-valitut-rajaimet')}
        </Button>
      </Grid>
    </Grid>
  );
};

export const SuodatinValinnat = () => {
  const dispatch = useDispatch();
  const filters = useSelector(getAllSelectedFilters);

  const getHandleDelete = (item: FilterValue) => () => {
    dispatch(handleFilterOperations([{ item, operation: 'UNSET' }]));
    dispatch(newSearchAll());
  };

  const handleClearFilters = () => {
    dispatch(clearSelectedFilters());
    dispatch(newSearchAll());
  };

  return (
    <ChipList
      filters={filters}
      getHandleDelete={getHandleDelete}
      handleClearFilters={handleClearFilters}
    />
  );
};
