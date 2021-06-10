import _fp from 'lodash/fp';

import { Koodi } from '#/src/types/common';
import { Maksullisuustyyppi } from '#/src/types/ToteutusTypes';

import i18n from './i18n';
import { koodiUriToPostinumero } from './utils';

const lng = (nimi: any, lng: 'fi' | 'en' | 'sv') =>
  nimi?.['kieli_' + lng] || nimi?.[lng] || false;

export const getLanguage = () => i18n.language;

export const translate = (nimi: any) => {
  const language = getLanguage();
  if ('en' === language) {
    return lng(nimi, 'en') || lng(nimi, 'fi') || lng(nimi, 'sv') || '';
  } else if ('sv' === language) {
    return lng(nimi, 'sv') || lng(nimi, 'fi') || lng(nimi, 'en') || '';
  } else {
    return lng(nimi, 'fi') || lng(nimi, 'sv') || lng(nimi, 'en') || '';
  }
};

export const localize = (obj: any) => (obj ? translate(obj.nimi || obj) : '');

export const localizeIfNimiObject = (obj: any) =>
  obj ? (_fp.isString(obj.nimi) ? obj.nimi : translate(obj.nimi || obj)) : '';

export const localizeSortedArrayToString = (arr: Array<Koodi> = []) =>
  _fp.compose(
    _fp.join(', '),
    _fp.uniq,
    _fp.map(localize),
    _fp.sortBy(`nimi.${getLanguage()}`)
  )(arr);

export const getTranslationForKey = (key = '') => i18n.t(key);

export const localizeOsoite = (katuosoite: unknown, postinumeroKoodi: Koodi) => {
  if (!katuosoite || !postinumeroKoodi) {
    return '';
  }
  const postitoimialue = `, ${koodiUriToPostinumero(
    postinumeroKoodi?.koodiUri
  )} ${localize(postinumeroKoodi?.nimi)}`;
  return `${localize(katuosoite)}${postitoimialue}`;
};

export const getLocalizedMaksullisuus = (
  maksullisuustyyppi: Maksullisuustyyppi,
  maksuAmount: number
) =>
  ['maksullinen', 'lukuvuosimaksu'].includes(maksullisuustyyppi)
    ? `${
        maksullisuustyyppi === 'lukuvuosimaksu'
          ? getTranslationForKey('toteutus.lukuvuosimaksu') + ' '
          : ''
      }${maksuAmount} € 
      `
    : getTranslationForKey('toteutus.maksuton');
