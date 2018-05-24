class Oppilaitostyyppi {

    static getOppilaitostyyppi(oppilaitos) {
        if(!oppilaitos.oppilaitostyyppi || !oppilaitos.oppilaitostyyppi.koodiUri) {
            return '';
        }
        switch(oppilaitos.oppilaitostyyppi.koodiUri.split('#')[0]) {
            case "oppilaitostyyppi_01": return ''; //Taiteen perusopetuksen oppilaitokset (ei musiikki)
            case "oppilaitostyyppi_11": return ''; //Peruskoulut
            case "oppilaitostyyppi_12": return ''; //Peruskouluasteen erityiskoulut
            case "oppilaitostyyppi_15": return 'lk'; //Lukiot
            case "oppilaitostyyppi_19": return 'lk'; //Perus- ja lukioasteen koulut
            case "oppilaitostyyppi_21": return 'amm'; //Ammatilliset oppilaitokset
            case "oppilaitostyyppi_22": return 'amm'; //Ammatilliset erityisoppilaitokset
            case "oppilaitostyyppi_23": return 'amm'; //Ammatilliset erikoisoppilaitokset
            case "oppilaitostyyppi_24": return 'amm'; //Ammatilliset aikuiskoulutuskeskukset
            case "oppilaitostyyppi_28": return 'amm'; //Palo-, poliisi- ja vartiointialojen oppilaitokset
            case "oppilaitostyyppi_29": return 'amm'; //Sotilasalan ammatilliset oppilaitokset
            case "oppilaitostyyppi_41": return 'kk'; //Ammattikorkeakoulut
            case "oppilaitostyyppi_42": return 'kk'; //Yliopistot
            case "oppilaitostyyppi_43": return 'kk'; //Sotilaskorkeakoulut
            case "oppilaitostyyppi_45": return 'kk'; //Lastentarhanopettajaopistot
            case "oppilaitostyyppi_46": return 'kk'; //Väliaikaiset ammattikorkeakoulut
            case "oppilaitostyyppi_61": return ''; //Musiikkioppilaitokset
            case "oppilaitostyyppi_62": return ''; //Liikunnan koulutuskeskukset
            case "oppilaitostyyppi_63": return ''; //Kansanopistot
            case "oppilaitostyyppi_64": return ''; //Kansalaisopistot
            case "oppilaitostyyppi_65": return ''; //Opintokeskukset
            case "oppilaitostyyppi_66": return 'kk'; //Kesäyliopistot
            case "oppilaitostyyppi_91": return ''; //Kirjeoppilaitokset
            case "oppilaitostyyppi_92": return ''; //Neuvontajärjestöt
            case "oppilaitostyyppi_93": return ''; //Muut koulutuksen järjestäjät
            case "oppilaitostyyppi_99": return ''; //Muut oppilaitokset
            case "oppilaitostyyppi_XX": return ''; //Ei tiedossa (oppilaitostyyppi)
            default: return '';
        }
    }
}

export {Oppilaitostyyppi};