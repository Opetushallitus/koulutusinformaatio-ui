import _fp from 'lodash/fp';

import { FilterValue } from './SuodatinTypes';

// Statesta saadaan arvot kaksitasoisina mutta ne on helpompi rendata flattina
export const flattenCheckboxValues = _fp.flatMap<FilterValue, FilterValue>((v) => {
  if (!v.alakoodit) {
    return v;
  }

  const isValueIndeterminate =
    !v.checked && v.alakoodit.some((alakoodi) => alakoodi.checked);

  return [
    { ...v, indeterminate: isValueIndeterminate },
    ...v.alakoodit.map((alakoodi) => ({ ...alakoodi, intended: true })),
  ];
});

// Alakoodeja sisältävä suodatinvalinta vaatii erityiskäsittelyä
export const getFilterStateChanges = (values: Array<FilterValue>) => (
  item: FilterValue
) => {
  const isYlakoodi = values.some((v) => v.id === item.id);
  if (isYlakoodi) {
    return [
      { item },
      ...(item.alakoodit
        ? item.alakoodit.map((a) => ({
            item: a,
            operation: item.checked ? 'UNSET' : 'SET', // Jos yläkoodi oli valittu, alakooditkin pitää UNSETata
          }))
        : []),
    ];
  }

  // Etsitään alakoodin perusteella yläkoodi ja muut alakoodit
  const ylakoodi = values.find((v) =>
    v.alakoodit?.some((alakoodi) => alakoodi.id === item.id)
  )!;

  // Jos alakoodivalinnan jälkeen kaikki alakoodit on valittu, myös yläkoodikin täytyy asettaa valituksi
  const allAlakooditWillBeSelected = ylakoodi.alakoodit!.every((v) =>
    v.id !== item.id ? v.checked : !v.checked
  );
  return [
    { item },
    {
      item: ylakoodi,
      operation: allAlakooditWillBeSelected ? 'SET' : 'UNSET',
    },
  ];
};
