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
  nimi: Translateable | string; // Koodistoille tulee nimi, muuten käännetään käsin suoraan
  checked: boolean;
  count: number;
  alakoodit?: Array<FilterValue>;
  hidden?: boolean; // Jotkut rajaimet eivät näytä kaikkia arvoja kerralla (koulutustyyppi), mutta kaikki arvot tarvitaan
};

// General type for all filters
export type FilterProps = {
  values: Array<FilterValue>;
};
