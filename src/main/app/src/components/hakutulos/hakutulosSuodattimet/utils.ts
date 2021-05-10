import { FilterValue } from './SuodatinTypes';

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
