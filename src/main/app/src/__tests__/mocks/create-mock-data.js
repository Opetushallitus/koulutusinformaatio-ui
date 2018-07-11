class Koulutukset {
    static createKoulutuksetSearchResult(count) {
        const koulutukset = [];
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

    static createKoulutusSearchResult(oid) {
        const res = { result: {koulutus: {}}};

        res.result.koulutus[oid] = {
            aihees: [ {nimi: {kieli_fi: "Aihe_fi", kieli_sv: "Aihe_sv", kieli_en: "Aihe_en"}} ],
            johtaaTutkintoon: true,
            avoin: false,
            haettavissa: null,
            oid: oid,
            score: 10,
            tarjoaja: "Kiva ammattikorkeakoulu",
            tyyppi: "koulutus",
            koulutustyyppi: "koulutustyyppi_3",
            searchData: {
                nimi: {kieli_fi: "Koulutus fi", kieli_sv: "Koulutus sv", kieli_en: "Koulutus en"},
                tyyppi: "kk",
            },
            kuvausKomo: {},
            oppiaineet: [],
            organisaatio: { nimi: "Oppilaitos fi" }
        };
        return res;
    }
}

class Oppilaitokset {
    static createOppilaitoksetSearchResult(count) {
        const oppilaitokset = [];
        for(var i = 0; i < count; i++) {
            oppilaitokset.push({
                nimi: {kieli_fi: "Oppilaitos fi", kieli_sv: "Oppilaitos sv", kieli_en: "Oppilaitos en"},
                tyyppi: "kk",
                oid: "3.2.246.562.17.0000000" + i
            })
        }
        return { count: count, result: oppilaitokset};
    }

    static createOppilaitosSearchResult(oid) {
        return { result:  {
            oid: oid,
            nimi: {kieli_fi: "Oppilaitos fi", kieli_sv: "Oppilaitos sv", kieli_en: "Oppilaitos en"},
        }}
    }
}

export {Koulutukset, Oppilaitokset}