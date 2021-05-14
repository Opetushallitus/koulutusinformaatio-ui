import { createSelector } from '@reduxjs/toolkit';
import _ from 'lodash';
import qs from 'query-string';

import { FILTER_TYPES_ARR } from '#/src/constants';
import { getLanguage } from '#/src/tools/localization';
import { Common as C } from '#/src/tools/Utils';

// State data getters
export const getIsReady = (state) => state.hakutulos.status === 'idle';

function getKeyword(state) {
  return state.hakutulos.keyword;
}
function getKoulutusHits(state) {
  return state.hakutulos.koulutusHits;
}
function getKoulutusFilters(state) {
  return state.hakutulos.koulutusFilters;
}
function getKoulutusTotal(state) {
  return state.hakutulos.koulutusTotal;
}
function getKoulutusOffset(state) {
  return state.hakutulos.koulutusOffset;
}
function getOppilaitosHits(state) {
  return state.hakutulos.oppilaitosHits;
}
function getOppilaitosFilters(state) {
  return state.hakutulos.oppilaitosFilters;
}
function getOppilaitosOffset(state) {
  return state.hakutulos.oppilaitosOffset;
}
function getOppilaitosTotal(state) {
  return state.hakutulos.oppilaitosTotal;
}
function getOpetuskieli(state) {
  return state.hakutulos.opetuskieli;
}
function getKoulutustyyppi(state) {
  return state.hakutulos.koulutustyyppi;
}
function getKoulutusala(state) {
  return state.hakutulos.koulutusala;
}
function getKunta(state) {
  return state.hakutulos.kunta;
}
function getMaakunta(state) {
  return state.hakutulos.maakunta;
}
function getOpetustapa(state) {
  return state.hakutulos.opetustapa;
}
function getValintatapa(state) {
  return state.hakutulos.valintatapa;
}
const getHakukaynnissa = (state) => state.hakutulos.hakukaynnissa;
const getHakutapa = (state) => state.hakutulos.hakutapa;
const getYhteishaku = (state) => state.hakutulos.yhteishaku;
const getPohjakoulutusvaatimus = (state) => state.hakutulos.pohjakoulutusvaatimus;

const getFilter = (id) => (state) => state.hakutulos[id];
const getFilters = (state) => _.pick(state.hakutulos, FILTER_TYPES_ARR);

function getSelectedTab(state) {
  return state.hakutulos.selectedTab;
}
function getSize(state) {
  return state.hakutulos.size;
}
function getKoulutusPage(state) {
  return state.hakutulos.koulutusPage;
}
function getOppilaitosPage(state) {
  return state.hakutulos.oppilaitosPage;
}
function getOrder(state) {
  return state.hakutulos.order;
}
function getSort(state) {
  return state.hakutulos.sort;
}

//Selectors
export const getHakupalkkiProps = createSelector(
  [getKoulutusFilters],
  (koulutusFilters) => ({
    koulutusFilters,
  })
);

export const getHakutulosProps = createSelector(
  [
    getKeyword,
    getKoulutusHits,
    getOppilaitosHits,
    getSelectedTab,
    getSize,
    getOpetuskieli,
    getKoulutustyyppi,
    getKoulutusala,
    getKunta,
    getMaakunta,
    getOpetustapa,
    getValintatapa,
    getHakukaynnissa,
    getHakutapa,
    getYhteishaku,
    getPohjakoulutusvaatimus,
  ],
  (
    keyword,
    koulutusHits,
    oppilaitosHits,
    selectedTab,
    size,
    opetuskieli,
    koulutustyyppi,
    koulutusala,
    kunta,
    maakunta,
    opetustapa,
    valintatapa,
    hakukaynnissa,
    hakutapa,
    yhteishaku,
    pohjakoulutusvaatimus
  ) => {
    return {
      keyword,
      koulutusHits,
      oppilaitosHits,
      selectedTab,
      size,
      isAnyFilterSelected:
        hakukaynnissa ||
        _.some(
          [
            opetuskieli,
            koulutustyyppi,
            koulutusala,
            kunta,
            maakunta,
            opetustapa,
            valintatapa,
            hakutapa,
            yhteishaku,
            pohjakoulutusvaatimus,
          ],
          (filterArr) => _.size(filterArr) > 0
        ),
    };
  }
);

export const getHakutulosToggleProps = createSelector(
  [getSelectedTab, getKoulutusTotal, getOppilaitosTotal],
  (selectedTab, koulutusTotal, oppilaitosTotal) => ({
    selectedTab,
    koulutusTotal,
    oppilaitosTotal,
  })
);

export const getMobileToggleOrderByButtonMenuProps = createSelector(
  [getOrder, getSort],
  (order, sort) => ({
    order,
    sort,
    isScoreSort: sort !== 'name',
    isNameSort: sort === 'name',
    isNameSortAsc: sort === 'name' && order === 'asc',
    isNameSortDesc: sort === 'name' && order !== 'asc',
  })
);

export const getHakutulosPagination = createSelector(
  [
    getKoulutusOffset,
    getKoulutusTotal,
    getOppilaitosOffset,
    getOppilaitosTotal,
    getSelectedTab,
  ],
  (koulutusOffset, koulutusTotal, oppilaitosOffset, oppilaitosTotal, selectedTab) => ({
    koulutusOffset,
    koulutusTotal,
    oppilaitosOffset,
    oppilaitosTotal,
    selectedTab,
  })
);

