import i18n from './i18n';
import padStart from 'lodash/padStart';
import _ from 'lodash';

export class Common {
  // filters 'null', 'empty' and 'undefined', '0' or 'false' are valid values,
  // does not parse numbers to strings
  static withoutNilValues(obj) {
    return _.pickBy(obj, _.toString);
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
}

export class OsoiteParser {
  static getCoreAddress(katuosoite) {
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
    return new Date(timemillis)
      .toLocaleString()
      .replace(/\//g, '.')
      .replace(',', ' klo');
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
