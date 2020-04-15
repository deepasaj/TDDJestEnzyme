/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const convert = require('koa-connect');
const history = require('connect-history-api-fallback');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, '../../', 'src/index.jsx'),
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/,
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        include: /node_modules\/material-dashboard-react/,
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.(woff2|ttf|woff|eot)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'fonts',
            },
          },
        ],
      },
    ],
  },
  serve: {
    add: (app) => app.use(convert(history())),
    content: path.resolve(__dirname, '../../', 'src/index.jsx'),
    dev: {
      publicPath: path.resolve(__dirname, '../../', 'build'),
    },
    open: true,
  },
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
      assets: path.resolve(__dirname, '../../src/assets'),
      components: path.resolve(__dirname, '../../src/components'),
      config: path.resolve(__dirname, '../../src/config'),
      hooks: path.resolve(__dirname, '../../src/hooks'),
      services: path.resolve(__dirname, '../../src/services'),
      store: path.resolve(__dirname, '../../src/store'),
      styles: path.resolve(__dirname, '../../src/styles'),
      utils: path.resolve(__dirname, '../../src/utils'),
    },
    modules: [
      path.resolve(path.resolve(__dirname, '../..'), 'node_modules'),
      path.resolve(path.resolve(__dirname, '../..'), 'src'),
    ],
    extensions: ['*', '.js', '.json', '.jsx', '.css'],
  },
  plugins: [
    // material-dashboard-react is using aliases, the only way to resolve this file is to replace import with full path
    new webpack.NormalModuleReplacementPlugin(
      /^assets\/jss\/material-dashboard-react/,
      (resource) => {
        /* eslint-disable no-param-reassign */
        resource.request = resource.request.replace(
          'assets/jss/material-dashboard-react',
          'material-dashboard-react/src/assets/jss/material-dashboard-react',
        );
      },
    ),
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../../', 'src/index.html'),
      favicon: path.resolve(__dirname, '../../', 'src/assets/img/favicon2.ico'),
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async',
    }),
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.js|node_modules/,
      // add errors to webpack instead of warnings
      failOnError: true,
      // set the current working directory for displaying module paths
      cwd: process.cwd(),
    }),
  ],
};