const getCheckedFiltersIdsStr = (checkedfiltersArr) =>
  checkedfiltersArr ? _.join(_.sortBy(checkedfiltersArr), ',') : '';

export const getAPIRequestParams = createSelector(
  [
    getKeyword,
    getOrder,
    getSort,
    getSize,
    getOpetuskieli,
    getKoulutustyyppi,
    getKoulutusala,
    getKunta,
    getMaakunta,
    getOpetustapa,
    getValintatapa,
    getHakukaynnissa,
    getHakutapa,
    getYhteishaku,
    getPohjakoulutusvaatimus,
  ],
  (
    keyword,
    order,
    sort,
    size,
    opetuskieli,
    koulutustyyppi,
    koulutusala,
    kunta,
    maakunta,
    opetustapa,
    valintatapa,
    hakukaynnissa,
    hakutapa,
    yhteishaku,
    pohjakoulutusvaatimus
  ) => ({
    keyword,
    order,
    sort,
    size,
    opetuskieli: getCheckedFiltersIdsStr(opetuskieli),
    koulutustyyppi: getCheckedFiltersIdsStr(koulutustyyppi),
    koulutusala: getCheckedFiltersIdsStr(koulutusala),
    sijainti: getCheckedFiltersIdsStr(_.concat(kunta, maakunta)),
    opetustapa: getCheckedFiltersIdsStr(opetustapa),
    valintatapa: getCheckedFiltersIdsStr(valintatapa),
    hakutapa: getCheckedFiltersIdsStr(hakutapa),
    hakukaynnissa,
    yhteishaku: getCheckedFiltersIdsStr(yhteishaku),
    pohjakoulutusvaatimus: getCheckedFiltersIdsStr(pohjakoulutusvaatimus),
  })
);

export const getHakuParams = createSelector(
  [getAPIRequestParams, getSelectedTab, getKoulutusPage, getOppilaitosPage],
  (apiRequestParams, selectedTab, koulutusPage, oppilaitosPage) => {
    const hakuParams = {
      ...C.cleanRequestParams(_.omit(apiRequestParams, 'keyword')),
      kpage: koulutusPage,
      opage: oppilaitosPage,
      selectedTab,
    };
    const hakuParamsStr = qs.stringify(hakuParams, { arrayFormat: 'comma' });
    return { hakuParams, hakuParamsStr };
  }
);

export const getHakuUrl = createSelector(
  [getAPIRequestParams, getHakuParams],
  (apiRequestParams, { hakuParamsStr }) => {
    const { keyword } = apiRequestParams;
    const urlStart = _.size(keyword) > 2 ? `/haku/${keyword}?` : `/haku?`;
    const url = urlStart + hakuParamsStr;
    return { url };
  }
);

const sortValues = (filterObj) =>
  _.orderBy(
    _.toPairs(filterObj).map(([id, values]) => ({ id, ...values })),
    ['count', `nimi.[${getLanguage()}]`],
    ['desc', 'asc']
  );

export const getFilterProps = (id) =>
  createSelector(
    [getKoulutusFilters, getOppilaitosFilters, getSelectedTab, getFilter(id)],
    (koulutusFilters, oppilaitosFilters, selectedTab, checkedValues) => {
      const usedFilter =
        selectedTab === 'koulutus' ? koulutusFilters[id] : oppilaitosFilters[id];

      return {
        values: sortValues(usedFilter).map((v) => ({
          ...v,
          filterId: id,
          checked: checkedValues.some((checkedId) => checkedId === v.id),
          alakoodit: sortValues(v.alakoodit)?.map((alakoodi) => ({
            ...alakoodi,
            filterId: id,
            checked: checkedValues.some((checkedId) => checkedId === alakoodi.id),
          })),
        })),
      };
    }
  );

const findKoodiOrAlakoodi = (filter, id) => {
  if (filter[id]) {
    return filter[id];
  }

  const valueWithCorrectAlakoodi = _.values(filter)
    .filter((v) => v.alakoodit)
    .find((v) => v.alakoodit[id]);
  return valueWithCorrectAlakoodi.alakoodit[id];
};

export const getAllSelectedFilters = createSelector(
  [getKoulutusFilters, getFilters],
  (koulutusFilters, allCheckedValues) =>
    _.map(allCheckedValues, (checkedValues, filterId) => {
      if (_.isBoolean(checkedValues)) {
        return checkedValues ? [{ filterId, id: filterId }] : [];
      }
      // Etsitään id:tä vastaava arvo ja palautetaan rikastettuna, käytetään koulutuksen suodattimia
      const filter = koulutusFilters[filterId];
      return (
        checkedValues?.map((id) => ({
          id,
          filterId,
          ...findKoodiOrAlakoodi(filter, id),
        })) ?? []
      );
    }).flat()
);

export const getCheckedToteutusFilters = createSelector([getFilters], (checkedValues) =>
  _.pick(checkedValues, ['opetuskieli', 'maakunta', 'kunta', 'opetustapa'])
);

export const hakukaynnissaSelector = () =>
  createSelector(
    [getKoulutusFilters, getOppilaitosFilters, getSelectedTab, getHakukaynnissa],
    (koulutusFilters, oppilaitosFilters, selectedTab, hakukaynnissa) => {
      const hakukaynnissaData =
        selectedTab === 'koulutus'
          ? koulutusFilters.hakukaynnissa
          : oppilaitosFilters.hakukaynnissa;

      return {
        hakukaynnissa,
        hakukaynnissaData,
      };
    }
  );
