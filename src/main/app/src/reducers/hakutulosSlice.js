import { createSlice } from '@reduxjs/toolkit';
import { searchAPI } from '#/src/api/konfoApi';
import _ from 'lodash';
import { Localizer as l } from '#/src/tools/Utils';
import { FILTER_TYPES } from '#/src/constants';

const IDLE_STATUS = 'idle';
const LOADING_STATUS = 'loading';
const KOULUTUS = 'koulutus';
const OPPILAITOS = 'oppilaitos';

export const initialState = {
  loading: 0,
  status: IDLE_STATUS,
  error: null,
  keyword: '',
  keywordEditMode: false,
  // Koulutukset
  koulutusHits: [],
  koulutusFilters: {},
  koulutusCount: null,
  koulutusTotal: null,
  koulutusOffset: 0,
  koulutusPage: 1,
  // Oppilaitokset
  oppilaitosHits: [],
  oppilaitosFilters: {},
  oppilaitosCount: null,
  oppilaitosTotal: null,
  oppilaitosOffset: 0,
  oppilaitosPage: 1,
  // Suodattimet
  koulutustyyppi: [],
  koulutusala: [],
  opetuskieli: [],
  sijainti: [],
  selectedSijainti: [],

  size: 20,
  selectedTab: KOULUTUS,
  order: 'desc',
  sort: 'score',
  pageSizeArray: [5, 10, 20, 30, 50],
  pageSortArray: ['score_desc', 'name_asc', 'name_desc'],
  showHakutulosFilters: false,
};

const fetchStart = (state) => {
  if (state.status === IDLE_STATUS) {
    state.loading += 1;
    state.status = LOADING_STATUS;
  }
};
const fetchFail = (state, action) => {
  if (state.status === LOADING_STATUS) {
    state.loading -= 1;
    state.error = action.payload;
    state.status = IDLE_STATUS;
  }
};

const hakutulosSlice = createSlice({
  name: 'hakutulos',
  initialState,
  reducers: {
    setKeyword: (state, { payload }) => {
      state.keyword = payload.keyword;
    },
    setKeywordEditMode: (state, { payload }) => {
      state.keywordEditMode = payload.newKeywordEditMode;
    },
    setSelectedTab: (state, { payload }) => {
      state.selectedTab = payload.newSelectedTab;
    },
    setKoulutusOffsetAndPage: (state, { payload }) => {
      state.koulutusOffset = payload.koulutusOffset;
      state.koulutusPage = payload.koulutusPage;
    },
    setOppilaitosOffsetAndPage: (state, { payload }) => {
      state.oppilaitosOffset = payload.oppilaitosOffset;
      state.oppilaitosPage = payload.oppilaitosPage;
    },
    setOpetuskieli: (state, { payload }) => {
      state.opetuskieli = payload.newCheckedOpetuskielet;
    },
    setKoulutustyyppi: (state, { payload }) => {
      state.koulutustyyppi = payload.newCheckedKoulutustyypit;
    },
    setSijainti: (state, { payload }) => {
      state.sijainti = payload.newCheckedOrSelectedMaakunnat;
    },
    setSelectedSijainti: (state, { payload }) => {
      state.selectedSijainti = payload.newSelectedSijainnit;
    },
    setKoulutusala: (state, { payload }) => {
      state.koulutusala = payload.newCheckedKoulutusalat;
    },
    clearOffsetAndPaging: (state, action) => {
      state.koulutusPage = 1;
      state.oppilaitosPage = 1;
      state.koulutusOffset = 0;
      state.oppilaitosOffset = 0;
    },
    setSelectedFilters: (state, { payload }) => {
      const { filterType, itemId } = payload;
      if (filterType === 'sijainti') {
        state.sijainti = state.sijainti.filter(({ id }) => id !== itemId);
        state.selectedSijainti = state.selectedSijainti.filter(({ id }) => id !== itemId);
      } else {
        state[filterType] = state[filterType].filter(({ id }) => id !== itemId);
      }
    },
    clearSelectedFilters: (state, action) => {
      state.koulutustyyppi = [];
      state.koulutusala = [];
      state.opetuskieli = [];
      state.sijainti = [];
      state.selectedSijainti = [];
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
    toggleshowHakutulosFilters: (state, action) => {
      state.showHakutulosFilters = !state.showHakutulosFilters;
    },
    searchAPICallStart(state) {
      fetchStart(state);
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
        state.koulutusCount = _.size(koulutusData.hits);
        state.koulutusFilters = koulutusData.filters;
        state.koulutusTotal = koulutusData.total;
        state.oppilaitosHits = oppilaitosData.hits;
        state.oppilaitosCount = _.size(oppilaitosData.hits);
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
        if (isReload) {
          _.forEach(literals, (val, key) => {
            state[key] = val;
          });
          _.forEach(filters, (idsStr, key) => {
            switch (key) {
              case FILTER_TYPES.KOULUTUSTYYPPI:
                const koulutustyyppiFilters = pullUpAlakoodit(
                  koulutusData?.filters?.[key]
                );
                state[key] = getCheckedFilterValues(idsStr, koulutustyyppiFilters);
                break;
              case FILTER_TYPES.KOULUTUSALA:
                const koulutusalaFilters = pullUpAlakoodit(koulutusData?.filters?.[key]);
                state[key] = getCheckedFilterValues(idsStr, koulutusalaFilters);
                break;
              case FILTER_TYPES.SIJAINTI:
                const maakunnatIds = _.split(idsStr, ',').filter((id) =>
                  _.startsWith(id, 'maakunta_')
                );
                const kunnatIds = _.split(idsStr, ',').filter((id) =>
                  _.startsWith(id, 'kunta_')
                );
                if (_.size(maakunnatIds) > 0) {
                  state.sijainti = getCheckedFilterValues(
                    maakunnatIds.join(','),
                    koulutusData?.filters?.maakunta
                  );
                }
                if (_.size(kunnatIds) > 0) {
                  state.selectedSijainti = getSelectedKunnatFilterValues(
                    kunnatIds,
                    koulutusData?.filters?.kunta
                  );
                }
                break;
              default:
                state[key] = getCheckedFilterValues(idsStr, koulutusData.filters[key]);
                break;
            }
          });
        }

        state.loading -= 1;
        state.error = null;
        state.status = IDLE_STATUS;
      }
    },
    searchKoulutuksetSuccess(state, { payload }) {
      if (state.status === LOADING_STATUS) {
        const { koulutusData } = payload;
        state.koulutusHits = koulutusData.hits;
        state.koulutusCount = _.size(koulutusData.hits);
        state.loading -= 1;
        state.error = null;
        state.status = IDLE_STATUS;
      }
    },
    searchOppilaitoksetSuccess(state, { payload }) {
      if (state.status === LOADING_STATUS) {
        const { oppilaitosData } = payload;
        state.oppilaitosHits = oppilaitosData.hits;
        state.oppilaitosCount = _.size(oppilaitosData.hits);
        state.loading -= 1;
        state.error = null;
        state.status = IDLE_STATUS;
      }
    },
    searchAPICallError: fetchFail,
  },
});

