/**
 * Created by Yc on 2016/12/10.
 */
var path = require('path');
var webpack = require('webpack');
var node_module_dir = path.resolve(__dirname, 'node_module');
var minimize = process.argv.indexOf('--mini') !== -1;


var config = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:8778',
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
        // client: "webpack-dev-server/client?http://localhost:8080/",
        // dev: "webpack/hot/only-dev-server"
    },
    output:{
        path: path.resolve(__dirname, 'build'),
        filename: '[name].main.min.js',
        publicPath: '/',
        // hotUpdateChunkFilename: 'hot/hot-update.js',
        // hotUpdateMainFilename: 'hot/hot-update.json'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),  //fix Maximum call stack
        //new webpack.optimize.CommonsChunkPlugin('react', 'react.js')
    ],
    module: {
        loaders: [
            {
                loaders: [
                    "react-hot/webpack", //[HMR] The following modules couldn't be hot updated: (They would need a full reload!)
                    "babel?presets[]=react,presets[]=es2015,presets[]=stage-0"
                ], 
                include:[
                    path.resolve(__dirname, 'app'),
                ],
                exclude:[
                    /(node_modules|bower_components)/,
                ],
                test:/\.jsx?$/
            },
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader?modules' +
                '!postcss!less-loader'
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader?modules'
            },
            {
                test: /\.(png|jpg|jpeg)$/,
                loader: 'url-loader?limit=8192&name=_res/[name].[ext]?[hash]'
            },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff&name=res/[name].[ext]?[hash]" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader?name=res/[name].[ext]?[hash]" }
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
}

module.exports = config