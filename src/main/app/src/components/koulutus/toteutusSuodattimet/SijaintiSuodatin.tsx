import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/hakutulos/hakutulosSuodattimet/Filter';
import {
  FilterValue,
  SuodatinComponentProps,
} from '#/src/components/hakutulos/hakutulosSuodattimet/SuodatinTypes';
import { FILTER_TYPES } from '#/src/constants';

import { getOptionsForSelect } from './utils';

type Props = {
  handleFilterChange: (newFilters: object) => void;
  initialMaakunnat: Array<string>;
  initialKunnat: Array<string>;
  sortedMaakunnat: Array<FilterValue>;
  sortedKunnat: Array<FilterValue>;
} & SuodatinComponentProps;

export const SijaintiSuodatin = (props: Props) => {
  const { t } = useTranslation();
  const {
    handleFilterChange,
    initialMaakunnat = [],
    initialKunnat = [],
    sortedMaakunnat = [],
    sortedKunnat = [],
    ...rest
  } = props;

  const [checkedMaakunnat, setCheckedMaakunnat] = useState(initialMaakunnat);
  const [checkedKunnat, setCheckedKunnat] = useState(initialKunnat);
  useEffect(() => {
    setCheckedMaakunnat(initialMaakunnat);
    setCheckedKunnat(initialKunnat);
  }, [initialMaakunnat, initialKunnat]);

  const handleCheck = useCallback(
    (value: FilterValue) => {
      const isMaakunta = value.filterId === FILTER_TYPES.MAAKUNTA;
      const checkedValues = isMaakunta ? checkedMaakunnat : checkedKunnat;
      const wasChecked = checkedValues.some((id) => id === value.id);
      const newCheckedValues = wasChecked
        ? checkedValues.filter((id) => id !== value.id)
        : [...checkedValues, value.id];

      const usedSetter = isMaakunta ? setCheckedMaakunnat : setCheckedKunnat;
      usedSetter(newCheckedValues);
      handleFilterChange({ [value.filterId]: newCheckedValues });
    },
    [checkedMaakunnat, checkedKunnat, handleFilterChange]
  );

  const groupedSijainnit = useMemo(
    () => [
      {
        label: t('haku.maakunnat'),
        options: getOptionsForSelect(sortedMaakunnat, checkedMaakunnat),
      },
      {
        label: t('haku.kaupungit-tai-kunnat'),
        options: getOptionsForSelect(sortedKunnat, checkedKunnat),
      },
    ],
    [checkedMaakunnat, checkedKunnat, sortedMaakunnat, sortedKunnat, t]
  );

  const usedValues = sortedMaakunnat.map((v) => ({
    ...v,
    checked: checkedMaakunnat.some((id) => v.id === id),
  }));

  return (
    <Filter
      options={groupedSijainnit}
      selectPlaceholder={t('haku.etsi')}
      name={t('haku.sijainti')}
      values={usedValues}
      handleCheck={handleCheck}
      displaySelected
      {...rest}
    />
  );
};
