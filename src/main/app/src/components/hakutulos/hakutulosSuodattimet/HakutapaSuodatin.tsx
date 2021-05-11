import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import {
  handleFilterOperations,
  toggleHakukaynnissa,
  newSearchAll,
} from '#/src/store/reducers/hakutulosSlice';
import {
  getFilterProps,
  hakukaynnissaSelector,
} from '#/src/store/reducers/hakutulosSliceSelector';

import { Filter } from './Filter';
import { FilterProps, FilterValue, SuodatinComponentProps } from './SuodatinTypes';
import { getFilterStateChanges } from './utils';

const HAKUTAPA_FILTER_ID = 'hakutapa';
const HAKUKAYNNISSA_ID = 'hakukaynnissa';
const YHTEISHAKU_FILTER_ID = 'yhteishaku';
const YHTEISHAKU_KOODI_URI = 'hakutapa_01';
const hakutapaFilterSelector = getFilterProps(HAKUTAPA_FILTER_ID);
const yhteishakuFilterSelector = getFilterProps(YHTEISHAKU_FILTER_ID);

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
        id: HAKUKAYNNISSA_ID,
        filterId: HAKUKAYNNISSA_ID,
        nimi: t('haku.hakukaynnissa'),
        count: hakukaynnissaData?.count,
        checked: hakukaynnissa,
      },
      ...mergedValues,
    ];
  }, [hakukaynnissa, mergedValues, t, hakukaynnissaData]);

  const handleCheck = (item: FilterValue) => {
    if (item.id === HAKUKAYNNISSA_ID) {
      dispatch(toggleHakukaynnissa());
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
