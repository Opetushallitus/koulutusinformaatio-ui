import { createSelector } from '@reduxjs/toolkit';
import qs from 'query-string';
import _ from 'lodash';
import { Localizer as l } from '#/src/tools/Utils';
import { Common as C } from '#/src/tools/Utils';

// State data getters
function getKeyword(state) {
  return state.hakutulos.keyword;
}
function getKeywordEditMode(state) {
  return state.hakutulos.keywordEditMode;
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
function getPageSizeArray(state) {
  return state.hakutulos.pageSizeArray;
}
function getPageSortArray(state) {
  return state.hakutulos.pageSortArray;
}
//Selectors
export const getHakupalkkiProps = createSelector(
  [
    getKeyword,
    getKeywordEditMode,
    getKoulutusFilters,
    getOppilaitosFilters,
    getSelectedTab,
  ],
  (keyword, keywordEditMode, koulutusFilters, oppilaitosFilters, selectedTab) => ({
    keyword,
    keywordEditMode,
    showTooltip: _.inRange(_.size(keyword), 1, 3),
    isKeywordValid: _.size(keyword) > 2,
    koulutusFilters,
    oppilaitosFilters,
    selectedTab,
  })
);

export const getHakutulosProps = createSelector(
  [
    getKeyword,
    getKoulutusHits,
    getOppilaitosHits,
    getOrder,
    getSort,
    getSelectedTab,
    getKoulutusTotal,
    getOppilaitosTotal,
    getPageSizeArray,
    getPageSortArray,
    getSize,
    getOpetuskieli,
    getKoulutustyyppi,
    getKoulutusala,
    getSijainti,
    getSelectedSijainti,
  ],
  (
    keyword,
    koulutusHits,
    oppilaitosHits,
    order,
    sort,
    selectedTab,
    koulutusTotal,
    oppilaitosTotal,
    pageSizeArray,
    pageSortArray,
    size,
    opetuskieli,
    koulutustyyppi,
    koulutusala,
    sijainti,
    selectedSijainti
  ) => {
    return {
      keyword,
      koulutusHits,
      oppilaitosHits,
      order,
      sort,
      selectedTab,
      koulutusTotal,
      oppilaitosTotal,
      pageSizeArray,
      pageSortArray,
      size,
      isAnyFilterSelected: _.some(
        [opetuskieli, koulutustyyppi, koulutusala, sijainti, selectedSijainti],
        (filterArr) => _.size(filterArr) > 0
      ),
    };
  }
);

export const getHakutulosToggleProps = createSelector(
  [getSelectedTab, getKoulutusTotal, getOppilaitosTotal],
  (selectedTab, koulutusTotal, oppilaitosTotal) => ({
    selectedTab: selectedTab === 'koulutus' ? 0 : 1,
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
  [getOpetuskieli, getKoulutustyyppi, getKoulutusala, getSijainti, getSelectedSijainti],
  (opetuskieli, koulutustyyppi, koulutusala, sijainti, selectedSijainti) => ({
    opetuskieli: opetuskieli,
    koulutustyyppi: koulutustyyppi,
    koulutusala: koulutusala,
    sijainti: _.concat(sijainti, selectedSijainti),
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
    selectedSijainti
  ) => {
    return {
      keyword,
      order,
      sort,
      size,
      lng: l.getLanguage(),
      opetuskieli: getCheckedFiltersIdsStr(opetuskieli),
      koulutustyyppi: getCheckedFiltersIdsStr(koulutustyyppi),
      koulutusala: getCheckedFiltersIdsStr(koulutusala),
      sijainti: getCheckedFiltersIdsStr(_.concat(selectedSijainti, sijainti)),
    };
  }
);

export const getHakuUrl = createSelector(
  [getAPIRequestParams, getSelectedTab, getKoulutusPage, getOppilaitosPage],
  (apiRequestParams, selectedTab, koulutusPage, oppilaitosPage) => {
    const { keyword } = apiRequestParams;
    const hakuParams = {
      ...C.cleanRequestParams(_.omit(apiRequestParams, 'keyword')),
      kpage: koulutusPage,
      opage: oppilaitosPage,
      selectedTab,
    };
    const urlStart = _.size(keyword) > 2 ? `/haku/${keyword}?` : `/haku?`;
    const url = urlStart + qs.stringify(hakuParams, { arrayFormat: 'comma' });
    return { url };
  }
);

export const getOpetuskieliFilterProps = createSelector(
  [getKoulutusFilters, getOppilaitosFilters, getSelectedTab, getOpetuskieli],
  (koulutusFilters, oppilaitosFilters, selectedTab, checkedOpetuskielet) => {
    const opetuskieliFilter =
      selectedTab === 'koulutus'
        ? koulutusFilters.opetuskieli
        : oppilaitosFilters.opetuskieli;
    return {
      sortedOpetuskielet: sortOpetusKieliFilter(opetuskieliFilter),
      selectedTab,
      checkedOpetuskielet,
      checkedOpetuskieletStr: getSelectedFiltersNamesStr(checkedOpetuskielet),
    };
  }
);

export const getKoulutustyyppiFilterProps = createSelector(
  [getKoulutusFilters, getOppilaitosFilters, getSelectedTab, getKoulutustyyppi],
  (koulutusFilters, oppilaitosFilters, selectedTab, checkedKoulutustyypit) => {
    const koulutustyyppi =
      selectedTab === 'koulutus'
        ? _.entries(koulutusFilters.koulutustyyppi)
        : _.entries(oppilaitosFilters.koulutustyyppi);
    return {
      koulutustyyppi,
      selectedTab,
      checkedKoulutustyypit,
      checkedKoulutustyypitStr: getSelectedFiltersNamesStr(checkedKoulutustyypit),
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
    return {
      sortedKoulutusalat: sortedKoulutusalatEntries(koulutusala),
      selectedTab,
      checkedKoulutusalat,
      checkedKoulutusalatStr: getSelectedFiltersNamesStr(checkedKoulutusalat),
    };
  }
);
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
      .map((mk) => mk?.['name']?.[l.getLanguage()])
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
function sortOpetusKieliFilter(filterObj) {
  const sortedArrByCountNameDesc = _.orderBy(
    _.entries(filterObj),
    ['[1].count', `[1].nimi.[${l.getLanguage()}]`],
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
  return filterArr.map((f) => _.capitalize(f?.['name']?.[l.getLanguage()])).join(', ');
}
function sortedKoulutusalatEntries(filterObj) {
  return _.orderBy(_.entries(filterObj), `[1]nimi.[${l.getLanguage()}]`);
}
function getOrderedMaakunnatEntries(filterObj) {
  const orderedMaakunnat = _.orderBy(
    _.entries(filterObj),
    ['[1].count', `[1].nimi.[${l.getLanguage()}]`],
    ['desc', 'asc']
  );
  const eiTiedossaMaakunta = _.remove(orderedMaakunnat, (n) => n[0] === 'maakunta_99');
  return _.concat(orderedMaakunnat, eiTiedossaMaakunta);
}

function getSijainnitForReactReselect(kunnat, orderedMaakunnatEntries) {
  const filteredKunnatEntries = _.entries(kunnat).filter((k) => k[1].count > 0);
  const filteredMaakunnatEntries = orderedMaakunnatEntries.filter(
    (mk) => mk[1].count > 0
  );

  const reactSelectKunnat = filteredKunnatEntries.reduce(
    (kuntaAccum, kunta, kuntaIndex) => {
      return [
        ...kuntaAccum,
        {
          label: `${kunta[1]?.nimi?.[l.getLanguage()]} (${kunta[1]?.count})`,
          value: kunta[1]?.nimi?.[l.getLanguage()],
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
          label: `${maaKunta[1]?.nimi?.[l.getLanguage()]} (${maaKunta[1]?.count})`,
          value: maaKunta[1]?.nimi?.[l.getLanguage()],
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
