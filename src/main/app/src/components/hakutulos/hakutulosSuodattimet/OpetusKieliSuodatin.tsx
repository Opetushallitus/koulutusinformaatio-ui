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

const OPETUSKIELI_FILTER_ID = 'opetuskieli';
const opetuskieliSelector = getFilterProps(OPETUSKIELI_FILTER_ID);

export const OpetuskieliSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { values, localizedCheckedValues } = useSelector<any, FilterProps>(
    opetuskieliSelector
  );

  const handleCheck = (item: FilterValue) => {
    dispatch(handleFilterOperations([{ item, operation: 'TOGGLE' }]));
    dispatch(newSearchAll());
  };

  return (
    <Filter
      {...props}
      name={t('haku.opetuskieli')}
      values={values}
      handleCheck={handleCheck}
      checkedStr={localizedCheckedValues}
    />
  );
};
