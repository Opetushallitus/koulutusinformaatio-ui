import _fp from 'lodash/fp';
import { format } from 'date-fns';
import stripTags from 'striptags';
import i18n from './i18n';
import ReactHtmlParser from 'react-html-parser';
import { TOP_BAR_HEIGHT } from '../constants';

export const Common = {
  // filters 'null', 'empty string' or 'undefined', but '0' or 'false' are valid values,
  // does not parse numbers to strings
  cleanRequestParams: _fp.pickBy(_fp.toString),
};

export const koodiUriToPostinumero = (str = '') => {
  return str.match(/^posti_(\d+)/)?.[1] ?? '';
};

const lng = (nimi, lng) => nimi?.['kieli_' + lng] || nimi?.[lng] || false;

const translate = (nimi) => {
  const language = Localizer.getLanguage();
  if ('en' === language) {
    return lng(nimi, 'en') || lng(nimi, 'fi') || lng(nimi, 'sv') || '';
  } else if ('sv' === language) {
    return lng(nimi, 'sv') || lng(nimi, 'fi') || lng(nimi, 'en') || '';
  } else {
    return lng(nimi, 'fi') || lng(nimi, 'sv') || lng(nimi, 'en') || '';
  }
};

export const Localizer = {
  getLanguage: () => i18n.language,

  localize: (obj) => (obj ? translate(obj.nimi || obj) : ''),

  localizeSortedArrayToString: (arr = []) =>
    _fp.compose(
      _fp.join(', '),
      _fp.uniq,
      _fp.map(Localizer.localize),
      _fp.sortBy(`nimi.${Localizer.getLanguage()}`)
    )(arr),

  getTranslationForKey: (key = '') => i18n.t(key),

  localizeOsoite: (katuosoite, postinumeroKoodi) => {
    if (!katuosoite || !postinumeroKoodi) {
      return '';
    }
    const postitoimialue = `, ${koodiUriToPostinumero(
      postinumeroKoodi?.koodiUri
    )} ${Localizer.localize(postinumeroKoodi?.nimi)}`;
    return `${Localizer.localize(katuosoite)}${postitoimialue}`;
  },
  localizeLaajuus: (laajuus) => {
    return !laajuus.includes(undefined)
      ? laajuus.map((elem) => Localizer.localize(elem)).join(' ')
      : Localizer.getTranslationForKey('koulutus.ei-laajuutta');
  },
};

export const OsoiteParser = {
  parseOsoiteData(osoiteData) {
    const osoite = Localizer.localize(osoiteData.osoite);
    const postinumero = koodiUriToPostinumero(osoiteData.postinumero.koodiUri);
    const postitoimipaikka = _fp.capitalize(
      Localizer.localize(osoiteData.postinumero.nimi)
    );
    const yhteystiedot =
      osoite && postinumero && postitoimipaikka
        ? _fp.trim(`${osoite}, ${postinumero} ${postitoimipaikka}`, ', ')
        : Localizer.getTranslationForKey('oppilaitos.ei-yhteystietoja');

    return { osoite, postinumero, postitoimipaikka, yhteystiedot };
  },

  getSearchAddress(postitoimipaikka = '', osoite = '') {
    // 'PL 123, osoite 123' <- we need to remove any PL (postilokero) parts for map searches
    const usedOsoite = osoite
      .split(',')
      .filter((s) => !s.includes('PL'))
      .map((s) => s.trim())
      .join(', ');
    const fullAddress = [postitoimipaikka, usedOsoite].filter(Boolean).join(' ');
    const withoutNumbers = fullAddress.split(' ').filter(isNaN).join(' ');

    // This cuts the string after any words + single number e.g. 'Paikkakunta Osoite 123 this is cut'
    // TODO: Is this really necessary
    const regexp = /^.+? \d+/;
    const coreAddress = fullAddress.match(regexp)?.[0];

    if (!coreAddress) {
      consoleWarning('Warning: returning null for core address, input: ' + fullAddress);
    }
    return {
      address: coreAddress || postitoimipaikka,
      addressNoNumbers: withoutNumbers, // NOTE: This is used when given street number is not found in Oskari map
    };
  },
};

export function formatDateString(dateString, dateFormat = 'd.M.y HH:mm') {
  if (!dateString) {
    return '';
  }

  const klo = i18n.t('lomake.klo');

  if (klo !== '') {
    dateFormat = "d.M.y 'klo' HH:mm";
  }

  return format(new Date(dateString), dateFormat);
}

export const formatDateRange = (start, end, dateFormat) =>
  `${formatDateString(start, dateFormat)} \u2013 ${
    end ? formatDateString(end, dateFormat) : ''
  }`;

const ALLOWED_HTML_TAGS = [
  'a',
  'b',
  'blockquote',
  'br',
  'code',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'i',
  'li',
  'ol',
  'p',
  'pre',
  's',
  'sup',
  'sub',
  'strong',
  'strike',
  'ul',
];

export const sanitizeHTML = (html) => stripTags(html, ALLOWED_HTML_TAGS);

export const sanitizedHTMLParser = (html, ...rest) =>
  ReactHtmlParser(sanitizeHTML(html), ...rest);

export const toId = _fp.kebabCase;

export const scrollIntoView = (element) => {
  var elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
  var offsetPosition = elementPosition - TOP_BAR_HEIGHT;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
};

const { NODE_ENV } = process.env || {};

export const consoleWarning = (...props) => {
  if (NODE_ENV !== 'test') {
    console.warn(...props);
  }
};
