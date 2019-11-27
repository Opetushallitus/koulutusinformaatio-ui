const {
  override,
  addDecoratorsLegacy,
  disableEsLint,
} = require('customize-cra');

/* config-overrides.js */
module.exports = override(addDecoratorsLegacy(), disableEsLint());
