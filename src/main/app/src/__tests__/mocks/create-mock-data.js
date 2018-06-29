class Koulutukset {
    static createKoulutuksetSearchResult(count) {
        var koulutukset = [];
        for(var i = 0; i < count; i++) {
            koulutukset.push({
                aiheet: [ {nimi: {kieli_fi: "Aihe_fi", kieli_sv: "Aihe_sv", kieli_en: "Aihe_en"}} ],
                johtaaTutkintoon: true,
                avoin: false,
                haettavissa: null,
                nimi: {kieli_fi: "Koulutus fi " + i, kieli_sv: "Koulutus sv " + i, kieli_en: "Koulutus en " + i},
                oid: "1.2.246.562.17.0000000" + i,
                score: 10,
                tarjoaja: "Kiva ammattikorkeakoulu",
                tyyppi: "kk",
                koulutustyyppi: "koulutustyyppi_3"
            })
        }
        return { count: count, result: koulutukset};
    }
}

export {Koulutukset}