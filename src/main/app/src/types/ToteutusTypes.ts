import { Koodi, Translateable, TODOType, ValueOf } from './common';
import { KOULUTUS_TYYPPI } from '#/src/constants';

type KoulutusTyyppi = ValueOf<typeof KOULUTUS_TYYPPI>;

export type Jarjestaja = {
  koulutustyyppi: KoulutusTyyppi;
  kunnat: Koodi[];
  kuva: string;
  kuvaus: Translateable;
  maksunMaara: TODOType;
  nimi: Translateable;
  onkoMaksullinen: boolean;
  opetusajat: Koodi[];
  oppilaitosOid: string;
  oppilaitosTila: string; // TODO: string union type, e.g. "julkaistu" | jne
  toteutusOid: string;
  toteutusNimi: string;
  tutkintonimikkeet: TODOType;
};
