import { Maksullisuustyyppi } from '#/src/types/ToteutusTypes';

import { Localizer } from './Utils';

export const getLocalizedMaksullisuus = (
  maksullisuustyyppi: Maksullisuustyyppi,
  maksuAmount: number
) =>
  ['maksullinen', 'lukuvuosimaksu'].includes(maksullisuustyyppi)
    ? `${
        maksullisuustyyppi === 'lukuvuosimaksu'
          ? Localizer.getTranslationForKey('toteutus.lukuvuosimaksu') + ' '
          : ''
      }${maksuAmount} € 
      `
    : Localizer.getTranslationForKey('toteutus.maksuton');
