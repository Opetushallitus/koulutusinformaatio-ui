import { Koodi, Osoite, Translateable } from './common';

type Yhteystiedot = {
  osoite: Osoite;
  sahkoposti: string;
  puhelinnumero: string;
};

export type Liite = {
  id: string;
  kuvaus: Translateable;
  nimi: Translateable;
  toimitusaika: string;
  toimitustapa: string;
  toimitusosoite: Yhteystiedot;
  tyyppi: Koodi;
};
