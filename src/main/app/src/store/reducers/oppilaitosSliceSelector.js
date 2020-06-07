import { createSelector } from '@reduxjs/toolkit';
import { Localizer as l } from '#/src/tools/Utils';

// State data getters
function getOppilaitokset(state) {
  return state.oppilaitos.oppilaitokset;
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
export const getApiRequestParams = createSelector(
  [getPage, getSize, getOrder],
  (page, size, order) => ({
    page,
    size,
    lng: l.getLanguage(),
    order,
  })
);

export const getOppilaitosProps = (oid) =>
  createSelector(
    [getOppilaitokset, getTarjonta, getTulevaTarjonta, getStatus],
    (oppilaitokset, tarjonta, tulevaTarjonta, status) => {
      return {
        oppilaitos: oppilaitokset?.[oid],
        tarjonta: tarjonta?.[oid],
        tulevaTarjonta: tulevaTarjonta?.[oid],
        status,
      };
    }
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
