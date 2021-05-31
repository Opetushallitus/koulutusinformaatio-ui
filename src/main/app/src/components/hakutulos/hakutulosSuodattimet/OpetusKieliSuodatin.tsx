import React from 'react';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Filter } from '#/src/components/common/Filter';
import { FILTER_TYPES } from '#/src/constants';
import {
  setFilterSelectedValues,
  newSearchAll,
} from '#/src/store/reducers/hakutulosSlice';
import { getFilterProps } from '#/src/store/reducers/hakutulosSliceSelector';
import {
  FilterProps,
  FilterValue,
  SuodatinComponentProps,
} from '#/src/types/SuodatinTypes';

import { getFilterStateChanges } from './utils';

const opetuskieliSelector = getFilterProps(FILTER_TYPES.OPETUSKIELI);

export const OpetuskieliSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const values = useSelector<any, FilterProps>(opetuskieliSelector);

  const handleCheck = (item: FilterValue) => {
    const changes = getFilterStateChanges(values)(item);
    dispatch(setFilterSelectedValues(changes));
    dispatch(newSearchAll());
  };

  return (
    <Filter
      {...props}
      name={t('haku.opetuskieli')}
      values={values}
      handleCheck={handleCheck}
    />
  );
};
