const {
  override,
  addDecoratorsLegacy,
  disableEsLint,
  useBabelRc
} = require('customize-cra');

/* config-overrides.js */
module.exports = override(addDecoratorsLegacy(), disableEsLint(), useBabelRc());
