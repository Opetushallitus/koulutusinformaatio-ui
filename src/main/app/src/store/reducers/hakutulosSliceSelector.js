import { createSelector } from '@reduxjs/toolkit';
import _ from 'lodash';
import qs from 'query-string';

import { FILTER_TYPES } from '#/src/constants';
import { getLanguage, getTranslationForKey, localize } from '#/src/tools/localization';
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
function getSijainti(state) {
  return state.hakutulos.sijainti;
}
function getSelectedSijainti(state) {
  return state.hakutulos.selectedSijainti;
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
    getSijainti,
    getSelectedSijainti,
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
    sijainti,
    selectedSijainti,
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
            sijainti,
            selectedSijainti,
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
export const getSuodatinValinnatProps = createSelector(
  [
    getOpetuskieli,
    getKoulutustyyppi,
    getKoulutusala,
    getSijainti,
    getSelectedSijainti,
    getOpetustapa,
    getValintatapa,
    getHakukaynnissa,
    getHakutapa,
    getYhteishaku,
    getPohjakoulutusvaatimus,
  ],
  (
    opetuskieli,
    koulutustyyppi,
    koulutusala,
    sijainti,
    selectedSijainti,
    opetustapa,
    valintatapa,
    hakukaynnissa,
    hakutapa,
    yhteishaku,
    pohjakoulutusvaatimus
  ) => ({
    opetuskieli,
    koulutustyyppi,
    koulutusala,
    sijainti: _.concat(sijainti, selectedSijainti),
    opetustapa,
    valintatapa,
    // TODO: Refactor suodatinvalinnat to accept big list of ids
    hakukaynnissa: hakukaynnissa ? [{ id: 'hakukaynnissa' }] : [],
    hakutapa,
    yhteishaku,
    pohjakoulutusvaatimus,
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

export const getAPIRequestParams = createSelector(
  [
    getKeyword,
    getOrder,
    getSort,
    getSize,
    getOpetuskieli,
    getKoulutustyyppi,
    getKoulutusala,
    getSijainti,
    getSelectedSijainti,
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
    sijainti,
    selectedSijainti,
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
    sijainti: getCheckedFiltersIdsStr(_.concat(selectedSijainti, sijainti)),
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

export const getOpetustapaFilterProps = createSelector(
  [getKoulutusFilters, getOppilaitosFilters, getSelectedTab, getOpetustapa],
  (koulutusFilters, oppilaitosFilters, selectedTab, checkedOpetustavat) => {
    const opetustapaFilter =
      selectedTab === 'koulutus'
        ? koulutusFilters.opetustapa
        : oppilaitosFilters.opetustapa;
    return {
      sortedOpetustavat: sortedFilterEntries(opetustapaFilter),
      checkedOpetustavat,
      checkedOpetustavatStr: getSelectedFiltersNamesStr(checkedOpetustavat),
    };
  }
);

const getNameStr = (filterArr = []) =>
  filterArr.map((f) => _.capitalize(localize(f))).join(', ');

// TODO: Refactor sortedFilterEntries away
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
          checked: checkedValues.some((checked) => checked.id === v.id),
          alakoodit: sortValues(v.alakoodit)?.map((alakoodi) => ({
            ...alakoodi,
            filterId: id,
            checked: checkedValues.some((checked) => checked.id === alakoodi.id),
          })),
        })),
        localizedCheckedValues: getNameStr(checkedValues),
      };
    }
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

export const getKoulutusalaFilterProps = createSelector(
  [getKoulutusFilters, getOppilaitosFilters, getSelectedTab, getKoulutusala],
  (koulutusFilters, oppilaitosFilters, selectedTab, checkedKoulutusalat) => {
    const koulutusala =
      selectedTab === 'koulutus'
        ? koulutusFilters.koulutusala
        : oppilaitosFilters.koulutusala;
    const checkedKoulutusalatKeys = _.map(checkedKoulutusalat, 'id');
    return {
      sortedKoulutusalat: sortedKoulutusalatEntries(koulutusala),
      selectedTab,
      checkedKoulutusalat,
      checkedKoulutusalatKeys,
      checkedKoulutusalatStr: getSelectedFiltersNamesStr(checkedKoulutusalat),
    };
  }
);

// TODO: Some types written at SijaintiSuodatin.tsx
export const getSijaintiFilterProps = createSelector(
  [
    getKoulutusFilters,
    getOppilaitosFilters,
    getSelectedTab,
    getSijainti,
    getSelectedSijainti,
  ],
  (
    koulutusFilters,
    oppilaitosFilters,
    selectedTab,
    checkedMaakunnat,
    selectedSijainnit
  ) => {
    const maakunnat =
      selectedTab === 'koulutus' ? koulutusFilters.maakunta : oppilaitosFilters.maakunta;
    const kunnat =
      selectedTab === 'koulutus' ? koulutusFilters.kunta : oppilaitosFilters.kunta;
    const orderedMaakunnat = getOrderedMaakunnatEntries(maakunnat);
    const searchHitsSijainnit = getSijainnitForReactReselect(kunnat, orderedMaakunnat);
    const selectedSijainnitStr = checkedMaakunnat
      .map((mk) => mk?.['name']?.[getLanguage()])
      .concat(_.map(selectedSijainnit, 'value'))
      .join(', ');

    return {
      firstFiveMaakunnat: _.slice(orderedMaakunnat, 0, 5),
      restMaakunnat: _.slice(orderedMaakunnat, 5, orderedMaakunnat.length),
      checkedMaakunnat,
      selectedSijainnit,
      searchHitsSijainnit,
      selectedTab,
      selectedSijainnitStr,
    };
  }
);

// Helpers
function sortedFilterEntries(filterObj) {
  const sortedArrByCountNameDesc = _.orderBy(
    _.toPairs(filterObj),
    ['[1].count', `[1].nimi.[${getLanguage()}]`],
    ['desc', 'desc']
  );
  const removedMuuKieli = _.remove(
    sortedArrByCountNameDesc,
    (n) => n[0] === 'oppilaitoksenopetuskieli_9'
  );
  return _.concat(sortedArrByCountNameDesc, removedMuuKieli);
}
function getCheckedFiltersIdsStr(checkedfiltersArr) {
  if (checkedfiltersArr) {
    return _.join(_.sortBy(_.map(checkedfiltersArr, 'id')), ',');
  }
  return '';
}
function getSelectedFiltersNamesStr(filterArr) {
  return filterArr
    .map((f) => _.capitalize(localize(f?.name) || getTranslationForKey(`haku.${f?.id}`)))
    .join(', ');
}
function sortedKoulutusalatEntries(filterObj) {
  return _.sortBy(_.toPairs(filterObj), `[1]nimi.[${getLanguage()}]`);
}
function getOrderedMaakunnatEntries(filterObj) {
  const orderedMaakunnat = _.orderBy(
    _.toPairs(filterObj),
    ['[1].count', `[1].nimi.[${getLanguage()}]`],
    ['desc', 'asc']
  );
  const eiTiedossaMaakunta = _.remove(orderedMaakunnat, (n) => n[0] === 'maakunta_99');
  return _.concat(orderedMaakunnat, eiTiedossaMaakunta);
}

function getSijainnitForReactReselect(kunnat, orderedMaakunnatEntries) {
  const filteredKunnatEntries = _.toPairs(kunnat).filter((k) => k[1].count > 0);
  const filteredMaakunnatEntries = orderedMaakunnatEntries.filter(
    (mk) => mk[1].count > 0
  );

  const reactSelectKunnat = filteredKunnatEntries.reduce(
    (kuntaAccum, kunta, kuntaIndex) => {
      return [
        ...kuntaAccum,
        {
          label: `${kunta[1]?.nimi?.[getLanguage()]} (${kunta[1]?.count})`,
          value: kunta[1]?.nimi?.[getLanguage()],
          isMaakunta: false,
          id: kunta[0],
          name: kunta[1]?.nimi,
        },
      ];
    },
    []
  );
  const searchHitsSijainnit = filteredMaakunnatEntries.reduce(
    (accumulator, maaKunta, kuntaIndex) => {
      return [
        ...accumulator,
        {
          label: `${maaKunta[1]?.nimi?.[getLanguage()]} (${maaKunta[1]?.count})`,
          value: maaKunta[1]?.nimi?.[getLanguage()],
          isMaakunta: true,
          id: maaKunta[0],
          name: maaKunta[1]?.nimi,
        },
      ];
    },
    reactSelectKunnat
  );
  return searchHitsSijainnit;
}
