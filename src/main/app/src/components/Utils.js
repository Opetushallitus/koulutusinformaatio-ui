class Localizer {

    static getKieli(nimi, defaultValue = "") {
        if(nimi.kieli_fi) {
            return nimi.kieli_fi;
        } else if(nimi.kieli_sv) {
            return nimi.kieli_sv;
        } else if(nimi.kieli_en) {
            return nimi.kieli.en;
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

export {Parser, Localizer};