class Localizer {

    static getKieli(nimi, defaultValue = "") {
        if(nimi.kieli_fi) {
            return nimi.kieli_fi;
        } else if(nimi.kieli_sv) {
            return nimi.kieli_sv;
        } else if(nimi.kieli_en) {
            return nimi.kieli_en;
        } else if(nimi.fi) {
            return nimi.fi;
        } else if(nimi.sv) {
            return nimi.sv;
        } else if(nimi.en) {
            return nimi.en;
        } else {
            return defaultValue;
        }
    }

    static localize(obj, defaultValue = "") {
        if(obj) {
            return obj.nimi ? Localizer.getKieli(obj.nimi, defaultValue) : Localizer.getKieli(obj, defaultValue);
        }
        return defaultValue;
    }
}

class Parser {

    static removeHtmlTags(html) {
        if(html) {
            var div = document.createElement("div");
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
        var regexp = '^.+? \\d+';
        var coreAddress = katuosoite.match(regexp);
        if(coreAddress === null) {
            console.log("Warning: returning null for core address, input: " + katuosoite);
        }
        return coreAddress;
    }
}

export {Parser, Localizer, OsoiteParser};