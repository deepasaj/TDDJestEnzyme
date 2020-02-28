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
	devServer: {
		publicPath: '/',
		contentBase: path.resolve(__dirname, '../../', 'build'),
		compress: true,
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
		}),
	],
};
