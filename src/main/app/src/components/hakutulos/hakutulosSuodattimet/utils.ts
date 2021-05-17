import { FilterValue } from './SuodatinTypes';

const addIfNotExists = (
  retVal: Record<string, Array<string>>,
  { filterId, id }: FilterValue
) =>
  retVal[filterId]?.includes(id)
    ? retVal
    : (retVal[filterId] = (retVal[filterId] ?? []).concat(id));

const removeIfExists = (
  retVal: Record<string, Array<string>>,
  { filterId, id }: FilterValue
) =>
  retVal[filterId]?.includes(id)
    ? (retVal[filterId] = retVal[filterId].filter((v) => v !== id))
    : retVal;

const getCheckedValues = (values: Array<FilterValue>) =>
  values
    .map((v) => [v, ...(v.alakoodit ?? [])])
    .flat()
    .reduce(
      (a, { checked, filterId, id }) =>
        checked ? { ...a, [filterId]: (a[filterId] || []).concat(id) } : a,
      {} as Record<string, Array<string>>
    );

// NOTE: values voi sisältää arvoja useasta eri rajaimesta e.g. ylakoodi on filterId: 'id1' ja sen alakoodit filterId: 'id2'
export const getFilterStateChanges = (values: Array<FilterValue>) => (
  item: FilterValue
) => {
  const retVal = getCheckedValues(values);
  const isYlakoodi = values.some((v) => v.id === item.id);
  const koodiFn = item.checked ? removeIfExists : addIfNotExists;

  koodiFn(retVal, item);

  if (isYlakoodi) {
    // Jos koodilla oli alakoodeja, täytyy ne myös poistaa / lisätä
    item.alakoodit?.forEach((alakoodi) => koodiFn(retVal, alakoodi));
    return retVal;
  } else {
    // Koodi oli alakoodi -> Etsitään yläkoodi ja muut alakoodit
    const ylakoodi = values.find((v) =>
      v.alakoodit?.some((alakoodi) => alakoodi.id === item.id)
    )!;

    // Jos alakoodivalinnan jälkeen kaikki alakoodit on valittu, myös yläkoodikin täytyy asettaa valituksi
    const allAlakooditWillBeSelected = ylakoodi.alakoodit!.every((v) =>
      v.id !== item.id ? v.checked : !v.checked
    );

    const ylakoodiFn = allAlakooditWillBeSelected ? addIfNotExists : removeIfExists;
    ylakoodiFn(retVal, ylakoodi);
  }

  return retVal;
};
