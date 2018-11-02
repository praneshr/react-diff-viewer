var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WriteFilePlugin = require('write-file-webpack-plugin');
const devServer = {
	contentBase: path.resolve(__dirname, './app'),
	outputPath: path.join(__dirname, './dist'),
	colors: true,
	quiet: false,
	noInfo: false,
	publicPath: '/',
	historyApiFallback: false,
	host: '127.0.0.1',
	proxy:{
		'/graphql': {
			target: 'http://localhost:8080'
		}
	},
	port: 3000,
	hot: true
};
module.exports = {
  devtool: 'eval-source-map',
  debug: true,
  devServer: devServer,
  entry: [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client?reload=true',
    path.join(__dirname, 'app/main.js')
  ],
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name].js',
    publicPath: devServer.publicPath
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel',
        exclude: /node_modules|lib/,
      },
      {
        test: /\.json?$/,
        loader: 'json'
      },
      {
        test: /\.css$/,
        loader: 'style!css?modules&localIdentName=[name]---[local]---[hash:base64:5]'
      },
      {
        test: /\.scss$/,
        loaders: [
          'style?sourceMap',
          'css?modules&importLoaders=1&localIdentName=[name]--[local]',
          'sass?sourceMap'
        ],
        exclude: /node_modules|lib/
      },
    ],
  },
  plugins: [
    new WriteFilePlugin(),
    new ExtractTextPlugin('app.css', {
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      template: 'app/index.tpl.html',
      inject: 'body',
      filename: 'index.html'
    }),
  ],
  node: {
    fs: 'empty'
  }
};
