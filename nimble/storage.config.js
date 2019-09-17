const path = require('path');
const webpack = require('webpack');


module.exports = {
  entry: '/Users/lola/Documents/codesmith/unit-6SB-simon/main.jsx',
  output: {
    path: '/Users/lola/Documents/codesmith/unit-6SB-simon',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
}
