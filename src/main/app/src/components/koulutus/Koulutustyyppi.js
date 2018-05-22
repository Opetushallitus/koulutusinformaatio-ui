class Koulutustyyppi {

    static isAvoin(koulutus) {
        return koulutus.avoin || koulutus.isAvoimenYliopistonKoulutus || !koulutus.johtaaTutkintoon;
    }

    static getKoulutustyyppi(koulutus) {
        if(!koulutus.koulutustyyppi) {
            return '';
        }
        const koulutustyyppi = koulutus.koulutustyyppi.uri ? koulutus.koulutustyyppi.uri.split('#')[0] : koulutus.koulutustyyppi.split('#')[0];
        switch(koulutustyyppi) {
            case "koulutustyyppi_1": return 'amm'; break; //Ammatillinen perustutkinto
            case "koulutustyyppi_2": return 'lk'; break; //Lukiokoulutus
            case "koulutustyyppi_3": return Koulutustyyppi.isAvoin(koulutus) ? 'ako' : 'kk'; break; //Korkeakoulutus
            case "koulutustyyppi_4": return 'amm'; break; //Ammatillinen perustutkinto erityisopetuksena
            case "koulutustyyppi_5": return 'amm'; break; //Työhön ja itsenäiseen elämään valmentava koulutus (TELMA), ei johda tutkintoon
            case "koulutustyyppi_6": return ''; break; //Perusopetuksen lisäopetus, ei johda tutkintoon
            case "koulutustyyppi_7": return 'amm'; break; //Ammatilliseen peruskoulutukseen ohjaava ja valmistava koulutus
            case "koulutustyyppi_8": return 'amm'; break; //Maahanmuuttajien ammatilliseen peruskoulutukseen valmistava koulutus
            case "koulutustyyppi_9": return 'lk'; break; //Maahanmuuttajien ja vieraskielisten lukiokoulutukseen valmistava koulutus
            case "koulutustyyppi_10": return ''; break; //Vapaan sivistystyön koulutus, ei johda tutkintoon
            case "koulutustyyppi_11": return 'amm'; break; //Ammattitutkinto
            case "koulutustyyppi_12": return 'amm'; break; //Erikoisammattitutkinto
            case "koulutustyyppi_13": return 'amm'; break; //Ammatillinen perustutkinto näyttötutkintona
            case "koulutustyyppi_14": return 'lk'; break; //Aikuisten lukiokoulutus
            case "koulutustyyppi_15": return ''; break; //Esiopetus
            case "koulutustyyppi_16": return ''; break; //Perusopetus
            case "koulutustyyppi_17": return ''; break; //Aikuisten perusopetus
            case "koulutustyyppi_18": return 'amm'; break; //Ammatilliseen peruskoulutukseen valmentava koulutus (VALMA), ei johda tutkintoon
            case "koulutustyyppi_19": return 'amm'; break; //Ammatilliseen peruskoulutukseen valmentava koulutus (VALMA) erityisopetuksena, ei johda tutkintoon
            case "koulutustyyppi_20": return ''; break; //Varhaiskasvatus
            case "koulutustyyppi_21": return ''; break; //EB, RP, ISH
            case "koulutustyyppi_22": return ''; break; //Perusopetukseen valmistava opetus, ei johda tutkintoon
            case "koulutustyyppi_23": return 'lk'; break; //Lukiokoulutukseen valmistava koulutus, ei johda tutkintoon
            case "koulutustyyppi_24": return ''; break; //Pelastusalan koulutus
            case "koulutustyyppi_26": return 'amm'; break; //Ammatillinen perustutkinto (reformin mukainen)
            default: return '';
        }
    }
}

export {Koulutustyyppi};