import { createSlice } from '@reduxjs/toolkit';
import {
  getKoulutus,
  getKoulutusKuvaus,
  getKoulutusJarjestajat,
} from '../api/konfoApi';
import _ from 'lodash';

export const initialState = {
  loading: 0,
  koulutukset: {},
  jarjestajat: {},
  error: null,
};

const fetchStart = (state) => (state.loading += 1);
const fetchFail = (state, action) => {
  state.loading -= 1;
  state.error = action.payload;
};

const koulutusSlice = createSlice({
  name: 'koulutus',
  initialState,
  reducers: {
    fetchKoulutusStart(state) {
      fetchStart(state);
    },
    fetchJarjestajatStart(state) {
      fetchStart(state);
    },
    fetchKoulutusSuccess(state, { payload }) {
      const { koulutus, oid } = payload;
      state.koulutukset[oid] = koulutus;
      state.loading -= 1;
      state.error = null;
    },
    fetchJarjestajatSuccess(state, { payload }) {
      const { jarjestajat, oid } = payload;
      state.jarjestajat[oid] = jarjestajat;
      state.loading -= 1;
      state.error = null;
    },
    fetchJarjestajatError: fetchFail,
    fetchKoulutusError: fetchFail,
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

export const fetchKoulutus = (oid) => async (dispatch) => {
  try {
    dispatch(fetchKoulutusStart());
    const koulutusData = await getKoulutus(oid);
    if (koulutusData?.koulutustyyppi === 'amm') {
      const koulutusKuvausData = await getKoulutusKuvaus(
        koulutusData.koulutus.koodiUri
      );
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

export const fetchKoulutusAndJarjestajat = (oid) => {
  return (dispatch) => {
    Promise.all([
      dispatch(fetchKoulutus(oid)),
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
