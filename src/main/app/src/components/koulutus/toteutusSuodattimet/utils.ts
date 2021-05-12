import { localize } from '#/src/tools/localization';

import { FilterValue } from '../../hakutulos/hakutulosSuodattimet/SuodatinTypes';

export const getShownStr = (values: Array<any>) =>
  values.map((v) => localize(v)).join(',');

export const getSelectOption = (value: FilterValue, isMaakunta: boolean) => ({
  ...value,
  label: `${localize(value)} (${value.count})`,
  value: localize(value),
  isMaakunta,
  name: value.nimi,
});
