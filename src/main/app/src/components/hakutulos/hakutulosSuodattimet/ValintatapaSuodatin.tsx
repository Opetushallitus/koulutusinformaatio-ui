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
import { getFilterStateChanges } from '#/src/tools/filters';
import {
  FilterProps,
  FilterValue,
  SuodatinComponentProps,
} from '#/src/types/SuodatinTypes';

const filterSelector = getFilterProps(FILTER_TYPES.VALINTATAPA);

// TODO: Do not use this component until backend supports filtering no-haku-kaynnissa for valintatavat
export const ValintatapaSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const values = useSelector<any, FilterProps>(filterSelector);

  const handleCheck = (item: FilterValue) => {
    const changes = getFilterStateChanges(values)(item);
    dispatch(setFilterSelectedValues(changes));
    dispatch(newSearchAll());
  };

  return (
    <Filter
      {...props}
      testId="valintatapa-filter"
      name={t('haku.valintatapa')}
      values={values}
      handleCheck={handleCheck}
    />
  );
};
