import { Translateable } from '#/src/types/common';

export type SuodatinComponentProps = {
  expanded?: boolean;
  elevation?: number;
  displaySelected?: boolean;
  summaryHidden?: boolean;
};

// TODO: Refactor this tuple as filtertype in state
export type ElasticTuple = [string, { count: number; nimi: Translateable }];

export type FilterValue = {
  id: string;
  filterId: string;
  nimi: Translateable | string; // Can be pretranslated too
  checked: boolean;
  count: number;
  alakoodit?: Array<FilterValue>;
  indeterminate?: boolean;
  intended?: boolean;
};

// General type for all filters // TODO: Make every filter use this
export type FilterProps = {
  values: Array<FilterValue>;
  localizedCheckedValues: string; // Concatenated for mobile
};

export type OpetuskieliFilterProps = {
  checkedOpetuskielet: Array<FilterValue>;
  checkedOpetuskieletStr: string;
  sortedOpetuskielet: Array<ElasticTuple>;
};

export type SijaintiFilterProps = {
  checkedMaakunnat: Array<FilterValue>;
  selectedSijainnit: Array<FilterValue>;
};
