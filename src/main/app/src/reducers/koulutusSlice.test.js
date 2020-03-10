import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as api from '../api/konfoApi';
import reducer, {
  initialState,
  fetchKoulutusStart,
  fetchJarjestajatStart,
  fetchKoulutusSuccess,
  fetchJarjestajatSuccess,
  fetchKoulutusJarjestajat,
  fetchKoulutus,
} from './koulutusSlice';

const mockStore = configureMockStore([thunk]);

describe('koulutus slice', () => {
  describe('reducer, action creators and selectors', () => {
    it('should return initial state on first run', () => {
      const nextState = initialState;
      const result = reducer(undefined, {});
      expect(result).toEqual(nextState);
    });
    it('should set loading states properly', () => {
      let nextState = reducer(initialState, fetchKoulutusStart());
      expect(nextState.loading).toEqual(1);

      nextState = reducer(initialState, fetchJarjestajatStart());
      expect(nextState.loading).toEqual(1);

      nextState = reducer(
        initialState,
        fetchKoulutusSuccess({ oid: '12345', koulutus: {} })
      );
      expect(nextState.loading).toEqual(-1);

      nextState = reducer(
        initialState,
        fetchJarjestajatSuccess({ oid: '12345', jarjestajat: {} })
      );
      expect(nextState.loading).toEqual(-1);
    });
  });
});

