import { Localizer as l } from '#/src/tools/Utils';
import { Koodi, Translateable } from '#/src/types/common';
import { format } from 'date-fns';
import { TFunction } from 'i18next';

enum Alkamiskausityyppi {
  TARKKA_ALKAMISAJANKOHTA = 'tarkka alkamisajankohta',
  ALKAMISKAUSI_JA_VUOSI = 'alkamiskausi ja -vuosi',
  HENKILOKOHTAINEN_SUUNNITELMA = 'henkilokohtainen suunnitelma',
}

type Props = {
  alkamiskausityyppi?: Alkamiskausityyppi;
  henkilokohtaisenSuunnitelmanLisatiedot: Translateable;
  koulutuksenAlkamiskausi: Koodi;
  koulutuksenAlkamisvuosi: string;
  koulutuksenAlkamispaivamaara: string;
  koulutuksenPaattymispaivamaara: string;
};

export const formatAloitus = (
  {
    alkamiskausityyppi,
    henkilokohtaisenSuunnitelmanLisatiedot,
    koulutuksenAlkamiskausi,
    koulutuksenAlkamisvuosi,
    koulutuksenAlkamispaivamaara,
    koulutuksenPaattymispaivamaara,
  }: Props = {} as Props,
  t: TFunction
) => {
  switch (alkamiskausityyppi) {
    case Alkamiskausityyppi.HENKILOKOHTAINEN_SUUNNITELMA:
      return {
        alkaaText: t('toteutus.koulutus-alkaa-henkilokohtainen'),
        alkaaModalText: henkilokohtaisenSuunnitelmanLisatiedot,
      };
    case Alkamiskausityyppi.TARKKA_ALKAMISAJANKOHTA:
      return {
        alkaaText: format(new Date(koulutuksenAlkamispaivamaara), 'd.M.y'),
        paattyyText: format(new Date(koulutuksenPaattymispaivamaara), 'd.M.y'),
      };
    case Alkamiskausityyppi.ALKAMISKAUSI_JA_VUOSI:
      return {
        alkaaText: [l.localize(koulutuksenAlkamiskausi), koulutuksenAlkamisvuosi].join(
          ' '
        ),
      };
    default:
      return {};
  }
};
