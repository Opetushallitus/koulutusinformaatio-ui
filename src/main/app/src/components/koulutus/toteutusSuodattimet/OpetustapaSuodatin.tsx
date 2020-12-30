import { Filter } from '#/src/components/hakutulos/hakutulosSuodattimet/Filter';
import { FilterType } from '#/src/components/hakutulos/hakutulosSuodattimet/SuodatinTypes';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getShownStr } from './utils';

type Props = {
  handleFilterChange: (newFilters: object) => void;
  initialValues: FilterType[];
  sortedValues: FilterType[];
};

export const OpetustapaSuodatin = (props: Props) => {
  const { t } = useTranslation();
  const { handleFilterChange, initialValues = [], sortedValues = [] } = props;

  const [checkedValues, setCheckedValues] = useState(initialValues);
  const checkedStr = useMemo(() => getShownStr(checkedValues), [checkedValues]);

  const handleCheck = useCallback(
    (value: FilterType) => {
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

  return (
    <Filter
      name={t('haku.opetustapa')}
      sortedFilterValues={sortedValues}
      handleCheck={handleCheck}
      checkedStr={checkedStr}
      checkedValues={checkedValues}
      displaySelected
    />
  );
};
