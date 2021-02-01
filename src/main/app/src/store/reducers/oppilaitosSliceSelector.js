import { createSelector } from '@reduxjs/toolkit';
import _ from 'lodash';
import { Localizer as l } from '#/src/tools/Utils';

// State data getters
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
function getOppilaitosError(state) {
  return state.oppilaitos.oppilaitosError;
}

// Selectors
const getTarjontaProps = createSelector([getTarjonta], (tarjonta) => {
  const hits = tarjonta.hits ?? [];
  const total = tarjonta.total;
  const hasHits = _.size(hits) > 0;
  const localizedTarjonta = hits.map((t) => ({
    toteutusName: l.localize(t.nimi),
    description: l.localize(t.kuvaus),
    locations: l.localizeSortedArrayToString(t.kunnat),
    opetustapa: l.localizeSortedArrayToString(t.opetusajat),
    price: getLocalizedmaksullisuus(t.onkoMaksullinen, t.maksunMaara),
    tyyppi: t.koulutustyyppi,
    kuva: t.kuva,
    toteutusOid: t.toteutusOid,
  }));

  return {
    localizedTarjonta,
    total,
    hasHits,
  };
});

const getTulevaTarjontaProps = createSelector([getTulevaTarjonta], (tulevaTarjonta) => {
  const hits = tulevaTarjonta?.hits ?? [];
  const total = tulevaTarjonta?.total ?? 0;
  const localizedTulevaTarjonta = hits.map((k) => ({
    koulutusOid: k.koulutusOid,
    koulutusName: l.localize(k.nimi),
    tutkintonimikkeet: l.localizeSortedArrayToString(k.tutkintonimikkeet),
    koulutustyypit: l.localizeSortedArrayToString(k.koulutustyypit),
    opintojenlaajuus: `${l.localize(k.opintojenLaajuus)} ${l.localize(
      k.opintojenLaajuusyksikko
    )}`,
    tyyppi: k.koulutustyyppi,
  }));

  return { values: localizedTulevaTarjonta, total };
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
  [getTarjontaProps, getTulevaTarjontaProps, getStatus, getOppilaitosError],
  (tarjonta, tulevaTarjonta, status, oppilaitosError) => ({
    tarjonta,
    tulevaTarjonta,
    status,
    oppilaitosError,
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
const getLocalizedmaksullisuus = (isMaksullinen, maksuAmount) =>
  isMaksullinen ? `${maksuAmount} €` : l.getTranslationForKey('toteutus.maksuton');
