import _fp from 'lodash/fp';
import padStart from 'lodash/padStart';
import stripTags from 'striptags';
import i18n from './i18n';
import ReactHtmlParser from 'react-html-parser';

export class Common {
  // filters 'null', 'empty string' or 'undefined', but '0' or 'false' are valid values,
  // does not parse numbers to strings
  static cleanRequestParams(obj) {
    return _fp.pickBy(_fp.toString, obj);
  }
}
export class Localizer {
  static getLanguage() {
    return i18n.languages && i18n.languages[0] ? i18n.language.split('-')[0] : 'fi';
  }

  static lng(nimi, lng) {
    if (nimi['kieli_' + lng]) {
      return nimi['kieli_' + lng];
    } else if (nimi[lng]) {
      return nimi[lng];
    } else {
      return false;
    }
  }

  static translate(nimi, defaultValue = '') {
    const lng = this.getLanguage();
    if ('en' === lng) {
      return (
        Localizer.lng(nimi, 'en') ||
        Localizer.lng(nimi, 'fi') ||
        Localizer.lng(nimi, 'sv') ||
        defaultValue
      );
    } else if ('sv' === lng) {
      return (
        Localizer.lng(nimi, 'sv') ||
        Localizer.lng(nimi, 'fi') ||
        Localizer.lng(nimi, 'en') ||
        defaultValue
      );
    } else {
      return (
        Localizer.lng(nimi, 'fi') ||
        Localizer.lng(nimi, 'sv') ||
        Localizer.lng(nimi, 'en') ||
        defaultValue
      );
    }
  }

  static localize(obj, defaultValue = '') {
    if (obj) {
      return obj.nimi
        ? Localizer.translate(obj.nimi, defaultValue)
        : Localizer.translate(obj, defaultValue);
    }
    return defaultValue;
  }
  static localizeSortedArrayToString(arr = []) {
    return _fp.compose(
      _fp.join(', '),
      _fp.uniq,
      _fp.map(this.localize),
      _fp.sortBy(`nimi.${this.getLanguage()}`)
    )(arr);
  }
  static getTranslationForKey(key = '') {
    return i18n.t(key);
  }
}

export class Parser {
  static removeHtmlTags(html) {
    if (html) {
      const div = document.createElement('div');
      div.innerHTML = html;
      return div.innerText;
    }
    return html;
  }
  static koodiUriToPostinumero(str = '') {
    return str.slice(0, str.indexOf('#')).replace(/[^0-9]/g, '');
  }
}

export class OsoiteParser {
  static parseOsoiteData(osoiteData) {
    const osoite = Localizer.localize(osoiteData.osoite, '');
    const postinumero = Parser.koodiUriToPostinumero(osoiteData.postinumero.koodiUri);
    const postitoimipaikka = _fp.capitalize(
      Localizer.localize(osoiteData.postinumero.nimi, '')
    );
    const yhteystiedot =
      osoite && postinumero && postitoimipaikka
        ? _fp.trim(`${osoite}, ${postinumero} ${postitoimipaikka}`, ', ')
        : Localizer.getTranslationForKey('oppilaitos.ei-yhteystietoja');

    return { osoite, postinumero, postitoimipaikka, yhteystiedot };
  }

  static getCoreAddress(katuosoite = '') {
    //Merkkejä ja välilyönnillä siitä erotettu numero, esim: Ratapiha 3, Hubert Hepolaisen Katu 888.
    //Mahdollinen jatke leikataan pois.
    const regexp = '^.+? \\d+';
    const coreAddress = katuosoite.match(regexp);
    if (coreAddress === null) {
      console.log('Warning: returning null for core address, input: ' + katuosoite);
    }
    return coreAddress;
  }
}

export class TimeMillisParser {
  static millisToReadable(timemillis) {
    if (timemillis === null) {
      return '';
    }
    return new Date(timemillis).toLocaleString().replace(/\//g, '.').replace(',', ' klo');
  }
}

export class FormatdDate {
  static formatDateString = (dateString, format) => {
    if (!dateString) {
      return '';
    }

    const [date, time = ''] = dateString.split('T');
    const [year, month, day] = date.split('-');
    const [hour = '0', minute = '0'] = time.split(':');

    let formattedDate = format;

    formattedDate = formattedDate.replace(/DD/g, padStart(day, 2, '0'));
    formattedDate = formattedDate.replace(/MM/g, padStart(month, 2, '0'));
    formattedDate = formattedDate.replace(/YYYY/g, year);
    formattedDate = formattedDate.replace(/HH/g, padStart(hour, 2, '0'));
    formattedDate = formattedDate.replace(/mm/g, padStart(minute, 2, '0'));

    return formattedDate;
  };
}

const ALLOWED_HTML_TAGS = [
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
