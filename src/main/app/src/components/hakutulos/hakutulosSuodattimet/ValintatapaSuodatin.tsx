import React from 'react';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { handleFiltersChange, newSearchAll } from '#/src/store/reducers/hakutulosSlice';
import { getFilterProps } from '#/src/store/reducers/hakutulosSliceSelector';

import { Filter } from './Filter';
import { FilterProps, FilterValue, SuodatinComponentProps } from './SuodatinTypes';

const FILTER_ID = 'valintatapa';
const filterSelector = getFilterProps(FILTER_ID);

// TODO: Do not use this component until backend supports filtering no-haku-kaynnissa for valintatavat
export const ValintatapaSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { values, localizedCheckedValues } = useSelector<any, FilterProps>(
    filterSelector
  );

  const handleCheck = (item: FilterValue) => {
    dispatch(handleFiltersChange([{ item }]));
    dispatch(newSearchAll());
  };

  return (
    <Filter
      {...props}
      testId="valintatapa-filter"
      name={t('haku.valintatapa')}
      values={values}
      handleCheck={handleCheck}
      checkedStr={localizedCheckedValues}
    />
  );
};
