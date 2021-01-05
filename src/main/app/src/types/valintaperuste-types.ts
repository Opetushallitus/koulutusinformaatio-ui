import { Koodi, Translateable, Yhteystiedot } from './common';

export type Liite = {
  id: string;
  kuvaus: Translateable;
  nimi: Translateable;
  toimitusaika: string;
  toimitustapa: string;
  toimitusosoite: Yhteystiedot;
  tyyppi: Koodi;
};
