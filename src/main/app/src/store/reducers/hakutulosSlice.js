import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

import { searchAPI } from '#/src/api/konfoApi';
import { FILTER_TYPES, FILTER_TYPES_ARR } from '#/src/constants';
import { getLanguage } from '#/src/tools/localization';
import { Common as C } from '#/src/tools/Utils';

import { getAPIRequestParams } from './hakutulosSliceSelector';

const INITIAL = 'initial';
const IDLE_STATUS = 'idle';
const LOADING_STATUS = 'loading';
const KOULUTUS = 'koulutus';
const OPPILAITOS = 'oppilaitos';

export const initialState = {
  status: INITIAL,
  error: null,
  keyword: '',
  // Koulutukset
  koulutusHits: [],
  koulutusFilters: {},
  koulutusTotal: null,
  koulutusOffset: 0,
  koulutusPage: 1,
  // Oppilaitokset
  oppilaitosHits: [],
  oppilaitosFilters: {},
  oppilaitosTotal: null,
  oppilaitosOffset: 0,
  oppilaitosPage: 1,
  // Selected filter values
  // TODO: Refactor this to contain *only* ids, now it contains also names which are only used at SuodatinValinnat
  koulutustyyppi: [],
  'koulutustyyppi-muu': [],
  koulutusala: [],
  opetuskieli: [],
  valintatapa: [],
  hakukaynnissa: false,
  hakutapa: [],
  yhteishaku: [], // NOTE: tämä suodatin ei käytä koodistoarvoja vaan hakuOideja
  kunta: [],
  maakunta: [],
  opetustapa: [],
  pohjakoulutusvaatimus: [],

  size: 20,
  selectedTab: KOULUTUS,
  order: 'desc',
  sort: 'score',
};

