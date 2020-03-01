const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
	mode: 'production',
	output: {
		filename: 'js/[name].[hash].js',
		path: path.resolve(__dirname, '../../', 'dist'),
		chunkFilename: 'js/[name].[chunkhash].js',
		publicPath: '/',
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				// Use multi-process parallel running to improve the build speed
				// Default number of concurrent runs: os.cpus().length - 1
				parallel: true,
				// Enable file caching
				cache: true,
				sourceMap: true,
			}),
			new OptimizeCSSAssetsPlugin(),
		],
		// Automatically split vendor and commons
		// https://twitter.com/wSokra/status/969633336732905474
		// https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
		splitChunks: {
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'initial',
				},
				async: {
					test: /[\\/]node_modules[\\/]/,
					name: 'async',
					chunks: 'async',
					minChunks: 4,
				},
			},
		},
		// Keep the runtime chunk separated to enable long term caching
		// https://twitter.com/wSokra/status/969679223278505985
		runtimeChunk: true,
	},
	plugins: [
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: 'css/[name].css',
			chunkFilename: 'css/[name].css',
		}),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
			'process.env.API_URL': JSON.stringify(process.env.API_URL),
		}),
	],
	devtool: 'source-map',
};
