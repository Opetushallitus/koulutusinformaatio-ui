import { createSlice } from '@reduxjs/toolkit';
import {
  getKoulutus,
  getKoulutusKuvaus,
  getKoulutusJarjestajat,
} from '#/src/api/konfoApi';
import _ from 'lodash';

const IDLE_STATUS = 'idle';
const LOADING_STATUS = 'loading';

export const initialState = {
  koulutusStatus: IDLE_STATUS,
  jarjestajatStatus: IDLE_STATUS,
  koulutukset: {},
  jarjestajat: {},
  koulutusError: null,
  jarjestajatError: null,
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
    fetchJarjestajatSuccess(state, { payload }) {
      if (state.jarjestajatStatus === LOADING_STATUS) {
        const { jarjestajat, oid } = payload;
        state.jarjestajat[oid] = jarjestajat;
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
  },
});

export const {
  fetchKoulutusStart,
  fetchKoulutusSuccess,
  fetchKoulutusError,
  fetchJarjestajatStart,
  fetchJarjestajatSuccess,
  fetchJarjestajatError,
} = koulutusSlice.actions;
export default koulutusSlice.reducer;

export const fetchKoulutus = (oid, draft) => async (dispatch) => {
  try {
    dispatch(fetchKoulutusStart());
    const koulutusData = await getKoulutus(oid, draft);
    if (koulutusData?.koulutustyyppi === 'amm') {
      const koulutusKuvausData = await getKoulutusKuvaus(koulutusData.koulutus.koodiUri);
      _.set(koulutusData, 'metadata.kuvaus', koulutusKuvausData);
    }
    dispatch(fetchKoulutusSuccess({ oid, koulutus: koulutusData }));
  } catch (err) {
    dispatch(fetchKoulutusError(err.toString()));
  }
};

export const fetchKoulutusJarjestajat = (oid) => async (dispatch) => {
  try {
    dispatch(fetchJarjestajatStart());
    const jarjestajatData = await getKoulutusJarjestajat(oid);
    dispatch(fetchJarjestajatSuccess({ oid, jarjestajat: jarjestajatData }));
  } catch (err) {
    dispatch(fetchJarjestajatError(err.toString()));
  }
};

export const fetchKoulutusWithRelatedData = (oid, draft) => {
  return (dispatch) => {
    Promise.all([
      dispatch(fetchKoulutus(oid, draft)),
      dispatch(fetchKoulutusJarjestajat(oid)),
    ]);
  };
};

export const selectKoulutus = (state, oid) => {
  const koulutusData = state.koulutus.koulutukset[oid];
  if (koulutusData) {
    return {
      kuvaus: koulutusData.metadata?.kuvaus?.kuvaus,
      koulutusAla: koulutusData.metadata?.koulutusala,
      tutkintoNimi: koulutusData?.nimi,
      tutkintoNimikkeet: koulutusData.metadata?.tutkintonimike,
      opintojenLaajuus: koulutusData.metadata?.opintojenLaajuus,
      opintojenLaajuusYksikkö: koulutusData.metadata?.opintojenLaajuusyksikko,
      koulutusTyyppi: koulutusData.metadata?.tyyppi,
      lisatiedot: koulutusData.metadata?.lisatiedot,
    };
  } else {
    return undefined;
  }
};

export const selectLoading = (state) => state.koulutus.loading;
export const selectJarjestajat = (state, oid) => state.koulutus.jarjestajat[oid]?.hits;