const hakutulosSlice = createSlice({
  name: 'hakutulos',
  initialState,
  reducers: {
    setKeyword: (state, { payload }) => {
      state.keyword = payload.keyword;
    },
    setSelectedTab: (state, { payload }) => {
      state.selectedTab = payload.newSelectedTab;
    },
    // NOTE: Tämä on uusi rajapinta eikä kaikki rajaimet vielä käytä tätä
    // TODO: Muokkaa kaikki rajaimet käyttämään tätä
    // payload [{id: string, item: FilterValue, operation: "SET" | "UNSET" | "TOGGLE"}]
    handleFilterOperations: (state, { payload: filterOperations = [] }) => {
      filterOperations.forEach(({ item, operation = 'TOGGLE' }) => {
        console.log('item', item);
        const id = item.filterId;
        const exists = state[id].some(({ id: itemId }) => item.id === itemId);
        const shouldAdd = (operation === 'SET' || operation === 'TOGGLE') && !exists;
        const shouldRemove = (operation === 'UNSET' || operation === 'TOGGLE') && exists;
        if (shouldAdd) {
          state[id] = state[id].concat({ id: item.id, nimi: item.nimi, name: item.nimi }); // TODO: Remove name from here when it is refactored away
        } else if (shouldRemove) {
          state[id] = state[id].filter(({ id: itemId }) => item.id !== itemId);
        }
      });
    },
    toggleHakukaynnissa: (state) => {
      state.hakukaynnissa = !state.hakukaynnissa;
    },
    clearPaging: (state) => {
      state.koulutusPage = 1;
      state.oppilaitosPage = 1;
      state.koulutusOffset = 0;
      state.oppilaitosOffset = 0;
    },
    setSelectedFilters: (state, { payload }) => {
      const { filterType, itemId } = payload;
      state[filterType] = state[filterType].filter(({ id }) => id !== itemId);
    },
    clearSelectedFilters: (state) => {
      state.koulutustyyppi = [];
      state['koulutustyyppi-muu'] = [];
      state.koulutusala = [];
      state.opetuskieli = [];
      state.valintatapa = [];
      state.hakukaynnissa = false;
      state.hakutapa = [];
      state.yhteishaku = [];
      state.kunta = [];
      state.maakunta = [];
      state.opetustapa = [];
      state.pohjakoulutusvaatimus = [];
    },
    setSize: (state, { payload }) => {
      state.size = payload.newSize;
    },
    setOrder: (state, { payload }) => {
      state.order = payload.newOrder;
    },
    setSort: (state, { payload }) => {
      state.sort = payload.newSort;
    },
    searchAPICallStart(state) {
      if (state.status === INITIAL || state.status === IDLE_STATUS) {
        state.status = LOADING_STATUS;
      }
    },
    searchAllSuccess(state, { payload }) {
      if (state.status === LOADING_STATUS) {
        const {
          koulutusData,
          oppilaitosData,
          isNewKeyword,
          isReload,
          filters,
          literals,
        } = payload;
        state.koulutusHits = koulutusData.hits;
        state.koulutusFilters = koulutusData.filters;
        state.koulutusTotal = koulutusData.total;
        state.oppilaitosHits = oppilaitosData.hits;
        state.oppilaitosFilters = oppilaitosData.filters;
        state.oppilaitosTotal = oppilaitosData.total;
        if (
          _.size(koulutusData.hits) === 0 &&
          _.size(oppilaitosData.hits) > 0 &&
          isNewKeyword
        ) {
          state.selectedTab = OPPILAITOS;
        } else if (_.size(koulutusData.hits) > 0 && isNewKeyword) {
          state.selectedTab = KOULUTUS;
        }

        // NOTE: Tämä asettaa ja kääntää initial arvot stateen
        // TODO: Tästä pitäisi purkaa käännettyjen arvojen tallennus stateen
        if (isReload) {
          _.forEach(literals, (val, key) => {
            state[key] = val;
          });
          _.forEach(filters, (filterValues, key) => {
            switch (key) {
              case FILTER_TYPES.HAKUKAYNNISSA:
                state.hakukaynnissa = filterValues === 'true';
                break;
              default:
                state[key] = getCheckedFilterValues(
                  filterValues,
                  koulutusData.filters[key]
                );
                break;
            }
          });
        }

        state.error = null;
        state.status = IDLE_STATUS;
      }
    },
    searchKoulutuksetSuccess(state, { payload }) {
      if (state.status === LOADING_STATUS) {
        const { koulutusData, koulutusOffset, koulutusPage } = payload;
        state.koulutusHits = koulutusData.hits;
        state.koulutusOffset = koulutusOffset;
        state.koulutusPage = koulutusPage;
        state.error = null;
        state.status = IDLE_STATUS;
      }
    },
    searchOppilaitoksetSuccess(state, { payload }) {
      if (state.status === LOADING_STATUS) {
        const { oppilaitosData, oppilaitosOffset, oppilaitosPage } = payload;
        state.oppilaitosHits = oppilaitosData.hits;
        state.oppilaitosOffset = oppilaitosOffset;
        state.oppilaitosPage = oppilaitosPage;
        state.error = null;
        state.status = IDLE_STATUS;
      }
    },
    searchAPICallError(state, action) {
      if (state.status === LOADING_STATUS) {
        state.error = action.payload;
        state.status = IDLE_STATUS;
      }
    },
  },
});

export const {
  setKeyword,
  setSelectedTab,
  searchAPICallStart,
  searchAPICallError,
  handleFilterOperations,
  toggleHakukaynnissa,
  clearPaging,
  clearSelectedFilters,
  setSelectedFilters,
  setOrder,
  setSort,
  setSize,
  searchAllSuccess,
  searchKoulutuksetSuccess,
  searchOppilaitoksetSuccess,
} = hakutulosSlice.actions;

export default hakutulosSlice.reducer;

// TODO: Remove Searchall when all filters use this
export const newSearchAll = () => async (dispatch, getState) => {
  const state = getState();
  const requestParams = getAPIRequestParams(state);
  dispatch(clearPaging());

  try {
    dispatch(searchAPICallStart());
    const koulutusData = await searchAPI.getKoulutukset(requestParams);
    const oppilaitosData = await searchAPI.getOppilaitokset(requestParams);

    const filters = _.pick(requestParams, FILTER_TYPES_ARR);
    const literals = _.pick(requestParams, ['size', 'order', 'sort']);
    dispatch(
      searchAllSuccess({
        koulutusData,
        oppilaitosData,
        filters,
        literals,
      })
    );
  } catch (err) {
    dispatch(searchAPICallError(err.toString()));
  }
};

