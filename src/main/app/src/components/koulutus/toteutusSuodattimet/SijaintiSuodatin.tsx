import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Filter } from '#/src/components/hakutulos/hakutulosSuodattimet/Filter';
import {
  FilterType,
  SuodatinProps,
} from '#/src/components/hakutulos/hakutulosSuodattimet/SuodatinTypes';
import { getOptionsForSelect, getShownStr } from './utils';

type Props = {
  handleFilterChange: (newFilters: object) => void;
  initialValues: Array<FilterType>;
  sortedMaakunnat: Array<FilterType>;
  sortedKunnat: Array<FilterType>;
} & SuodatinProps;

export const SijaintiSuodatin = (props: Props) => {
  const { t } = useTranslation();
  const {
    handleFilterChange,
    initialValues = [],
    sortedMaakunnat = [],
    sortedKunnat = [],
    ...rest
  } = props;

  const [checkedValues, setCheckedValues] = useState(initialValues);
  useEffect(() => {
    setCheckedValues(initialValues);
  }, [initialValues]);

  const checkedStr = useMemo(() => getShownStr(checkedValues), [checkedValues]);

  const handleCheck = useCallback(
    (value: FilterType) => {
      const wasChecked = checkedValues.some((v) => v.id === value.id);
      const newCheckedValues = wasChecked
        ? checkedValues.filter((v) => v.id !== value.id)
        : [...checkedValues, value];

      setCheckedValues(newCheckedValues);
      handleFilterChange({ sijainti: newCheckedValues });
    },
    [checkedValues, handleFilterChange]
  );

  const groupedSijainnit = useMemo(
    () => [
      {
        label: t('haku.maakunnat'),
        options: getOptionsForSelect(sortedMaakunnat, checkedValues),
      },
      {
        label: t('haku.kaupungit-tai-kunnat'),
        options: getOptionsForSelect(sortedKunnat, checkedValues),
      },
    ],
    [checkedValues, sortedMaakunnat, sortedKunnat, t]
  );

  return (
    <Filter
      options={groupedSijainnit}
      selectPlaceholder={t('haku.etsi')}
      name={t('haku.sijainti')}
      sortedFilterValues={sortedMaakunnat}
      handleCheck={handleCheck}
      checkedStr={checkedStr}
      checkedValues={checkedValues}
      displaySelected
      {...rest}
    />
  );
};
