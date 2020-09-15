import { createSlice } from '@reduxjs/toolkit';
import {
  getOppilaitos,
  getOppilaitosTarjonta,
  getOppilaitosOsa,
  getOppilaitosOsaTarjonta,
} from '#/src/api/konfoApi';
import { Localizer as l } from '#/src/tools/Utils';

const IDLE_STATUS = 'idle';
const LOADING_STATUS = 'loading';

export const initialState = {
  status: IDLE_STATUS,
  oppilaitos: {},
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
        state.oppilaitos = payload.oppilaitosData;
        state.tarjonta = payload.tarjonta;
        state.tulevaTarjonta = payload.tulevaTarjonta;
        state.tulevaPage = 1;
        state.tulevaOffset = 0;
        state.page = 1;
        state.offset = 0;
        state.oppilaitosError = null;
        state.status = IDLE_STATUS;
      }
    },
    fetchTarjontaSuccess(state, { payload }) {
      state.tarjonta = payload.tarjonta;
      state.page = payload.page;
      state.offset = payload.offset;
      state.oppilaitosError = null;
      state.status = IDLE_STATUS;
    },
    fetchTulevaTarjontaSuccess(state, { payload }) {
      state.tulevaTarjonta = payload.tulevaTarjonta;
      state.tulevaPage = payload.page;
      state.tulevaOffset = payload.offset;
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

export const fetchOppilaitosTarjontaData = ({ oid, isOppilaitosOsa }) => async (
  dispatch
) => {
  try {
    dispatch(fetchOppilaitosStart());
    const oppilaitosData = await (isOppilaitosOsa
      ? getOppilaitosOsa(oid)
      : getOppilaitos(oid));
    const tarjontaOpts = {
      oid,
      requestParams: {
        page: initialState.page,
        size: initialState.size,
        lng: l.getLanguage(),
        order: initialState.order,
      },
    };
    const tarjonta = await (isOppilaitosOsa
      ? getOppilaitosOsaTarjonta(tarjontaOpts)
      : getOppilaitosTarjonta(tarjontaOpts));
    const tulevaTarjontaOpts = {
      oid,
      requestParams: {
        tuleva: true,
        page: initialState.tulevaPage,
        size: initialState.tulevaSize,
        lng: l.getLanguage(),
        order: initialState.order,
      },
    };
    const tulevaTarjonta = await (isOppilaitosOsa
      ? getOppilaitosOsaTarjonta(tulevaTarjontaOpts)
      : getOppilaitosTarjonta(tulevaTarjontaOpts));
    dispatch(fetchOppilaitosSuccess({ oid, oppilaitosData, tarjonta, tulevaTarjonta }));
  } catch (err) {
    dispatch(fetchOppilaitosError(err.toString()));
  }
};

export const fetchTarjontaData = ({ oid, requestParams, isOppilaitosOsa }) => async (
  dispatch
) => {
  try {
    const opts = { oid, requestParams };
    const tarjonta = await (isOppilaitosOsa
      ? getOppilaitosOsaTarjonta(opts)
      : getOppilaitosTarjonta(opts));
    dispatch(fetchTarjontaSuccess({ tarjonta, ...requestParams }));
  } catch (err) {
    dispatch(fetchOppilaitosError(err.toString()));
  }
};

export const fetchTulevaTarjontaData = ({
  oid,
  requestParams,
  isOppilaitosOsa,
}) => async (dispatch) => {
  try {
    const opts = {
      oid,
      requestParams: { ...requestParams, tuleva: true },
    };
    const tulevaTarjonta = await (isOppilaitosOsa
      ? getOppilaitosOsaTarjonta(opts)
      : getOppilaitosTarjonta(opts));
    dispatch(fetchTulevaTarjontaSuccess({ tulevaTarjonta, ...requestParams }));
  } catch (err) {
    dispatch(fetchOppilaitosError(err.toString()));
  }
};
