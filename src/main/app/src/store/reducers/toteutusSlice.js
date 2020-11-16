import { createSlice } from '@reduxjs/toolkit';
import { getToteutus } from '#/src/api/konfoApi';
import { isBefore, isAfter } from 'date-fns';
import pick from 'lodash/pick';

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

export const isHakuAuki = (hakuajat) =>
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

const HAKULOMAKETYYPPI_MUU = 'muu';
const HAKULOMAKETYYPPI_EI_SAHKOISTA = 'ei sähköistä';

export const selectMuuHaku = (oid) => (state) => {
  const toteutus = selectToteutus(oid)(state);
  const hakuAuki = isHakuAuki([toteutus.metadata.hakuaika]);

  // TODO: SORA-kuvaus - atm. we only get an Id from the API but we cannot do anything with it
  return {
    ...pick(toteutus.metadata, [
      'aloituspaikat',
      'hakuaika',
      'hakulomakeLinkki',
      'hakutermi',
      'lisatietoaHakeutumisesta',
      'lisatietoaValintaperusteista',
    ]),
    isHakuAuki: hakuAuki,
    nimi: toteutus.nimi,
    // TODO: we do not get osoite from the API atm. so just use all the tarjoajat to fetch oppilaitoksenOsat
    // This should be replaced with just the osoite when we have it in the API
    tarjoajat: toteutus.tarjoajat,
  };
};

export const selectEiSahkoistaHaku = (oid) => (state) => {
  const toteutus = selectToteutus(oid)(state);
  return {
    ...pick(toteutus.metadata, ['lisatietoaHakeutumisesta']),
  };
};

export const selectToteutus = (oid) => (state) => {
  const toteutus = state.toteutus.toteutukset[oid];
  return (
    toteutus && {
      ...toteutus,
      hasMuuHaku: toteutus?.metadata?.hakulomaketyyppi === HAKULOMAKETYYPPI_MUU,
      hasEiSahkoistaHaku:
        toteutus?.metadata?.hakulomaketyyppi === HAKULOMAKETYYPPI_EI_SAHKOISTA,
    }
  );
};
