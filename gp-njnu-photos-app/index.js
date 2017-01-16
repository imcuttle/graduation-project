var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config');
config.entry.app.unshift('webpack-hot-middleware/client?reload=true')

var app = express();
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use(express.static(__dirname + '/build'));

// app.get('*', function(req, res) {
//   res.sendFile(path.join(__dirname, 'build/index.html'));
// });

app.listen(3000, function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:3000');
});