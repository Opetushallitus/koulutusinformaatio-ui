import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { FILTER_TYPES } from '#/src/constants';
import {
  handleFilterOperations,
  newSearchAll,
} from '#/src/store/reducers/hakutulosSlice';
import {
  getFilterProps,
  hakukaynnissaSelector,
} from '#/src/store/reducers/hakutulosSliceSelector';

import { Filter } from './Filter';
import { FilterProps, FilterValue, SuodatinComponentProps } from './SuodatinTypes';
import { getFilterStateChanges } from './utils';

const YHTEISHAKU_KOODI_URI = 'hakutapa_01';
const hakutapaFilterSelector = getFilterProps(FILTER_TYPES.HAKUTAPA);
const yhteishakuFilterSelector = getFilterProps(FILTER_TYPES.YHTEISHAKU);

// NOTE: Hakutapa sisältää hakukaynnissa ja yhteishaku suodattimet -> tämä komponentti hoitaa yhdistelylogiikan
export const HakutapaSuodatin = (props: SuodatinComponentProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { hakukaynnissaData, hakukaynnissa } = useSelector(hakukaynnissaSelector());
  const { values } = useSelector<any, FilterProps>(hakutapaFilterSelector);
  const { values: yhteishakuValues } = useSelector<any, FilterProps>(
    yhteishakuFilterSelector
  );
  const mergedValues = values.map((v) =>
    v.id === YHTEISHAKU_KOODI_URI ? { ...v, alakoodit: yhteishakuValues } : v
  );

  const filterValues = useMemo(() => {
    if (mergedValues?.length === 0) {
      return []; // Piilota hakukaynnissa -rajain jos muita arvoja ei ole löytynyt
    }

    return [
      {
        id: FILTER_TYPES.HAKUKAYNNISSA,
        filterId: FILTER_TYPES.HAKUKAYNNISSA,
        nimi: t('haku.hakukaynnissa'),
        count: hakukaynnissaData?.count,
        checked: hakukaynnissa,
      },
      ...mergedValues,
    ];
  }, [hakukaynnissa, mergedValues, t, hakukaynnissaData]);

  const handleCheck = (item: FilterValue) => {
    if (item.filterId === FILTER_TYPES.HAKUKAYNNISSA) {
      dispatch(handleFilterOperations([{ item }]));
    } else {
      const operations = getFilterStateChanges(mergedValues)(item);
      dispatch(handleFilterOperations(operations));
    }
    dispatch(newSearchAll());
  };

  return (
    <Filter
      {...props}
      testId="hakutapa-filter"
      name={t('haku.hakutapa')}
      values={filterValues}
      handleCheck={handleCheck}
    />
  );
};