export const searchAll = (
  requestParams,
  isNewKeyword = false,
  isReload = false
) => async (dispatch) => {
  try {
    dispatch(searchAPICallStart());
    const koulutusData = await searchAPI.getKoulutukset(requestParams);
    const oppilaitosData = await searchAPI.getOppilaitokset(requestParams);
    const filters = _.pick(requestParams, FILTER_TYPES_ARR);
    const literals = _.pick(requestParams, ['size', 'order', 'sort']);
    dispatch(
      searchAllSuccess({
        koulutusData,
        oppilaitosData,
        isNewKeyword,
        isReload,
        filters,
        literals,
      })
    );
  } catch (err) {
    dispatch(searchAPICallError(err.toString()));
  }
};

export const searchKoulutukset = ({
  requestParams,
  koulutusOffset,
  koulutusPage,
}) => async (dispatch) => {
  try {
    dispatch(searchAPICallStart());
    const koulutusData = await searchAPI.getKoulutukset(requestParams);
    dispatch(searchKoulutuksetSuccess({ koulutusData, koulutusOffset, koulutusPage }));
  } catch (err) {
    dispatch(searchAPICallError(err.toString()));
  }
};

export const searchOppilaitokset = ({
  requestParams,
  oppilaitosOffset,
  oppilaitosPage,
}) => async (dispatch) => {
  try {
    dispatch(searchAPICallStart());
    const oppilaitosData = await searchAPI.getOppilaitokset(requestParams);
    dispatch(
      searchOppilaitoksetSuccess({ oppilaitosData, oppilaitosOffset, oppilaitosPage })
    );
  } catch (err) {
    dispatch(searchAPICallError(err.toString()));
  }
};

export const searchAllOnPageReload = ({ search, keyword }) => (dispatch, getState) => {
  const state = getState();
  const apiRequestParams = getAPIRequestParams(state);
  const cleanedUrlSearch = getCleanUrlSearch(search, apiRequestParams);
  const { hakutulos } = state;

  if (!_.isMatch(apiRequestParams, { ...cleanedUrlSearch, keyword })) {
    dispatch(setKeyword({ keyword }));
    dispatch(
      searchAll(
        C.cleanRequestParams({ ...apiRequestParams, keyword, ...cleanedUrlSearch }),
        hakutulos.keyword !== keyword,
        true
      )
    );
  }
};

export const searchAndMoveToHaku = ({ history }) => (dispatch, getState) => {
  const { hakutulos } = getState();
  const apiRequestParams = getAPIRequestParams({ hakutulos });
  const lng = getLanguage();
  const restParams = new URLSearchParams(
    _.pick(C.cleanRequestParams(apiRequestParams), [
      'order',
      'size',
      'opetuskieli',
      'valintatapa',
      'hakukaynnissa',
      'hakutapa',
      'yhteishaku',
      'koulutustyyppi',
      'koulutusala',
      'sijainti',
      'opetustapa',
      'pohjakoulutusvaatimus',
    ])
  ).toString();
  history.push(`/${lng}/haku/${hakutulos.keyword}?${restParams}`);
  dispatch(searchAll(apiRequestParams, true));
};

// Helpers
function getCheckedFilterValues(ids, koulutusFilters) {
  const idsArray = _.split(ids, ',');
  return idsArray.reduce((result, id) => {
    return _.has(koulutusFilters, id)
      ? [...result, { id: id, name: koulutusFilters?.[id]?.nimi }]
      : result;
  }, []);
}

function getCleanUrlSearch(search, apiRequestParams) {
  return _.mapValues(_.pick(search, _.keys(apiRequestParams)), (value, key) =>
    _.includes(FILTER_TYPES_ARR, key) ? _.join(_.sortBy(_.split(value, ',')), ',') : value
  );
}
