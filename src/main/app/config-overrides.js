const alias = require('./webpack-alias');
const isDev = process.env.NODE_ENV === 'development';
const { override, disableEsLint, useBabelRc, addWebpackAlias } = require('customize-cra');

const { CI } = process.env;

module.exports = override(
  !isDev && disableEsLint(),
  useBabelRc(),
  addWebpackAlias(alias),
  (config) => ({
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
  })
);
