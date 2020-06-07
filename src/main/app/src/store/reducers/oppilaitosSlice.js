import { createSlice } from '@reduxjs/toolkit';
import { getOppilaitos, getOppilaitosTajonta } from '#/src/api/konfoApi';
import { Localizer as l } from '#/src/tools/Utils';

const IDLE_STATUS = 'idle';
const LOADING_STATUS = 'loading';

export const initialState = {
  status: IDLE_STATUS,
  oppilaitokset: {},
  tarjonta: {},
  tulevaTarjonta: {},
  page: 1,
  size: 5,
  offset: 0,
  tulevaPage: 1,
  tulevaSize: 3,
  tulevaOffset: 0,
  order: 'asc',
  oppilaitosError: null,
};

const oppilaitosSlice = createSlice({
  name: 'oppilaitos',
  initialState,
  reducers: {
    fetchOppilaitosStart(state) {
      if (state.status === IDLE_STATUS) {
        state.status = LOADING_STATUS;
      }
    },
    fetchOppilaitosSuccess(state, { payload }) {
      if (state.status === LOADING_STATUS) {
        const { oid, oppilaitosData, tarjonta, tulevaTarjonta } = payload;
        state.oppilaitokset[oid] = oppilaitosData;
        state.tarjonta[oid] = tarjonta;
        state.tulevaTarjonta[oid] = tulevaTarjonta;
        state.tulevaPage = 1;
        state.tulevaOffset = 0;
        state.page = 1;
        state.offset = 0;
        state.oppilaitosError = null;
        state.status = IDLE_STATUS;
      }
    },
    fetchTarjontaSuccess(state, { payload }) {
      const { oid, tarjonta, page, offset } = payload;
      state.tarjonta[oid] = tarjonta;
      state.page = page;
      state.offset = offset;
      state.oppilaitosError = null;
      state.status = IDLE_STATUS;
    },
    fetchTulevaTarjontaSuccess(state, { payload }) {
      const { oid, tulevaTarjonta, page, offset } = payload;
      state.tulevaTarjonta[oid] = tulevaTarjonta;
      state.tulevaPage = page;
      state.tulevaOffset = offset;
      state.oppilaitosError = null;
      state.status = IDLE_STATUS;
    },
    fetchOppilaitosError(state, action) {
      if (state.status === LOADING_STATUS) {
        state.oppilaitosError = action.payload;
        state.status = IDLE_STATUS;
      }
    },
  },
});

export const {
  fetchOppilaitosStart,
  fetchOppilaitosSuccess,
  fetchTarjontaSuccess,
  fetchTulevaTarjontaSuccess,
  fetchOppilaitosError,
} = oppilaitosSlice.actions;
export default oppilaitosSlice.reducer;

export const fetchOppilaitosTarjontaData = ({ oid }) => async (dispatch, getState) => {
  const { oppilaitos } = getState();
  try {
    dispatch(fetchOppilaitosStart());
    const oppilaitosData = await getOppilaitos(oid);
    const tarjonta = await getOppilaitosTajonta({
      oid,
      requestParams: {
        page: oppilaitos.page,
        size: oppilaitos.size,
        lng: l.getLanguage(),
        order: oppilaitos.order,
      },
    });
    const tulevaTarjonta = await getOppilaitosTajonta({
      oid,
      requestParams: {
        tuleva: true,
        page: oppilaitos.tulevaPage,
        size: oppilaitos.tulevaSize,
        lng: l.getLanguage(),
        order: oppilaitos.order,
      },
    });
    dispatch(fetchOppilaitosSuccess({ oid, oppilaitosData, tarjonta, tulevaTarjonta }));
  } catch (err) {
    dispatch(fetchOppilaitosError(err.toString()));
  }
};

export const fetchTarjontaData = ({ oid, requestParams }) => async (dispatch) => {
  try {
    const tarjonta = await getOppilaitosTajonta({ oid, requestParams });
    dispatch(fetchTarjontaSuccess({ oid, tarjonta, ...requestParams }));
  } catch (err) {
    dispatch(fetchOppilaitosError(err.toString()));
  }
};

export const fetchTulevaTarjontaData = ({ oid, requestParams }) => async (dispatch) => {
  try {
    const tulevaTarjonta = await getOppilaitosTajonta({
      oid,
      requestParams: { ...requestParams, tuleva: true },
    });
    dispatch(fetchTulevaTarjontaSuccess({ oid, tulevaTarjonta, ...requestParams }));
  } catch (err) {
    dispatch(fetchOppilaitosError(err.toString()));
  }
};
