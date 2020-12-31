import { Filter } from '#/src/components/hakutulos/hakutulosSuodattimet/Filter';
import {
  FilterType,
  SuodatinProps,
} from '#/src/components/hakutulos/hakutulosSuodattimet/SuodatinTypes';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getShownStr } from './utils';

type Props = {
  handleFilterChange: (newFilters: object) => void;
  initialValues: FilterType[];
  sortedValues: FilterType[];
} & SuodatinProps;

export const OpetuskieliSuodatin = (props: Props) => {
  const { t } = useTranslation();
  const { handleFilterChange, initialValues = [], sortedValues = [], ...rest } = props;

  const [checkedValues, setCheckedValues] = useState(initialValues);
  useEffect(() => {
    setCheckedValues(initialValues);
  }, [initialValues]);
  const checkedStr = useMemo(() => getShownStr(checkedValues), [checkedValues]);

  const handleCheck = useCallback(
    (value: FilterType) => {
      const { id } = value;
      const wasChecked = checkedValues.some((v) => v.id === id);
      const newCheckedValues = wasChecked
        ? checkedValues.filter((v) => v.id !== id)
        : [...checkedValues, value];

      setCheckedValues(newCheckedValues);
      handleFilterChange({ opetuskieli: newCheckedValues });
    },
    [checkedValues, handleFilterChange]
  );

  return (
    <Filter
      name={t('haku.opetuskieli')}
      sortedFilterValues={sortedValues}
      handleCheck={handleCheck}
      checkedStr={checkedStr}
      checkedValues={checkedValues}
      displaySelected
      {...rest}
    />
  );
};
