export type Translateable = { fi?: string; sv?: string; en?: string };
export type Koodi = { koodiUri: string; nimi: Translateable };

export type Osoite = {
  osoite: Translateable;
  postinumero: Koodi;
};

export type Yhteystiedot = {
  osoite: Osoite;
  // TODO: Not sure if sahkoposti and puhelinnumero should be Translateable, but it comes as string with Liitteet? And as Translateable from oppilaitos
  sahkoposti: string;
  puhelinnumero: string;
  wwwSivu: Translateable;
};

// Utils
export type TODOType = any; // NOTE: Just a temporary type for documenting not-yet-typed stuff until everything is typed
export type ValueOf<T> = T[keyof T];
