/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'development',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../../', 'build'),
    chunkFilename: '[name].js',
    publicPath: '/',
  },
  devtool: 'source-map',
  devServer: {
    publicPath: '/',
    contentBase: path.resolve(__dirname, '../../', 'build'),
    compress: true,
    host: process.env.HOST || '127.0.0.1',
    port: process.env.PORT || 3000,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: true,
    watchOptions: {
      ignored: /node_modules/,
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
      'process.env.ODIC_REDIRECT_URI': JSON.stringify(process.env.ODIC_REDIRECT_URI),
    }),
  ],
};
