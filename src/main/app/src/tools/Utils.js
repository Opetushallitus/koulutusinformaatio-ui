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
  getCoreAddress(postitoimipaikka = '', osoite = '') {
    //Merkkejä ja välilyönnillä siitä erotettu numero, esim: Ratapiha 3, Hubert Hepolaisen Katu 888.
    //Mahdollinen jatke leikataan pois.
    const regexp = '^.+? \\d+';
    const fullAddress = [postitoimipaikka, osoite].join(' ');
    const withoutNumber = fullAddress.split(' ').filter(isNaN).join(' ');
    const withoutHouseNumber = [withoutNumber];
    withoutHouseNumber.input = withoutNumber;
    const coreAddress = fullAddress.match(regexp);
    if (coreAddress === null) {
      console.warn('Warning: returning null for core address, input: ' + fullAddress);
    }
    return {
      address: coreAddress,
      addressNoNumbers: withoutHouseNumber,
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
