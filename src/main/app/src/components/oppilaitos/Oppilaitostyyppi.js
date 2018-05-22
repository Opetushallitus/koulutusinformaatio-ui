class Oppilaitostyyppi {

    static getOppilaitostyyppi(oppilaitos) {
        if(!oppilaitos.oppilaitostyyppi || !oppilaitos.oppilaitostyyppi.koodiUri) {
            return '';
        }
        switch(oppilaitos.oppilaitostyyppi.koodiUri.split('#')[0]) {
            case "oppilaitostyyppi_01": return ''; break; //Taiteen perusopetuksen oppilaitokset (ei musiikki)
            case "oppilaitostyyppi_11": return ''; break; //Peruskoulut
            case "oppilaitostyyppi_12": return ''; break; //Peruskouluasteen erityiskoulut
            case "oppilaitostyyppi_15": return 'lk'; break; //Lukiot
            case "oppilaitostyyppi_19": return 'lk'; break; //Perus- ja lukioasteen koulut
            case "oppilaitostyyppi_21": return 'amm'; break; //Ammatilliset oppilaitokset
            case "oppilaitostyyppi_22": return 'amm'; break; //Ammatilliset erityisoppilaitokset
            case "oppilaitostyyppi_23": return 'amm'; break; //Ammatilliset erikoisoppilaitokset
            case "oppilaitostyyppi_24": return 'amm'; break; //Ammatilliset aikuiskoulutuskeskukset
            case "oppilaitostyyppi_28": return 'amm'; break; //Palo-, poliisi- ja vartiointialojen oppilaitokset
            case "oppilaitostyyppi_29": return 'amm'; break; //Sotilasalan ammatilliset oppilaitokset
            case "oppilaitostyyppi_41": return 'kk'; break; //Ammattikorkeakoulut
            case "oppilaitostyyppi_42": return 'kk'; break; //Yliopistot
            case "oppilaitostyyppi_43": return 'kk'; break; //Sotilaskorkeakoulut
            case "oppilaitostyyppi_45": return 'kk'; break; //Lastentarhanopettajaopistot
            case "oppilaitostyyppi_46": return 'kk'; break; //Väliaikaiset ammattikorkeakoulut
            case "oppilaitostyyppi_61": return ''; break; //Musiikkioppilaitokset
            case "oppilaitostyyppi_62": return ''; break; //Liikunnan koulutuskeskukset
            case "oppilaitostyyppi_63": return ''; break; //Kansanopistot
            case "oppilaitostyyppi_64": return ''; break; //Kansalaisopistot
            case "oppilaitostyyppi_65": return ''; break; //Opintokeskukset
            case "oppilaitostyyppi_66": return 'kk'; break; //Kesäyliopistot
            case "oppilaitostyyppi_91": return ''; break; //Kirjeoppilaitokset
            case "oppilaitostyyppi_92": return ''; break; //Neuvontajärjestöt
            case "oppilaitostyyppi_93": return ''; break; //Muut koulutuksen järjestäjät
            case "oppilaitostyyppi_99": return ''; break; //Muut oppilaitokset
            case "oppilaitostyyppi_XX": return ''; break; //Ei tiedossa (oppilaitostyyppi)
            default: return '';
        }
    }
}

export {Oppilaitostyyppi};