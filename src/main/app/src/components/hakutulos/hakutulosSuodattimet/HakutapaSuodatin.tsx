import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import {
  handleFilterToggle,
  toggleHakukaynnissa,
  newSearchAll,
} from '#/src/store/reducers/hakutulosSlice';
import {
  getFilterProps,
  hakukaynnissaSelector,
} from '#/src/store/reducers/hakutulosSliceSelector';

import { Filter } from './Filter';
import { FilterProps, FilterType, SuodatinComponentProps } from './SuodatinTypes';

const FILTER_ID = 'hakutapa';
const HAKUKAYNNISSA_ID = 'hakukaynnissa';
const filterSelector = getFilterProps(FILTER_ID);

// NOTE: Hakutapa includes hakukaynnissa filter so this component handles mishmashing the logics together
export const HakutapaSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { sortedValues, checkedValues, localizedCheckedValues } = useSelector<
    any,
    FilterProps
  >(filterSelector);

  const { hakukaynnissaData, hakukaynnissa } = useSelector(hakukaynnissaSelector());

  const sortedValuesWithHakukaynnissa = useMemo(
    () =>
      sortedValues?.length > 0 // Do not show hakukaynnissa if no other haku values are found (loading)
        ? [
            {
              id: HAKUKAYNNISSA_ID,
              nimi: t('haku.hakukaynnissa'),
              count: hakukaynnissaData?.count,
            },
            ...sortedValues,
          ]
        : [],
    [sortedValues, t, hakukaynnissaData]
  );

  const checkedValuesWithHakukaynnissa = useMemo(
    () => (hakukaynnissa ? [{ id: HAKUKAYNNISSA_ID }, ...checkedValues] : checkedValues),
    [checkedValues, hakukaynnissa]
  );

  const localizedCheckedValuesWithHakukaynnissa = useMemo(
    () =>
      hakukaynnissa
        ? [t('haku.hakukaynnissa'), localizedCheckedValues].filter(Boolean).join(', ')
        : localizedCheckedValues,
    [localizedCheckedValues, hakukaynnissa, t]
  );

  const handleCheck = (item: FilterType) => {
    if (item.id === HAKUKAYNNISSA_ID) {
      dispatch(toggleHakukaynnissa());
    } else {
      dispatch(handleFilterToggle({ filter: FILTER_ID, item }));
    }
    dispatch(newSearchAll());
  };

  return (
    <Filter
      {...props}
      testId="hakutapa-filter"
      name={t('haku.hakutapa')}
      sortedFilterValues={sortedValuesWithHakukaynnissa}
      handleCheck={handleCheck}
      checkedStr={localizedCheckedValuesWithHakukaynnissa}
      checkedValues={checkedValuesWithHakukaynnissa}
    />
  );
};
