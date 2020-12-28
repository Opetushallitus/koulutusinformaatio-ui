import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Filter } from '#/src/components/hakutulos/hakutulosSuodattimet/Filter';
import {
  ElasticTuple,
  OpetuskieliFilterProps,
  SuodatinProps,
} from '#/src/components/hakutulos/hakutulosSuodattimet/SuodatinTypes';
import { getOpetuskieliFilterProps } from '#/src/store/reducers/hakutulosSliceSelector';
import { Translateable } from '#/src/types/common';
import { Localizer as l } from '#/src/tools/Utils';

type Props = {
  handleFilterChange: (newFilters: object) => void;
  sortedValues?: Record<string, { nimi: Translateable; count: number }>;
} & SuodatinProps;

const getShownStr = (values: Array<{ name: Translateable }>) =>
  values.map((v) => l.localize(v.name)).join(',');

export const OpetuskieliSuodatin = (props: Props) => {
  const { handleFilterChange, sortedValues = {} } = props;
  const { checkedOpetuskielet }: OpetuskieliFilterProps = useSelector(
    getOpetuskieliFilterProps
  );

  const [checkedValues, setCheckedValues] = useState(checkedOpetuskielet);
  const checkedStr = useMemo(() => getShownStr(checkedValues), [checkedValues]);

  const handleCheck = useCallback(
    ([id, { nimi }]: ElasticTuple) => () => {
      const wasChecked = checkedValues.some((v) => v.id === id);
      const newCheckedOpetuskielet = wasChecked
        ? checkedValues.filter((v) => v.id !== id)
        : [...checkedValues, { id, name: nimi }];

      setCheckedValues(newCheckedOpetuskielet);
      handleFilterChange({ opetuskieli: newCheckedOpetuskielet });
    },
    [checkedValues, handleFilterChange]
  );

  // NOTE: Haku filters use tupled values
  const tupledSortedValues = useMemo(() => Object.entries(sortedValues), [sortedValues]);

  return (
    <Filter
      {...props}
      sortedFilterValues={tupledSortedValues}
      handleCheck={handleCheck}
      checkedStr={checkedStr}
      checkedValues={checkedValues}
      displaySelected
    />
  );
};
