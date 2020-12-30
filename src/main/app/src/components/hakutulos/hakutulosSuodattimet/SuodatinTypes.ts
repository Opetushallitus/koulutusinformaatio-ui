import { Translateable } from '#/src/types/common';

export type SuodatinProps = {
  expanded?: boolean;
  elevation?: number;
  displaySelected?: boolean;
  summaryHidden?: boolean;
};

// TODO: Refactor this tuple as filtertype in state
export type ElasticTuple = [string, { count: number; nimi: Translateable }];

export type FilterType = {
  id: string;
  nimi: Translateable;
  count: number;
};

export type OpetuskieliFilterProps = {
  checkedOpetuskielet: FilterType[];
  checkedOpetuskieletStr: string;
  sortedOpetuskielet: ElasticTuple[];
};

export type SijaintiFilterProps = {
  checkedMaakunnat: FilterType[];
  selectedSijainnit: FilterType[];
};
