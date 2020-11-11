import { createSlice } from '@reduxjs/toolkit';
import {
  getKoulutus,
  getKoulutusKuvaus,
  getKoulutusJarjestajat,
  getSuositellutKoulutukset,
  getEperusteKuvaus,
} from '#/src/api/konfoApi';
import _ from 'lodash';

const IDLE_STATUS = 'idle';
const LOADING_STATUS = 'loading';

export const TYYPPI_AMM = 'amm';
export const TYYPPI_AMM_TUTKINNON_OSA = 'amm-tutkinnon-osa';
export const TYYPPI_AMM_OSAAMISALA = 'amm-osaamisala';

export const initialState = {
  koulutusStatus: IDLE_STATUS,
  jarjestajatStatus: IDLE_STATUS,
  suositellutKoulutuksetStatus: IDLE_STATUS,
  koulutukset: {},
  jarjestajat: {},
  tulevatJarjestajat: {},
  suositellutKoulutukset: {},
  koulutusError: null,
  jarjestajatError: null,
  suositellutKoulutuksetError: null,
};

const koulutusSlice = createSlice({
  name: 'koulutus',
  initialState,
  reducers: {
    fetchKoulutusStart(state) {
      if (state.koulutusStatus === IDLE_STATUS) {
        state.koulutusStatus = LOADING_STATUS;
      }
    },
    fetchSuositellutKoulutuksetStart(state) {
      if (state.suositellutKoulutuksetStatus === IDLE_STATUS) {
        state.suositellutKoulutuksetStatus = LOADING_STATUS;
      }
    },
    fetchJarjestajatStart(state) {
      if (state.jarjestajatStatus === IDLE_STATUS) {
        state.jarjestajatStatus = LOADING_STATUS;
      }
    },
    fetchKoulutusSuccess(state, { payload }) {
      if (state.koulutusStatus === LOADING_STATUS) {
        const { koulutus, oid } = payload;
        state.koulutukset[oid] = koulutus;
        state.error = null;
        state.koulutusStatus = IDLE_STATUS;
      }
    },
    fetchSuositellutKoulutuksetSuccess(state, { payload }) {
      if (state.suositellutKoulutuksetStatus === LOADING_STATUS) {
        state.suositellutKoulutukset = payload.suositellutKoulutuksetData;
        state.suositellutKoulutuksetError = null;
        state.suositellutKoulutuksetStatus = IDLE_STATUS;
      }
    },
    fetchJarjestajatSuccess(state, { payload }) {
      if (state.jarjestajatStatus === LOADING_STATUS) {
        const { jarjestajat, tulevatJarjestajat, oid } = payload;
        state.jarjestajat[oid] = jarjestajat;
        state.tulevatJarjestajat[oid] = tulevatJarjestajat;
        state.error = null;
        state.jarjestajatStatus = IDLE_STATUS;
      }
    },

    fetchJarjestajatError(state, action) {
      if (state.jarjestajatStatus === LOADING_STATUS) {
        state.jarjestajatError = action.payload;
        state.jarjestajatStatus = IDLE_STATUS;
      }
    },
    fetchKoulutusError(state, action) {
      if (state.koulutusStatus === LOADING_STATUS) {
        state.koulutusError = action.payload;
        state.koulutusStatus = IDLE_STATUS;
      }
    },
    fetchSuositellutKoulutuksetError(state, action) {
      if (state.suositellutKoulutuksetStatus === LOADING_STATUS) {
        state.suositellutKoulutuksetError = action.payload;
        state.suositellutKoulutuksetStatus = IDLE_STATUS;
      }
    },
  },
});

export const {
  fetchKoulutusStart,
  fetchSuositellutKoulutuksetStart,
  fetchJarjestajatStart,
  fetchKoulutusSuccess,
  fetchSuositellutKoulutuksetSuccess,
  fetchJarjestajatSuccess,
  fetchKoulutusError,
  fetchSuositellutKoulutuksetError,
  fetchJarjestajatError,
} = koulutusSlice.actions;
export default koulutusSlice.reducer;

