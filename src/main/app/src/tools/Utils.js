import i18n from './i18n';

class Localizer {

    static getKieli(nimi, defaultValue = "", fallbackLng) {
        const lng = i18n.language;
        if(nimi['kieli_' + lng]) {
            return nimi['kieli_' + lng];
        } else if(nimi[lng]) {
            return nimi[lng];
        } else if (fallbackLng) {
            if(nimi['kieli_' + fallbackLng]) {
                return nimi['kieli_' + fallbackLng];
            } else if(nimi[fallbackLng]) {
                return nimi[fallbackLng];
            }
        } else {
            return defaultValue;
        }
    }

    static localize(obj, defaultValue = "", fallbackLng) {
        if(obj) {
            return obj.nimi ? Localizer.getKieli(obj.nimi, defaultValue, fallbackLng) : Localizer.getKieli(obj, defaultValue, fallbackLng);
        }
        return defaultValue;
    }
}

class Parser {

    static removeHtmlTags(html) {
        if(html) {
            const div = document.createElement("div");
            div.innerHTML = html;
            return div.innerText;
        }
        return html;
    }
}

class OsoiteParser {
    static getCoreAddress(katuosoite) {
        //Merkkejä ja välilyönnillä siitä erotettu numero, esim: Ratapiha 3, Hubert Hepolaisen Katu 888.
        //Mahdollinen jatke leikataan pois.
        const regexp = '^.+? \\d+';
        const coreAddress = katuosoite.match(regexp);
        if(coreAddress === null) {
            console.log("Warning: returning null for core address, input: " + katuosoite);
        }
        return coreAddress;
    }
}

export {Parser, Localizer, OsoiteParser};