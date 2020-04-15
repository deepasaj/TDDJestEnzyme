// Source: https://github.com/HashemKhalifa/webpack-react-boilerplate
const webpackMerge = require('webpack-merge');
const common = require('./config/webpack/base');

/* eslint-disable global-require,import/no-dynamic-require */
const env = process.env.NODE_ENV || 'development';
const envConfig = require(`./config/webpack/${env}.js`);
module.exports = webpackMerge(common, envConfig);
