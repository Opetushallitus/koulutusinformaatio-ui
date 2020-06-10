import { createSelector } from '@reduxjs/toolkit';
import _ from 'lodash';
import { Localizer as l } from '#/src/tools/Utils';

// State data getters
function getOppilaitokset(state) {
  return state.oppilaitos.oppilaitos;
}
function getTarjonta(state) {
  return state.oppilaitos.tarjonta;
}
function getTulevaTarjonta(state) {
  return state.oppilaitos.tulevaTarjonta;
}
function getStatus(state) {
  return state.oppilaitos.status;
}
function getPage(state) {
  return state.oppilaitos.page;
}
function getSize(state) {
  return state.oppilaitos.size;
}
function getOffset(state) {
  return state.oppilaitos.offset;
}
function getOrder(state) {
  return state.oppilaitos.order;
}
function getTulevaPage(state) {
  return state.oppilaitos.tulevaPage;
}
function getTulevaSize(state) {
  return state.oppilaitos.tulevaSize;
}
function getTulevaOffset(state) {
  return state.oppilaitos.tulevaOffset;
}

//Selectors
const getTarjontaProps = createSelector([getTarjonta], (_tarjonta) => {
  const hits = _.get(_tarjonta, 'hits', []);
  const total = _.get(_tarjonta, 'total');
  const hasHits = _.size(hits) > 0;
  const localizedTarjonta = _.map(hits, (t) => ({
    toteutusName: l.localize(_.get(t, 'nimi')),
    description: l.localize(_.get(t, 'kuvaus')),
    locations: l.localizeSortedArrayToString(_.get(t, 'kunnat')),
    opetustapa: l.localizeSortedArrayToString(_.get(t, 'opetusajat')),
    price: getLocallizedmaksullisuus(
      _.get(t, 'onkoMaksullinen'),
      _.get(t, 'maksunMaara')
    ),
    tyyppi: _.get(t, 'koulutustyyppi'),
    kuva: _.get(t, 'kuva'),
  }));
  return {
    localizedTarjonta,
    total,
    hasHits,
  };
});
const getTulevaTarjontaProps = createSelector([getTulevaTarjonta], (tulevaTarjonta) => {
  const hits = _.get(tulevaTarjonta, 'hits', []);
  const total = _.get(tulevaTarjonta, 'total');
  const hitsSize = _.size(hits);
  const localizedTulevaTarjonta = _.map(hits, (k) => ({
    koulutusName: l.localize(_.get(k, 'nimi')),
    tutkintonimikkeet: l.localizeSortedArrayToString(_.get(k, 'tutkintonimikkeet')),
    koulutustyypit: l.localizeSortedArrayToString(_.get(k, 'koulutustyypit')),
    opintojenlaajuus: `${l.localize(_.get(k, 'opintojenLaajuus'))} ${l.localize(
      _.get(k, 'opintojenLaajuusyksikko')
    )}`,
    tyyppi: _.get(k, 'koulutustyyppi'),
  }));
  return {
    localizedTulevaTarjonta,
    total,
    hitsSize,
  };
});

export const getApiRequestParams = createSelector(
  [getPage, getSize, getOrder],
  (page, size, order) => ({
    page,
    size,
    lng: l.getLanguage(),
    order,
  })
);

export const getOppilaitosProps = createSelector(
  [getOppilaitokset, getTarjontaProps, getTulevaTarjontaProps, getStatus],
  (oppilaitos, tarjonta, tulevaTarjonta, status) => ({
    oppilaitos,
    esittelyHtml: l.localize(_.get(oppilaitos, 'oppilaitos.metadata.esittely', '')),
    tietoaOpiskelusta: _.get(oppilaitos, 'oppilaitos.metadata.tietoaOpiskelusta', []),
    tarjonta,
    tulevaTarjonta,
    status,
  })
);

export const getTarjontaPaginationProps = createSelector(
  [getApiRequestParams, getOffset],
  (apiRequestParams, offset) => ({
    ...apiRequestParams,
    offset,
  })
);

export const getTulevaTarjontaPaginationProps = createSelector(
  [getOrder, getTulevaPage, getTulevaSize, getTulevaOffset],
  (order, page, size, offset) => ({
    page,
    size,
    offset,
    order,
    lng: l.getLanguage(),
  })
);

// Helpers
function getLocallizedmaksullisuus(isMaksullinen, maksuAmount) {
  return isMaksullinen ? `${maksuAmount} €` : l.getTranslationForKey('toteutus.maksuton');
}
