import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button, Chip, Grid, makeStyles } from '@material-ui/core';
import _ from 'lodash';
import { Clear } from '@material-ui/icons';
import { getSuodatinValinnatProps } from '#/src/store/reducers/hakutulosSliceSelector';
import {
  clearSelectedFilters,
  searchAll,
  setSelectedFilters,
} from '#/src/store/reducers/hakutulosSlice';
import { Localizer as l } from '#/src/tools/Utils';
import { colors } from '#/src/colors';
import { useQueryParams } from '#/src/hooks';
import { useUrlParams } from '../UseUrlParams';

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

// TODO: This is NOT same type as new refactored filters, name !== nimi
type FilterType = {
  id: string;
  name: any;
};

type ChosenFiltersProps = {
  filters: Record<string, Array<FilterType>>;
  getHandleDelete: (filterType: string, itemId: string) => VoidFunction;
  handleClearFilters: VoidFunction;
};

const ChipList = ({
  getHandleDelete,
  handleClearFilters,
  filters,
}: ChosenFiltersProps) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const displayChips = ([filterType, items]: [string, Array<FilterType>]) =>
    items.map(({ id, name }) => (
      <Chip
        size="small"
        data-cy={`chip-${id}`}
        key={`chip_${id}`}
        classes={{
          root: classes.chipRoot,
          label: classes.chipLabel,
        }}
        label={l.localize(name) || t(`haku.${id}`)}
        onDelete={getHandleDelete(filterType, id)}
      />
    ));

  return (
    <Grid
      container
      wrap="nowrap"
      justify="space-between"
      style={{ paddingBottom: '5px' }}>
      <Grid item style={{ paddingTop: '5px' }}>
        {Object.entries(filters).map((entry) =>
          entry[1].length > 0 ? displayChips(entry) : ''
        )}
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
  const { omitUrlSearchParams, updateUrlSearchParams } = useUrlParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const suodatinValinnatProps = useSelector(getSuodatinValinnatProps);
  const apiRequestParams = useQueryParams();

  const [filters, setFilters] = useState<Record<string, Array<FilterType>>>({});

  useEffect(() => {
    setFilters(suodatinValinnatProps);
  }, [suodatinValinnatProps, location]);

  const getHandleDelete = (filterType: string, itemId: string) => () => {
    const newFilterValuesStr = filters[filterType]
      .filter(({ id }) => id !== itemId)
      .map(({ id }) => id)
      .join(',');

    updateUrlSearchParams({ [filterType]: newFilterValuesStr });
    dispatch(setSelectedFilters({ filterType, itemId }));
    dispatch(searchAll({ ...apiRequestParams, [filterType]: newFilterValuesStr }));
  };

  const handleClearFilters = () => {
    omitUrlSearchParams(filters);
    dispatch(clearSelectedFilters());
    dispatch(searchAll(_.omit(apiRequestParams, _.keys(filters))));
  };

  return (
    <ChipList
      filters={filters}
      getHandleDelete={getHandleDelete}
      handleClearFilters={handleClearFilters}
    />
  );
};
