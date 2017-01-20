/**
 * Created by Yc on 2016/12/10.
 */
var path = require('path');
var webpack = require('webpack');
var node_module_dir = path.resolve(__dirname, 'node_module');
var minimize = process.argv.indexOf('--mini') !== -1;
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var Webpack_isomorphic_tools_plugin = require('webpack-isomorphic-tools/plugin');



var config = {
    devServer: {
        inline: true,
        hot: true,
        historyApiFallback: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8778/',
                secure: false
            }
        }
    },
    entry: {
        app: [
            'babel-polyfill',
            path.resolve(__dirname, 'app/main.js'),
            // 'webpack/hot/only-dev-server'
        ],
        libs: [
            'react', 'redux', 'classname', 'history', 'react-redux', 'react-dom',
            'immutable', 'isomorphic-fetch', 'react-router-redux', 'react-router',
            'tracking', 'tracking/build/data/face'
        ] 
        // client: "webpack-dev-server/client?http://localhost:8080/",
        // dev: "webpack/hot/only-dev-server"
    },
    output:{
        path: path.resolve(__dirname, 'build'),
        filename: '[name].main.min.js?v=[chunkhash]',
        publicPath: '/',
        // hotUpdateChunkFilename: 'hot/hot-update.js',
        // hotUpdateMainFilename: 'hot/hot-update.json'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.CommonsChunkPlugin('libs', 'libs.min.js?v='+(minimize?"[chunkhash]":"[hash]")),
        new ExtractTextPlugin("style.min.css?v=[contenthash]", {allChunks: true}),
        new WebpackMd5Hash(),
        new HtmlWebpackPlugin({
            title: '学生签到系统',
            filename: 'index.html',
            key: Date.now(),
            // minify: true,
            template: 'app/index.tpl.html'
        })
    ],
    module: {
        loaders: [
            { test: /\.worker\.js$/, loader: 'file-loader?name=workers/[name].[ext]' },
            { test: /^tracking\.js$/, loader: 'file-loader?name=workers/[name].[ext]' },
            {
                loaders: [
                    "react-hot-loader/webpack", //[HMR] The following modules couldn't be hot updated: (They would need a full reload!)
                    "babel?presets[]=react,presets[]=es2015,presets[]=stage-0"
                ], 
                include:[
                    path.resolve(__dirname, 'app'),
                ],
                exclude:[
                    /(node_modules|bower_components)/,
                ],
                test:/^(.(?!\.worker))*\.jsx?$/
            }, {
                test: /^(.(?!\.global))*\.less$/,  //http://www.cnblogs.com/bvbook/archive/2010/11/03/1867775.html
                loader: ExtractTextPlugin.extract(['css?modules', 'postcss', 'less'])
            }, {
                test: /\.global\.less$/,
                loader: ExtractTextPlugin.extract(['css','postcss','less'])
            }/*,{
                test: /\.css$/,
                loader: ExtractTextPlugin.extract(['css-loader', 'postcss'])
            }, {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract(['css-loader', 'postcss', 'less'])
            }*/, {
                test: /\.(png|jpg|jpeg)$/,
                loader: 'url-loader?limit=8192&name=res/[name].[ext]?[hash]'
            },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff&name=res/[name].[ext]?[hash]" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader?name=res/[name].[ext]?[hash]" },
        ]
    },
    postcss: function () {
        return [require('autoprefixer'), require('precss')];
    }
}
if(minimize) {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                //supresses warnings, usually from module minification
                warnings: false
            }
        }),
        //允许错误不打断程序
        new webpack.NoErrorsPlugin()
    )
    config.plugins.unshift(new Webpack_isomorphic_tools_plugin(require('../webpack-isomorphic-tools')));
} else {
    config.devtool = 'source-map';
    config.plugins.push (
        new webpack.HotModuleReplacementPlugin()  //fix Maximum call stack
    )
}

module.exports = config