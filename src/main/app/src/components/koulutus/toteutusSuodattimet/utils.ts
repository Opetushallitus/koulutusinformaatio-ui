import { localize } from '#/src/tools/localization';

import { FilterValue } from '../../hakutulos/hakutulosSuodattimet/SuodatinTypes';

export const getShownStr = (values: Array<any>) =>
  values.map((v) => localize(v)).join(',');

const isChecked = (arr: Array<any>, id: any) => arr.some((o) => o.id === id);

export const getOptionsForSelect = (
  arr: Array<FilterValue>,
  checkedValues: Array<FilterValue>
) =>
  arr
    .filter(({ count }) => count > 0)
    .map(({ id, nimi, count }) => ({
      id,
      nimi,
      label: localize(nimi) + ` (${count})`,
      checked: isChecked(checkedValues, id),
    }));
