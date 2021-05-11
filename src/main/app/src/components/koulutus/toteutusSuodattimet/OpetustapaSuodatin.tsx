import React, { useCallback, useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/hakutulos/hakutulosSuodattimet/Filter';
import {
  FilterValue,
  SuodatinComponentProps,
} from '#/src/components/hakutulos/hakutulosSuodattimet/SuodatinTypes';

type Props = {
  handleFilterChange: (newFilters: object) => void;
  initialValues: Array<FilterValue>;
  sortedValues: Array<FilterValue>;
} & SuodatinComponentProps;

export const OpetustapaSuodatin = (props: Props) => {
  const { t } = useTranslation();
  const { handleFilterChange, initialValues = [], sortedValues = [], ...rest } = props;

  const [checkedValues, setCheckedValues] = useState(initialValues);
  useEffect(() => {
    setCheckedValues(initialValues);
  }, [initialValues]);

  const handleCheck = useCallback(
    (value: FilterValue) => {
      const { id } = value;
      const wasChecked = checkedValues.some((v) => v.id === id);
      const newCheckedValues = wasChecked
        ? checkedValues.filter((v) => v.id !== id)
        : [...checkedValues, value];

      setCheckedValues(newCheckedValues);
      handleFilterChange({ opetustapa: newCheckedValues });
    },
    [checkedValues, handleFilterChange]
  );

  const usedValues = sortedValues.map((v) => ({
    ...v,
    checked: checkedValues.some((checked) => v.id === checked.id),
  }));

  return (
    <Filter
      name={t('haku.opetustapa')}
      values={usedValues}
      handleCheck={handleCheck}
      displaySelected
      {...rest}
    />
  );
};
