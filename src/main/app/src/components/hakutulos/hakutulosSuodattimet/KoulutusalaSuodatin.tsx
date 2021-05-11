import React from 'react';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import {
  handleFilterOperations,
  newSearchAll,
} from '#/src/store/reducers/hakutulosSlice';
import { getFilterProps } from '#/src/store/reducers/hakutulosSliceSelector';

import { Filter } from './Filter';
import { FilterProps, FilterValue, SuodatinComponentProps } from './SuodatinTypes';
import { getFilterStateChanges } from './utils';

const KOULUTUSALA_FILTER_ID = 'koulutusala';
const koulutusalaSelector = getFilterProps(KOULUTUSALA_FILTER_ID);

export const KoulutusalaSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { values } = useSelector<any, FilterProps>(koulutusalaSelector);

  const getOperations = getFilterStateChanges(values);
  const handleCheck = (item: FilterValue) => {
    const operations = getOperations(item);
    dispatch(handleFilterOperations(operations));
    dispatch(newSearchAll());
  };

  return (
    <Filter
      {...props}
      testId="koulutusala-filter"
      name={t('haku.koulutusalat')}
      values={values}
      handleCheck={handleCheck}
    />
  );
};