describe('thunks', () => {
  const koulutusOid = '1.2.246.562.13.00000000000000000036';
  const koulutusData = {
    tila: 'julkaistu',
    johtaaTutkintoon: true,
    tarjoajat: [
      {
        paikkakunta: {
          koodiUri: 'kunta_398',
          nimi: {
            sv: 'Lahtis',
            fi: 'Lahti',
          },
        },
        nimi: {
          fi: 'Koulutuskeskus Salpaus',
          sv: 'Koulutuskeskus Salpaus',
          en: 'Koulutuskeskus Salpaus',
        },
        oid: '1.2.246.562.10.81934895871',
      },
    ],
    toteutukset: [],
    modified: '2019-02-18T12:45',
    nimi: {
      en: 'Vocational qualification in Business',
      fi: 'Liiketoiminnan perustutkinto',
      sv: 'Grundexamen i affärsverksamhet',
    },
    muokkaaja: {
      oid: '1.2.246.562.24.62301161440',
      nimi: 'Jessika Penttinen',
    },
    oid: '1.2.246.562.13.00000000000000000036',
    kielivalinta: ['fi', 'sv'],
    koulutus: {
      koodiUri: 'koulutus_331101#11',
      nimi: {
        en: 'Vocational qualification in Business',
        sv: 'Grundexamen i affärsverksamhet',
        fi: 'Liiketoiminnan perustutkinto',
      },
    },
    timestamp: 1581418941336,
    julkinen: false,
    organisaatiot: [
      '1.2.246.562.10.594252633210',
      '1.2.246.562.10.81934895871',
    ],
    organisaatio: {
      paikkakunta: {
        koodiUri: 'kunta_398',
        nimi: {
          sv: 'Lahtis',
          fi: 'Lahti',
        },
      },
      nimi: {
        fi: 'Koulutuskeskus Salpaus -kuntayhtymä',
      },
      oid: '1.2.246.562.10.594252633210',
    },
    metadata: {
      tyyppi: 'amm',
      kuvaus: {},
      lisatiedot: [],
      koulutusala: [
        {
          koodiUri: 'kansallinenkoulutusluokitus2016koulutusalataso1_04',
          nimi: {
            en: 'Business, administration and law',
            sv: 'Handel, administration och juridik',
            fi: 'Kauppa, hallinto ja oikeustieteet',
          },
        },
      ],
      tutkintonimike: [
        {
          koodiUri: 'tutkintonimikkeet_10059',
          nimi: {
            sv: 'Merkonom',
            fi: 'Merkonomi',
            en: 'Vocational Qualification in Business and Administration',
          },
        },
      ],
      opintojenLaajuus: null,
      opintojenLaajuusyksikko: {
        koodiUri: 'opintojenlaajuusyksikko_6',
        nimi: {
          sv: 'kompetenspoäng',
          fi: 'osaamispistettä',
          en: 'ECVET competence points',
        },
      },
    },
    koulutustyyppi: 'amm',
  };
  const jarjestajatData = {
    total: 3,
    hits: [
      {
        maksunMaara: null,
        kuvaus: {
          fi:
            'Tässä toteutuksessa testataan suomen ja ruotsin kielen peritymistä ja oikeuksia miten nämä näkyvät eri organisaatioille ja niiden tasoille. ',
          sv:
            'Genomförandet testar arv från finska och svenska och de rättigheter de har för olika organisationer och deras nivåer.',
        },
        toteutusOid: '1.2.246.562.17.00000000000000000112',
        opetusajat: [
          {
            koodiUri: 'opetusaikakk_1#1',
            nimi: {
              sv: 'Dagundervisning',
              en: 'Day time teaching',
              fi: 'Päiväopetus',
            },
          },
        ],
        nimi: {
          sv: 'Hyria koulutus Oy',
          fi: 'Hyria koulutus Oy',
          en: 'Hyria koulutus Oy',
        },
        onkoMaksullinen: false,
        kunnat: [
          {
            koodiUri: 'kunta_694',
            nimi: {
              fi: 'Riihimäki',
              sv: 'Riihimäki',
            },
          },
        ],
        tutkintonimikkeet: [
          {
            koodiUri: 'tutkintonimikkeet_10038',
            nimi: {
              sv: 'Golvläggare',
              fi: 'Lattianpäällystäjä',
            },
          },
          {
            koodiUri: 'tutkintonimikkeet_10039',
            nimi: {
              sv: 'Målare',
              fi: 'Maalari',
            },
          },
          {
            koodiUri: 'tutkintonimikkeet_10040',
            nimi: {
              fi: 'Pintakäsittelijä',
              sv: 'Ytbehandlare',
            },
          },
          {
            koodiUri: 'tutkintonimikkeet_10040',
            nimi: {
              fi: 'Pintakäsittelijä',
              sv: 'Ytbehandlare',
            },
          },
        ],
        koulutustyyppi: 'amm',
      },
      {
        maksunMaara: null,
        kuvaus: {},
        toteutusOid: '1.2.246.562.17.00000000000000000113',
        opetusajat: [
          {
            koodiUri: 'opetusaikakk_1#1',
            nimi: {
              sv: 'Dagundervisning',
              en: 'Day time teaching',
              fi: 'Päiväopetus',
            },
          },
        ],
        nimi: {
          sv: 'Koulutuskeskus Salpaus',
          fi: 'Koulutuskeskus Salpaus',
          en: 'Koulutuskeskus Salpaus',
        },
        onkoMaksullinen: false,
        kunnat: [
          {
            koodiUri: 'kunta_398',
            nimi: {
              sv: 'Lahtis',
              fi: 'Lahti',
            },
          },
        ],
        tutkintonimikkeet: [
          {
            koodiUri: 'tutkintonimikkeet_10038',
            nimi: {
              sv: 'Golvläggare',
              fi: 'Lattianpäällystäjä',
            },
          },
          {
            koodiUri: 'tutkintonimikkeet_10039',
            nimi: {
              sv: 'Målare',
              fi: 'Maalari',
            },
          },
          {
            koodiUri: 'tutkintonimikkeet_10040',
            nimi: {
              fi: 'Pintakäsittelijä',
              sv: 'Ytbehandlare',
            },
          },
          {
            koodiUri: 'tutkintonimikkeet_10040',
            nimi: {
              fi: 'Pintakäsittelijä',
              sv: 'Ytbehandlare',
            },
          },
        ],
        koulutustyyppi: 'amm',
      },
      {
        maksunMaara: null,
        kuvaus: {},
        toteutusOid: '1.2.246.562.17.00000000000000000114',
        opetusajat: [
          {
            koodiUri: 'opetusaikakk_2#1',
            nimi: {
              fi: 'Iltaopetus',
              sv: 'Kvällsundervisning',
              en: 'Evening teaching',
            },
          },
          {
            koodiUri: 'opetusaikakk_3#1',
            nimi: {
              fi: 'Viikonloppuopetus',
              sv: 'Veckoslutsundervisning',
              en: 'Weekend teaching',
            },
          },
        ],
        nimi: {
          sv: 'Koulutuskeskus Salpaus',
          fi: 'Koulutuskeskus Salpaus',
          en: 'Koulutuskeskus Salpaus',
        },
        onkoMaksullinen: false,
        kunnat: [
          {
            koodiUri: 'kunta_398',
            nimi: {
              sv: 'Lahtis',
              fi: 'Lahti',
            },
          },
          {
            koodiUri: 'kunta_016',
            nimi: {
              fi: 'Asikkala',
              sv: 'Asikkala',
            },
          },
        ],
        tutkintonimikkeet: [
          {
            koodiUri: 'tutkintonimikkeet_10038',
            nimi: {
              sv: 'Golvläggare',
              fi: 'Lattianpäällystäjä',
            },
          },
          {
            koodiUri: 'tutkintonimikkeet_10039',
            nimi: {
              sv: 'Målare',
              fi: 'Maalari',
            },
          },
          {
            koodiUri: 'tutkintonimikkeet_10040',
            nimi: {
              fi: 'Pintakäsittelijä',
              sv: 'Ytbehandlare',
            },
          },
          {
            koodiUri: 'tutkintonimikkeet_10040',
            nimi: {
              fi: 'Pintakäsittelijä',
              sv: 'Ytbehandlare',
            },
          },
        ],
        koulutustyyppi: 'amm',
      },
    ],
  };

  it('creates fetchKoulutusStart and fetchKoulutusSuccess when fetchKoulutus succeeds', async () => {
    const store = mockStore(initialState);
    api.getKoulutus = jest.fn().mockResolvedValueOnce(koulutusData);
    api.getKoulutusKuvaus = jest.fn().mockResolvedValueOnce({});
    await store.dispatch(fetchKoulutus(koulutusOid));
    const expectedActions = [
      fetchKoulutusStart(),
      fetchKoulutusSuccess({ oid: koulutusOid, koulutus: koulutusData }),
    ];
    expect(store.getActions()).toEqual(expectedActions);
  });
  it('creates fetchJarjestajatStart and fetchJarjestajatSuccess when fetchKoulutusJarjestajat succeeds', async () => {
    const store = mockStore(initialState);
    api.getKoulutusJarjestajat = jest
      .fn()
      .mockResolvedValueOnce(jarjestajatData);
    await store.dispatch(fetchKoulutusJarjestajat(koulutusOid));
    const expectedActions = [
      fetchJarjestajatStart(),
      fetchJarjestajatSuccess({
        oid: koulutusOid,
        jarjestajat: jarjestajatData,
      }),
    ];
    expect(store.getActions()).toEqual(expectedActions);
  });
});