export const {
  setKeyword,
  setKeywordEditMode,
  setSelectedTab,
  searchAPICallStart,
  searchAPICallError,
  setOpetuskieli,
  setKoulutustyyppi,
  setKoulutusala,
  setSijainti,
  setSelectedSijainti,
  clearOffsetAndPaging,
  clearSelectedFilters,
  setSelectedFilters,
  setOrder,
  setSort,
  toggleshowHakutulosFilters,
  setSize,
  setKoulutusOffsetAndPage,
  setOppilaitosOffsetAndPage,
  searchAllSuccess,
  searchKoulutuksetSuccess,
  searchOppilaitoksetSuccess,
} = hakutulosSlice.actions;
export default hakutulosSlice.reducer;

export const searchAll = (
  requestParams,
  isNewKeyword = false,
  isReload = false
) => async (dispatch) => {
  try {
    dispatch(searchAPICallStart());
    const koulutusData = await searchAPI.getKoulutukset(requestParams);
    const oppilaitosData = await searchAPI.getOppilaitokset(requestParams);
    const filters = _.pick(requestParams, [
      'opetuskieli',
      'koulutustyyppi',
      'koulutusala',
      'sijainti',
    ]);
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
export const searchKoulutukset = (requestParams) => async (dispatch) => {
  try {
    dispatch(searchAPICallStart());
    const koulutusData = await searchAPI.getKoulutukset(requestParams);
    dispatch(searchKoulutuksetSuccess({ koulutusData }));
  } catch (err) {
    dispatch(searchAPICallError(err.toString()));
  }
};
export const searchOppilaitokset = (requestParams) => async (dispatch) => {
  try {
    dispatch(searchAPICallStart());
    const oppilaitosData = await searchAPI.getOppilaitokset(requestParams);
    dispatch(searchOppilaitoksetSuccess({ oppilaitosData }));
  } catch (err) {
    dispatch(searchAPICallError(err.toString()));
  }
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

function pullUpAlakoodit(obj) {
  return _.entries(obj).reduce((result, entry) => {
    let alakoodit = _.has(entry[1], 'alakoodit') ? entry[1].alakoodit : {};
    return { ...result, [entry[0]]: entry[1], ...alakoodit };
  }, {});
}

function getSelectedKunnatFilterValues(kunnatIds, kunnatFilters) {
  return kunnatIds.reduce((result, id) => {
    return _.has(kunnatFilters, id)
      ? [
          ...result,
          {
            label: `${kunnatFilters?.[id]?.nimi?.[l.getLanguage()]} (${
              kunnatFilters?.[id]?.count
            })`,
            value: kunnatFilters?.[id]?.nimi?.[l.getLanguage()],
            isMaakunta: false,
            id: id,
            name: kunnatFilters?.[id]?.nimi,
          },
        ]
      : result;
  }, []);
}
