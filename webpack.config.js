var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './app/index.js',
  output: {
    filename: 'static/bundle.js',
    path: path.resolve(__dirname, 'dist/')
  },
  devServer: {
    https: true,
    historyApiFallback: true,
    publicPath: "/dist/"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
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
          { from: 'index.html' }
      ])
  ]
};