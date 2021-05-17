import React from 'react';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { FILTER_TYPES } from '#/src/constants';
import {
  setFilterSelectedValues,
  newSearchAll,
} from '#/src/store/reducers/hakutulosSlice';
import { getFilterProps } from '#/src/store/reducers/hakutulosSliceSelector';

import { Filter } from './Filter';
import { FilterProps, FilterValue, SuodatinComponentProps } from './SuodatinTypes';
import { getFilterStateChanges } from './utils';

const koulutusalaSelector = getFilterProps(FILTER_TYPES.KOULUTUSALA);

export const KoulutusalaSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const values = useSelector<any, FilterProps>(koulutusalaSelector);

  const getChanges = getFilterStateChanges(values);
  const handleCheck = (item: FilterValue) => {
    const changes = getChanges(item);
    dispatch(setFilterSelectedValues(changes));
    dispatch(newSearchAll());
  };

  return (
    <Filter
      {...props}
      testId="koulutusalat-filter"
      name={t('haku.koulutusalat')}
      values={values}
      handleCheck={handleCheck}
    />
  );
};
