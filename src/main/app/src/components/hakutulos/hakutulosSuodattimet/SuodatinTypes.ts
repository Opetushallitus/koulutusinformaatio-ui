import { Translateable } from '#/src/types/common';

export type SuodatinComponentProps = {
  expanded?: boolean;
  elevation?: number;
  displaySelected?: boolean;
  summaryHidden?: boolean;
};

// TODO: Refactor this tuple as filtertype in state
export type ElasticTuple = [string, { count: number; nimi: Translateable }];

export type FilterType = {
  id: string;
  nimi: Translateable | string; // Can be pretranslated too
  count: number;
};

// General type for all filters // TODO: Make every filter use this
export type FilterProps = {
  checkedValues: Array<FilterType>;
  sortedValues: Array<FilterType>;
  localizedCheckedValues: string; // Concatenated for mobile
};

export type OpetuskieliFilterProps = {
  checkedOpetuskielet: Array<FilterType>;
  checkedOpetuskieletStr: string;
  sortedOpetuskielet: Array<ElasticTuple>;
};

export type SijaintiFilterProps = {
  checkedMaakunnat: Array<FilterType>;
  selectedSijainnit: Array<FilterType>;
};
