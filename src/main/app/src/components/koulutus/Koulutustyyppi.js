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
            case "koulutustyyppi_1": return 'amm'; //Ammatillinen perustutkinto
            case "koulutustyyppi_2": return 'lk'; //Lukiokoulutus
            case "koulutustyyppi_3": return Koulutustyyppi.isAvoin(koulutus) ? 'ako' : 'kk'; //Korkeakoulutus
            case "koulutustyyppi_4": return 'amm'; //Ammatillinen perustutkinto erityisopetuksena
            case "koulutustyyppi_5": return 'amm'; //Työhön ja itsenäiseen elämään valmentava koulutus (TELMA), ei johda tutkintoon
            case "koulutustyyppi_6": return ''; //Perusopetuksen lisäopetus, ei johda tutkintoon
            case "koulutustyyppi_7": return 'amm'; //Ammatilliseen peruskoulutukseen ohjaava ja valmistava koulutus
            case "koulutustyyppi_8": return 'amm'; //Maahanmuuttajien ammatilliseen peruskoulutukseen valmistava koulutus
            case "koulutustyyppi_9": return 'lk'; //Maahanmuuttajien ja vieraskielisten lukiokoulutukseen valmistava koulutus
            case "koulutustyyppi_10": return ''; //Vapaan sivistystyön koulutus, ei johda tutkintoon
            case "koulutustyyppi_11": return 'amm'; //Ammattitutkinto
            case "koulutustyyppi_12": return 'amm'; //Erikoisammattitutkinto
            case "koulutustyyppi_13": return 'amm'; //Ammatillinen perustutkinto näyttötutkintona
            case "koulutustyyppi_14": return 'lk'; //Aikuisten lukiokoulutus
            case "koulutustyyppi_15": return ''; //Esiopetus
            case "koulutustyyppi_16": return ''; //Perusopetus
            case "koulutustyyppi_17": return ''; //Aikuisten perusopetus
            case "koulutustyyppi_18": return 'amm'; //Ammatilliseen peruskoulutukseen valmentava koulutus (VALMA), ei johda tutkintoon
            case "koulutustyyppi_19": return 'amm'; //Ammatilliseen peruskoulutukseen valmentava koulutus (VALMA) erityisopetuksena, ei johda tutkintoon
            case "koulutustyyppi_20": return ''; //Varhaiskasvatus
            case "koulutustyyppi_21": return ''; //EB, RP, ISH
            case "koulutustyyppi_22": return ''; //Perusopetukseen valmistava opetus, ei johda tutkintoon
            case "koulutustyyppi_23": return 'lk'; //Lukiokoulutukseen valmistava koulutus, ei johda tutkintoon
            case "koulutustyyppi_24": return ''; //Pelastusalan koulutus
            case "koulutustyyppi_26": return 'amm'; //Ammatillinen perustutkinto (reformin mukainen)
            default: return '';
        }
    }
}

export {Koulutustyyppi};