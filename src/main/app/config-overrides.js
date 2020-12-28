const alias = require('./webpack-alias');
const { override, useBabelRc, addWebpackAlias } = require('customize-cra');

const { CI } = process.env;

module.exports = override(useBabelRc(), addWebpackAlias(alias), (config) => ({
  ...config,
  ...(CI
    ? {
        devServer: {
          hot: false,
          inline: false,
          liveReload: false,
          proxy: false,
        },
      }
    : {}),
}));
