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
  checked: boolean;
  count: number;
  nimi?: Translateable;
  alakoodit?: Array<Omit<FilterValue, 'alakoodit'>>;
  hidden?: boolean; // Jotkut rajaimet eivät näytä kaikkia arvoja kerralla (koulutustyyppi), mutta kaikki arvot tarvitaan
};

export type FilterProps = Array<FilterValue>;
