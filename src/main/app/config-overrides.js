const alias = require('./webpack-alias');
const isDev = process.env.NODE_ENV === 'development';
const {
  override,
  addDecoratorsLegacy,
  disableEsLint,
  useBabelRc,
  addWebpackAlias,
} = require('customize-cra');

module.exports = override(
  addDecoratorsLegacy(),
  !isDev && disableEsLint(),
  useBabelRc(),
  addWebpackAlias(alias)
);
