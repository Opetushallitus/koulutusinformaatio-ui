import { format } from 'date-fns';
import { TFunction } from 'i18next';

import { Alkamiskausityyppi } from '#/src/constants';
import { localize } from '#/src/tools/localization';
import { Alkamiskausi } from '#/src/types/common';

export const formatAloitus = (
  {
    alkamiskausityyppi,
    henkilokohtaisenSuunnitelmanLisatiedot,
    koulutuksenAlkamiskausi,
    koulutuksenAlkamisvuosi,
    koulutuksenAlkamispaivamaara,
    koulutuksenPaattymispaivamaara,
  }: Alkamiskausi = {} as Alkamiskausi,
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
        paattyyText: koulutuksenPaattymispaivamaara
          ? format(new Date(koulutuksenPaattymispaivamaara), 'd.M.y')
          : null,
      };
    case Alkamiskausityyppi.ALKAMISKAUSI_JA_VUOSI:
      return {
        alkaaText: [localize(koulutuksenAlkamiskausi), koulutuksenAlkamisvuosi].join(' '),
      };
    default:
      return {};
  }
};
