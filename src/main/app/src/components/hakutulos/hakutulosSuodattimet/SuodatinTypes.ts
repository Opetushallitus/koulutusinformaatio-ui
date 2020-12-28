import { Translateable } from '#/src/types/common';

export type SuodatinProps = {
  expanded?: boolean;
  elevation?: number;
  displaySelected?: boolean;
  summaryHidden?: boolean;
};

export type ElasticTuple = [string, { count: number; nimi: Translateable }];

export type CheckedFilter = {
  id: string;
  name: Translateable;
};

export type OpetuskieliFilterProps = {
  checkedOpetuskielet: CheckedFilter[];
  checkedOpetuskieletStr: string;
  sortedOpetuskielet: ElasticTuple[];
};
