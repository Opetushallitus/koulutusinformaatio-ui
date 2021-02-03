import { Koodi, Translateable, TODOType, ValueOf } from './common';
import { KOULUTUS_TYYPPI } from '#/src/constants';

type KoulutusTyyppi = ValueOf<typeof KOULUTUS_TYYPPI>;

export type Jarjestaja = {
  koulutustyyppi: KoulutusTyyppi;
  kunnat: Array<Koodi>;
  kuva: string;
  kuvaus: Translateable;
  maksunMaara: TODOType;
  nimi: Translateable;
  onkoMaksullinen: boolean;
  opetusajat: Array<Koodi>;
  oppilaitosOid: string;
  oppilaitosTila: string; // TODO: string union type, e.g. "julkaistu" | jne
  toteutusOid: string;
  toteutusNimi: string;
  tutkintonimikkeet: TODOType;
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

export type Hakukohde = {
  aloituspaikat: string;
  hakuajat: Array<{ alkaa: string; paattyy: string }>;
  hakukohdeOid: string;
  hakulomakeAtaruId: string;
  hakulomakeKuvaus: Translateable;
  hakulomakeLinkki: Translateable;
  hakulomaketyyppi: string;
  isHakuAuki: boolean;
  jarjestyspaikka: { nimi: Translateable; oid: string; paikkakunta: Koodi };
  koulutuksenAlkamiskausi: Alkamiskausi;
  nimi: Translateable;
  pohjakoulutusvaatimus: Array<Koodi>;
  pohjakoulutusvaatimusTarkenne: Translateable;
  valintaperusteId?: string;
};