export const fetchKoulutus = (oid, draft) => async (dispatch) => {
  try {
    dispatch(fetchKoulutusStart());
    const koulutusData = await getKoulutus(oid, draft);
    if (
      (koulutusData?.koulutustyyppi === TYYPPI_AMM && koulutusData.ePerusteId) ||
      (koulutusData?.koulutustyyppi === TYYPPI_AMM_OSAAMISALA && koulutusData.ePerusteId)
    ) {
      const koulutusKuvausData = await getKoulutusKuvaus(koulutusData.ePerusteId);
      _.set(koulutusData, 'metadata.kuvaus', koulutusKuvausData);
    } else if (koulutusData?.koulutustyyppi === TYYPPI_AMM_TUTKINNON_OSA) {
      const tutkinnonOsat = koulutusData?.metadata?.tutkinnonOsat ?? [];
      const eperusteet = _.uniq(tutkinnonOsat.map((t) => t.ePerusteId));

      let e = [];
      for (const index in eperusteet) {
        const id = eperusteet[index];
        const eperuste = await getEperusteKuvaus(id);
        e.push(eperuste);
      }

      let yksikko = tutkinnonOsat[0]?.opintojenLaajuusyksikko;
      let pisteet = tutkinnonOsat
        .map((tutkinnonOsa) => tutkinnonOsa.opintojenLaajuusNumero)
        .join(' + ');

      _.set(koulutusData, 'metadata.opintojenLaajuusyksikko', yksikko);
      _.set(koulutusData, 'metadata.opintojenLaajuus', {
        nimi: {
          sv: pisteet,
          fi: pisteet,
          en: pisteet,
        },
      });

      _.set(koulutusData, 'eperusteet', e);
    }
    dispatch(fetchKoulutusSuccess({ oid, koulutus: koulutusData }));
  } catch (err) {
    dispatch(fetchKoulutusError(err.toString()));
  }
};

export const fetchSuositellutKoulutukset = (oid) => async (dispatch) => {
  try {
    dispatch(fetchSuositellutKoulutuksetStart());
    const suositellutKoulutuksetData = await getSuositellutKoulutukset({
      koulutukset: oid,
    });
    dispatch(fetchSuositellutKoulutuksetSuccess({ oid, suositellutKoulutuksetData }));
  } catch (error) {}
};

export const fetchKoulutusJarjestajat = (oid) => async (dispatch) => {
  try {
    dispatch(fetchJarjestajatStart());
    const jarjestajatData = await getKoulutusJarjestajat(oid);
    const tulevatJarjestajat = await getKoulutusJarjestajat(oid, true);
    dispatch(
      fetchJarjestajatSuccess({
        oid,
        jarjestajat: jarjestajatData,
        tulevatJarjestajat,
      })
    );
  } catch (err) {
    dispatch(fetchJarjestajatError(err.toString()));
  }
};

export const fetchKoulutusWithRelatedData = (oid, draft) => {
  return (dispatch) => {
    Promise.all([
      dispatch(fetchKoulutus(oid, draft)),
      dispatch(fetchSuositellutKoulutukset(oid)),
      dispatch(fetchKoulutusJarjestajat(oid)),
    ]);
  };
};

export const selectKoulutus = (oid) => (state) => {
  const koulutusData = state.koulutus.koulutukset[oid];
  if (koulutusData) {
    return {
      kuvaus: koulutusData.metadata?.kuvaus,
      eperusteet: koulutusData.eperusteet,
      tutkinnonOsat: koulutusData.metadata?.tutkinnonOsat,
      tyotehtavatJoissaVoiToimia:
        koulutusData.metadata?.kuvaus?.tyotehtavatJoissaVoiToimia,
      suorittaneenOsaaminen: koulutusData.metadata?.kuvaus?.suorittaneenOsaaminen,
      koulutusAla: koulutusData.metadata?.koulutusala,
      tutkintoNimi: koulutusData?.nimi,
      tutkintoNimikkeet: koulutusData.metadata?.tutkintonimike,
      opintojenLaajuus: koulutusData.metadata?.opintojenLaajuus,
      opintojenLaajuusYksikkö: koulutusData.metadata?.opintojenLaajuusyksikko,
      koulutusTyyppi: koulutusData.metadata?.tyyppi,
      lisatiedot: koulutusData.metadata?.lisatiedot,
      teemakuva: koulutusData?.teemakuva,
    };
  } else {
    return undefined;
  }
};

export const selectSuositellutKoulutukset = (state) =>
  state.koulutus.suositellutKoulutukset;

export const selectLoading = (state) =>
  state.koulutus.koulutusStatus === LOADING_STATUS ||
  state.koulutus.jarjestajatStatus === LOADING_STATUS;

export const selectJarjestajat = (oid) => (state) =>
  state.koulutus.jarjestajat[oid]?.hits;

export const selectTulevatJarjestajat = (state, oid) =>
  state.koulutus.tulevatJarjestajat[oid]?.hits;
