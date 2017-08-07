var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin('stylesheets/[name]-one.css');

module.exports = {
  entry: './app/index.js',
  output: {
    filename: 'static/bundle.js',
    path: path.resolve(__dirname, 'dist/')
  },
  devServer: {
    https: true,
    historyApiFallback: true,
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },
  plugins: [
      new CopyWebpackPlugin([
          { from: 'content', to: 'content/' },
          { from: 'index.html' },
          { from: '_redirects' }
      ]),

      new ExtractTextPlugin('static/styles.css')
  ]
};