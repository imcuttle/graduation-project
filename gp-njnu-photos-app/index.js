var webpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');

var config = require("./webpack.config.js");

config.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/", "webpack/hot/only-dev-server");

var compiler = webpack(config);
var server = new webpackDevServer(compiler, {
    hot: true,
    contentBase: './build',
    inline: true,
    historyApiFallback: false,
    stats: {
        colors: true,
        progress: true,
        devtool: 'eval'
    },
    
    publicPath: '/',
    headers: { 'Access-Control-Allow-Origin': '*' }
});
server.listen(8080);