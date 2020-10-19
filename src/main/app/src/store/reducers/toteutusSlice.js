import { createSlice } from '@reduxjs/toolkit';
import { getToteutus } from '#/src/api/konfoApi';
import { isBefore, isAfter } from 'date-fns';

const IDLE_STATUS = 'idle';
const LOADING_STATUS = 'loading';

const JATKUVAHAKU = 'Jatkuva haku';
const ERILLISHAKU = 'Erillishaku';
const YHTEISHAKU = 'Yhteishaku';

export const initialState = {
  status: IDLE_STATUS,
  toteutukset: {},
  error: null,
};

const toteutusSlice = createSlice({
  name: 'toteutus',
  initialState,
  reducers: {
    fetchToteutusStart(state) {
      if (state.status === IDLE_STATUS) {
        state.status = LOADING_STATUS;
      }
    },
    fetchToteutusSuccess(state, { payload }) {
      if (state.status === LOADING_STATUS) {
        state.toteutukset[payload.oid] = payload;
        state.error = null;
        state.status = IDLE_STATUS;
      }
    },
    fetchToteutusFail(state, action) {
      if (state.koulutusStatus === LOADING_STATUS) {
        state.error = action.payload;
        state.status = IDLE_STATUS;
      }
    },
  },
});

export const {
  fetchToteutusStart,
  fetchToteutusSuccess,
  fetchToteutusFail,
} = toteutusSlice.actions;

export default toteutusSlice.reducer;

export const fetchToteutus = (oid) => async (dispatch) => {
  try {
    dispatch(fetchToteutusStart());
    const data = await getToteutus(oid);
    dispatch(fetchToteutusSuccess(data));
  } catch (err) {
    dispatch(fetchToteutusFail(err.toString()));
  }
};

const isHakuAuki = (hakuajat) =>
  hakuajat.some((hakuaika) => {
    const now = new Date();
    const isAfterStart = !hakuaika.alkaa || isAfter(now, new Date(hakuaika.alkaa));
    const isBeforeEnd = !hakuaika.paattyy || isBefore(now, new Date(hakuaika.paattyy));
    return isAfterStart && isBeforeEnd;
  });

const isHakuEndInFuture = (hakuajat) => {
  const now = new Date();
  return hakuajat.some((aika) => !aika.paattyy || isBefore(now, new Date(aika.paattyy)));
};

const selectHakukohteet = (state, oid, type) =>
  state.toteutus.toteutukset[oid]?.hakutiedot
    ?.filter((hakutieto) => hakutieto.hakutapa.nimi.fi === type)
    .map((hakutieto) => hakutieto.hakukohteet)
    .flat()
    .filter((hakukohde) => isHakuEndInFuture(hakukohde.hakuajat))
    .map((hakukohde) => ({ ...hakukohde, isHakuAuki: isHakuAuki(hakukohde.hakuajat) }));

export const selectLoading = (state) => state.toteutus.status === LOADING_STATUS;
export const selectJatkuvatHaut = (oid) => (state) =>
  selectHakukohteet(state, oid, JATKUVAHAKU);
export const selectErillisHaut = (oid) => (state) =>
  selectHakukohteet(state, oid, ERILLISHAKU);
export const selectYhteisHaut = (oid) => (state) =>
  selectHakukohteet(state, oid, YHTEISHAKU);
export const selectToteutus = (oid) => (state) => state.toteutus.toteutukset[oid];
