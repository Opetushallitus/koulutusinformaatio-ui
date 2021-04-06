import { Translateable } from '#/src/types/common';

export type SisaltoTeksti = {
  tyyppi: 'teksti';
  data: Translateable;
};

export type SisaltoTaulukko = {
  tyyppi: 'taulukko';
  data: {
    nimi: Translateable; // NOTE: Prolly obsolete
    rows: Array<{
      index: number;
      isHeader: boolean;
      columns: Array<{
        index: number;
        text: Translateable;
      }>;
    }>;
  };
};

export type Sisalto = Array<SisaltoTeksti | SisaltoTaulukko>;

export type Valintatapa = {
  enimmaispisteet?: number;
  kynnysehto?: Translateable;
  nimi: Translateable;
  sisalto: Sisalto;
  vahimmaispisteet?: number;
};
