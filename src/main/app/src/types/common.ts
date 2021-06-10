export type Translateable = { fi?: string; sv?: string; en?: string };
export type Koodi = { koodiUri: string; nimi: Translateable };

export type Osoite = {
  osoite: Translateable;
  postinumero: Koodi;
};

export type Yhteystiedot = {
  nimi: Translateable;
  postiosoite?: Osoite;
  kayntiosoite?: Osoite;
  sahkoposti?: Translateable;
  puhelinnumero?: Translateable;
};

export enum Alkamiskausityyppi {
  TARKKA_ALKAMISAJANKOHTA = 'tarkka alkamisajankohta',
  ALKAMISKAUSI_JA_VUOSI = 'alkamiskausi ja -vuosi',
  HENKILOKOHTAINEN_SUUNNITELMA = 'henkilokohtainen suunnitelma',
}

export type Alkamiskausi = {
  alkamiskausityyppi?: Alkamiskausityyppi;
  henkilokohtaisenSuunnitelmanLisatiedot: Translateable;
  koulutuksenAlkamiskausi: Koodi;
  koulutuksenAlkamisvuosi: string;
  koulutuksenAlkamispaivamaara: string;
  koulutuksenPaattymispaivamaara: string;
};

// Utils
export type TODOType = any; // NOTE: Just a temporary type for documenting not-yet-typed stuff until everything is typed
export type ValueOf<T> = T[keyof T];
