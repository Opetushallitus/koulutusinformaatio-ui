import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

import { searchAPI } from '#/src/api/konfoApi';
import { FILTER_TYPES, FILTER_TYPES_ARR } from '#/src/constants';
import { Localizer as l, Common as C } from '#/src/tools/Utils';

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
  koulutusala: [],
  opetuskieli: [],
  valintatapa: [],
  hakukaynnissa: false, // This is the only filter which functionality does not rely on koodisto
  hakutapa: [],
  sijainti: [],
  selectedSijainti: [],
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
    handleFilterToggle: (state, { payload }) => {
      const {
        filter,
        item: { id, nimi },
      } = payload;
      const exists = state[filter].some(({ id: itemId }) => id === itemId);
      state[filter] = exists
        ? state[filter].filter(({ id: itemId }) => id !== itemId)
        : state[filter].concat({ id, nimi, name: nimi }); // TODO: Remove name from here when it is refactored away
    },
    toggleHakukaynnissa: (state) => {
      state.hakukaynnissa = !state.hakukaynnissa;
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
    setOpetustapa: (state, { payload }) => {
      state.opetustapa = payload.newCheckedOpetustavat;
    },
    clearPaging: (state) => {
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
    clearSelectedFilters: (state) => {
      state.koulutustyyppi = [];
      state.koulutusala = [];
      state.opetuskieli = [];
      state.valintatapa = [];
      state.hakukaynnissa = false;
      state.hakutapa = [];
      state.sijainti = [];
      state.selectedSijainti = [];
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

        // NOTE: This sets and translates initial checked filter values
        // TODO: Really complex, refactor this
        // TODO: Especially because we shouldn't save translated values into selected values
        if (isReload) {
          _.forEach(literals, (val, key) => {
            state[key] = val;
          });
          _.forEach(filters, (filterValues, key) => {
            switch (key) {
              case FILTER_TYPES.KOULUTUSTYYPPI:
                const koulutustyyppiFilters = pullUpAlakoodit(
                  koulutusData?.filters?.[key]
                );
                const koulutustyyppiMuuFilters = pullUpAlakoodit(
                  koulutusData?.filters?.[`${key}-muu`]
                );
                state[key] = getCheckedFilterValues(
                  filterValues,
                  _.assign(koulutustyyppiFilters, koulutustyyppiMuuFilters)
                );
                break;
              case FILTER_TYPES.KOULUTUSALA:
                const koulutusalaFilters = pullUpAlakoodit(koulutusData?.filters?.[key]);
                state[key] = getCheckedFilterValues(filterValues, koulutusalaFilters);
                break;
              case FILTER_TYPES.SIJAINTI:
                const maakunnatIds = _.split(filterValues, ',').filter((id) =>
                  _.startsWith(id, 'maakunta_')
                );
                const kunnatIds = _.split(filterValues, ',').filter((id) =>
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
  setOpetuskieli,
  handleFilterToggle,
  toggleHakukaynnissa,
  setKoulutustyyppi,
  setKoulutusala,
  setSijainti,
  setSelectedSijainti,
  setOpetustapa,
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
  const lng = l.getLanguage();
  const restParams = new URLSearchParams(
    _.pick(C.cleanRequestParams(apiRequestParams), [
      'order',
      'size',
      'opetuskieli',
      'valintatapa',
      'hakukaynnissa',
      'hakutapa',
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

export const twoLevelFilterUpdateAndSearch = ({
  filterType,
  apiRequestParams,
  clickedFilterId,
  parentFilterId,
}) => (dispatch, getState) => {
  const { hakutulos } = getState();
  let filterCheckedValues = _.clone(_.get(hakutulos, filterType));
  const filterAllValues = getFilterAllValues(filterType, hakutulos);
  const firstLevelKeys = _.keys(filterAllValues);
  const isFirstFilterLevelId = _.includes(firstLevelKeys, clickedFilterId);
  const checkedIndex = _.findIndex(
    filterCheckedValues,
    ({ id }) => id === clickedFilterId
  );
  if (checkedIndex === -1) {
    if (isFirstFilterLevelId) {
      filterCheckedValues = getCheckedOnTaso01Clicked(
        filterAllValues,
        clickedFilterId,
        filterCheckedValues
      );
    } else if (_.includes(firstLevelKeys, parentFilterId)) {
      filterCheckedValues = getCheckedOnTaso02Clicked(
        filterAllValues,
        filterCheckedValues,
        clickedFilterId,
        parentFilterId
      );
    }
  } else {
    if (isFirstFilterLevelId) {
      const idsToRemove = getFilterIdsToRemove(filterAllValues, clickedFilterId);
      _.remove(filterCheckedValues, (elem) => _.includes(idsToRemove, elem.id));
    } else {
      filterCheckedValues.splice(checkedIndex, 1);
      _.remove(filterCheckedValues, (elem) =>
        _.includes([clickedFilterId, parentFilterId], elem.id)
      );
    }
  }

  filterCheckedValues = _.sortBy(_.uniqBy(filterCheckedValues, 'id'), 'id');
  const filterURLParamsStr = _.join(_.map(filterCheckedValues, 'id'), ',');

  switch (filterType) {
    case FILTER_TYPES.KOULUTUSALA:
      dispatch(setKoulutusala({ newCheckedKoulutusalat: filterCheckedValues }));
      break;
    case FILTER_TYPES.KOULUTUSTYYPPI:
      dispatch(setKoulutustyyppi({ newCheckedKoulutustyypit: filterCheckedValues }));
      break;
    default:
      break;
  }

  dispatch(clearPaging());
  dispatch(searchAll({ ...apiRequestParams, [filterType]: filterURLParamsStr }));
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
  return _.toPairs(obj).reduce((result, entry) => {
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

function getCleanUrlSearch(search, apiRequestParams) {
  return _.mapValues(_.pick(search, _.keys(apiRequestParams)), (value, key) =>
    _.includes(FILTER_TYPES_ARR, key) ? _.join(_.sortBy(_.split(value, ',')), ',') : value
  );
}

function getCheckedOnTaso02Clicked(
  allFilterValues,
  checkedValues,
  clickedFilterId,
  parentFilterId
) {
  const parentFilterObj = _.get(allFilterValues, parentFilterId);
  const alakoodiName = _.get(parentFilterObj, ['alakoodit', clickedFilterId, 'nimi']);
  const restAlakooditKeys = _.filter(
    _.keys(_.get(parentFilterObj, 'alakoodit')),
    (id) => !_.isEqual(id, clickedFilterId)
  );
  const allRestAlakooditChecked =
    _.size(checkedValues) > 0 &&
    _.every(restAlakooditKeys, (id) =>
      _.includes([..._.map(checkedValues, 'id'), clickedFilterId], id)
    );
  if (allRestAlakooditChecked) {
    return [
      ...checkedValues,
      { id: parentFilterId, name: _.get(parentFilterObj, 'nimi') },
      { id: clickedFilterId, name: alakoodiName },
    ];
  } else {
    return [
      ...checkedValues,
      {
        id: clickedFilterId,
        name: alakoodiName,
      },
    ];
  }
}

function getFilterAllValues(filterType, hakutulos) {
  const _tab =
    hakutulos?.selectedTab === KOULUTUS ? 'koulutusFilters' : 'oppilaitosFilters';
  return _.reduce(
    hakutulos?.[_tab],
    (acc, val, key) => {
      if (
        filterType === FILTER_TYPES.KOULUTUSTYYPPI &&
        _.includes([FILTER_TYPES.KOULUTUSTYYPPI, FILTER_TYPES.KOULUTUSTYYPPI_MUU], key)
      ) {
        return _.isObject(val) ? { ...acc, ...val } : acc;
      } else if (filterType === key) {
        return { ...acc, ...val };
      }
      return acc;
    },
    {}
  );
}

function getCheckedOnTaso01Clicked(filterAllValues, clickedFilterId, checkedValues) {
  return _.compact(
    _.concat(
      checkedValues,
      _.reduce(
        filterAllValues,
        (acc, val, key) => {
          if (key === clickedFilterId) {
            let parentFilterObj = {
              id: key,
              name: _.get(val, 'nimi'),
            };
            let _alakoodit = _.reduce(
              _.get(val, 'alakoodit'),
              (acc, val, key) => {
                return [...acc, { id: key, name: _.get(val, 'nimi') }];
              },
              []
            );
            acc = _.concat(parentFilterObj, _alakoodit);
          }
          return acc;
        },
        []
      )
    )
  );
}

function getFilterIdsToRemove(filterAllValues, clickedFilterId) {
  return _.reduce(
    filterAllValues,
    (acc, val, key) => {
      if (_.isEqual(key, clickedFilterId)) {
        acc = _.concat(acc, _.keys(_.get(val, 'alakoodit')));
      }
      return acc;
    },
    [clickedFilterId]
  );
}
