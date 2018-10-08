const rewireMobX = require('react-app-rewire-mobx');
const rewireCssModules = require('react-app-rewire-css-modules');
const rewirePreact = require('react-app-rewire-preact');

/* config-overrides.js */
module.exports = function override(config, env) {
    config = rewirePreact(config, env);
    config = rewireCssModules(config, env);
    config = rewireMobX(config, env);

    return config;
}
