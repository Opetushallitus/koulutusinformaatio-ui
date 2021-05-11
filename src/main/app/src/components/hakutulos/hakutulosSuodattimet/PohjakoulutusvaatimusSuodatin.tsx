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

const FILTER_ID = 'pohjakoulutusvaatimus';
const filterSelector = getFilterProps(FILTER_ID);

// TODO: Do not use this component until backend supports filtering pohjakoulutusvaatimus with KOMO järjestäjät
export const PohjakoulutusvaatimusSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { values } = useSelector<any, FilterProps>(filterSelector);

  const handleCheck = (item: FilterValue) => {
    dispatch(handleFilterOperations([{ item, operation: 'TOGGLE' }]));
    dispatch(newSearchAll());
  };

  return (
    <Filter
      {...props}
      testId="pohjakoulutusvaatimus-filter"
      name={t('haku.pohjakoulutusvaatimus')}
      values={values}
      handleCheck={handleCheck}
    />
  );
};
