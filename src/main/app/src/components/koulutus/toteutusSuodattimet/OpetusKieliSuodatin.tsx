import React from 'react';

import { useTranslation } from 'react-i18next';

import { Filter } from '#/src/components/hakutulos/hakutulosSuodattimet/Filter';
import {
  FilterValue,
  SuodatinComponentProps,
} from '#/src/components/hakutulos/hakutulosSuodattimet/SuodatinTypes';

type Props = {
  handleFilterChange: (value: FilterValue) => void;
  values: Array<FilterValue>;
} & SuodatinComponentProps;

export const OpetuskieliSuodatin = (props: Props) => {
  const { t } = useTranslation();
  const { handleFilterChange, values = [], ...rest } = props;

  return (
    <Filter
      name={t('haku.opetuskieli')}
      values={values}
      handleCheck={handleFilterChange}
      displaySelected
      {...rest}
    />
  );
};
