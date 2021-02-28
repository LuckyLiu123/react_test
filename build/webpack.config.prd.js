const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const ctxPath = path.resolve(__dirname, '../')
const outPath = path.join(ctxPath, 'dist')
const webpack = require('webpack')
const config = require('../config/prd/index.js')
const TerserPlugin = require('terser-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

module.exports = merge(baseConfig, {
    mode: 'production',
    output: {
        path: `${ctxPath}/dist`,  //将文件打包到此目录下
    },
    resolve: {
        alias: {
            'config': `${ctxPath}/config/prd`
        }
    },
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: 'static'
        }),
        new CompressionWebpackPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: productionGzipExtensions,
            threshold: 10240,
            minRatio: 0.8,
            deleteOriginalAssets: false
        }),
        new webpack.DefinePlugin({
            'conf': config
        }),
        new webpack.DefinePlugin({
            'mode': JSON.stringify('prd'),
            'isMock': false
        })
    ],
    optimization: {
        runtimeChunk: 'single',
        minimize: true,
        moduleIds: 'hashed',  //告诉webpack在选择模块id时使用哪种算法。设置优化
        namedChunks: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        warnings: false,
                        drop_console: true,
                        drop_debugger: true,
                        pure_funcs: ['console.log']
                    }
                }
            })
        ],
        splitChunks: {
            chunks: 'all',
            minSize: 0,
            cacheGroups: {
                default: {
                    chunks: 'all',
                    minSize: 3000,
                    minChunks: 2,
                    maxAsyncRequests: 2,
                    maxInitialRequests: 2,
                    priority: -20,
                    reuseExistingChunk: true
                },
                vendor: {
                    name: 'vendor',
                    chunks: 'all',  //必须三选一： "initial" | "all" | "async"(默认就是异步)
                    reuseExistingChunk: true,
                    priority: -5,
                    minChunks: 2,
                    maxInitialRequests: 35,
                    enforce: true,
                    test: /[\\/]node_modules[\\/]/,
                },
                vivagraph: {
                    name: 'vivagraph',
                    chunks: 'all',
                    priority: -1,
                    test: /[\\/]src[\\/]components[\\/]third[\\/]vivagraph[\\.]js/,
                },
                react: {
                    name: 'react',
                    chunks: 'all',
                    priority: -1,
                    test: /[\\/]node_modules[\\/](react||react-dom)[\\/]/
                }
            }
        }
    }
})