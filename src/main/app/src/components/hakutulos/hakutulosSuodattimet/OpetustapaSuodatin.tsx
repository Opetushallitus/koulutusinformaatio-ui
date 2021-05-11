import React from 'react';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { FILTER_TYPES } from '#/src/constants';
import {
  handleFilterOperations,
  newSearchAll,
} from '#/src/store/reducers/hakutulosSlice';
import { getFilterProps } from '#/src/store/reducers/hakutulosSliceSelector';

import { Filter } from './Filter';
import { FilterProps, FilterValue, SuodatinComponentProps } from './SuodatinTypes';

const opetustapaSelector = getFilterProps(FILTER_TYPES.OPETUSTAPA);

export const OpetustapaSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { values } = useSelector<any, FilterProps>(opetustapaSelector);

  const handleCheck = (item: FilterValue) => {
    dispatch(handleFilterOperations([{ item, operation: 'TOGGLE' }]));
    dispatch(newSearchAll());
  };

  return (
    <Filter
      {...props}
      name={t('haku.opetustapa')}
      values={values}
      handleCheck={handleCheck}
    />
  );
};
