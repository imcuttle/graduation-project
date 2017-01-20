var WebpackIsomorphicTools = require('webpack-isomorphic-tools');
var config = require('../webpack-isomorphic-tools')
config.debug = false
global.webpackIsomorphicTools = new WebpackIsomorphicTools(config)
    .server('../gp-njnu-photos-app')
    .then(() => {
        require('./server');
    })
    .catch(console.error);
