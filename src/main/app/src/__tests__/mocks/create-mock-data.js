class Koulutukset {
    static createKoulutuksetSearchResult(count) {
        const koulutukset = [];
        for(var i = 0; i < count; i++) {
            koulutukset.push({
                tila: "JULKAISTU",
                komotyyppi: "TUTKINTO",
                koulutusohjelma: {kieli_fi: "Ko_fi", kieli_sv: "Ko_sv", kieli_en: "Ko_en"},
                osaamisala: {kieli_fi: null, kieli_sv: null, kieli_en: null},
                toteutusOid: "1.2.246.562.17.0000000" + i,
                haettavissa: null,
                nimi: {kieli_fi: "Koulutus fi " + i, kieli_sv: "Koulutus sv " + i, kieli_en: "Koulutus en " + i},
                oid: "1.2.246.562.17.0000000" + i + "22",
                score: 10,
                tarjoaja: "Kiva ammattikorkeakoulu",
                tyyppi: "kk"
            })
        }
        return { count: count, result: koulutukset};
    }

    static createKoulutusSearchResult(oid) {
        const res = { result: {koulutus: {}}};

        res.result = {
            oid: oid,
            score: 10,
            tyyppi: "koulutusmoduuli",
            searchData: {
                nimi: {kieli_fi: "Koulutus fi", kieli_sv: "Koulutus sv", kieli_en: "Koulutus en"},
                tyyppi: "kk",
            },
            kuvausKomo: {},
            toteutukset: [{
                aihees: [ {nimi: {kieli_fi: "Aihe_fi", kieli_sv: "Aihe_sv", kieli_en: "Aihe_en"}} ],
                johtaaTutkintoon: true,
                avoin: false,
                haettavissa: null,
                oid: oid + "22",
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
            }]
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