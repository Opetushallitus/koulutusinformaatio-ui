import React from 'react';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { handleFilterToggle, newSearchAll } from '#/src/store/reducers/hakutulosSlice';
import { getFilterProps } from '#/src/store/reducers/hakutulosSliceSelector';

import { Filter } from './Filter';
import { FilterProps, FilterType, SuodatinComponentProps } from './SuodatinTypes';

const FILTER_ID = 'valintatapa';
const filterSelector = getFilterProps(FILTER_ID);

export const ValintatapaSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { sortedValues, checkedValues, localizedCheckedValues } = useSelector<
    any,
    FilterProps
  >(filterSelector);

  const handleCheck = (item: FilterType) => {
    dispatch(handleFilterToggle({ filter: FILTER_ID, item }));
    dispatch(newSearchAll());
  };

  return (
    <Filter
      {...props}
      name={t('haku.valintatapa')}
      sortedFilterValues={sortedValues}
      handleCheck={handleCheck}
      checkedStr={localizedCheckedValues}
      checkedValues={checkedValues}
    />
  );
};