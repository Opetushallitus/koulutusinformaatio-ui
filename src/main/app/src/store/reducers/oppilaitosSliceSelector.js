import { createSelector } from '@reduxjs/toolkit';
import { Localizer as l } from '#/src/tools/Utils';

// State data getters
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

export const getTarjontaPaginationProps = createSelector(
  [getPage, getSize, getOrder, getOffset],
  (page, size, order, offset) => ({
    page,
    size,
    order,
    offset,
  })
);

export const getTulevaTarjontaPaginationProps = createSelector(
  [getTulevaPage, getTulevaSize, getOrder, getTulevaOffset],
  (page, size, order, offset) => ({
    page,
    size,
    order,
    offset,
    lng: l.getLanguage(),
  })
);
