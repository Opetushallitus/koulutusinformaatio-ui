import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { handleFiltersChange, newSearchAll } from '#/src/store/reducers/hakutulosSlice';
import { getFilterProps } from '#/src/store/reducers/hakutulosSliceSelector';

import { Filter } from './Filter';
import { FilterProps, FilterValue, SuodatinComponentProps } from './SuodatinTypes';
import { flattenCheckboxValues, getFilterStateChanges } from './utils';

const OPETUSKIELI_FILTER_ID = 'opetuskieli';
const opetuskieliSelector = getFilterProps(OPETUSKIELI_FILTER_ID);

export const OpetuskieliSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { values, localizedCheckedValues } = useSelector<any, FilterProps>(
    opetuskieliSelector
  );

  const filterValues = useMemo(() => flattenCheckboxValues(values), [values]);

  const getOperations = getFilterStateChanges(values);
  const handleCheck = (item: FilterValue) => {
    const operations = getOperations(item);
    dispatch(handleFiltersChange(operations));
    dispatch(newSearchAll());
  };

  return (
    <Filter
      {...props}
      name={t('haku.opetuskieli')}
      values={filterValues}
      handleCheck={handleCheck}
      checkedStr={localizedCheckedValues}
    />
  );
};
