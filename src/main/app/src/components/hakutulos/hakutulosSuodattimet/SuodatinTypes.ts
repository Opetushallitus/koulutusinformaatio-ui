import { Translateable } from '#/src/types/common';

export type SuodatinComponentProps = {
  expanded?: boolean;
  elevation?: number;
  displaySelected?: boolean;
  summaryHidden?: boolean;
  defaultExpandAlakoodit?: boolean;
};

export type FilterValue = {
  id: string;
  filterId: string;
  nimi: Translateable | string; // Can be pretranslated too
  checked: boolean;
  count: number;
  alakoodit?: Array<FilterValue>;
};

// General type for all filters // TODO: Make every filter use this
export type FilterProps = {
  values: Array<FilterValue>;
  localizedCheckedValues: string; // Concatenated for mobile
};
