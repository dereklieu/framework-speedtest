var path = require('path');
module.exports = {
  entry: "./js/test.js",
  output: {
    path: path.resolve(__dirname, 'js'),
    filename: "bundle.js"
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['react']
      }
    }]
  }
};
