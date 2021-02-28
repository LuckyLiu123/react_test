const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const ctxPath = path.resolve(__dirname, '../')
const outPath = path.join(ctxPath, 'dist')
const webpack = require('webpack')
const config = require('../config/stg/index')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const FileManagerPlugin = require('filemanager-webpack-plugin')

module.exports = merge(baseConfig, {
    mode: 'development',
    output: {
        path: `${ctxPath}/dist`,   //将文件打包到此目录下
    },
    resolve: {
        alias: {
            'config': `${ctxPath}/config/stg`
        }
    },
    devtool: 'source-map',   //报错的时候在控制台输出哪一行报错
    plugins: [
        new webpack.DefinePlugin({
            'mode': JSON.stringify('stg'),
            'isMock': false,
            'conf': config
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static'
        }),
        new FileManagerPlugin({
            onEnd: {
                delete: [
                    `${outPath}.zip`,  //删除以前的zip包
                ],
                archive: [{
                    source: `${outPath}`,
                    destination: `./dist.zip`
                }]
            }
        })
    ],
    optimization: {
        runtimeChunk: 'single',
        moduleIds: 'hashed',  //告诉webpack在选择模块id时使用哪种算法。设置优化
        namedChunks: true,  //告知 webpack 使用可读取 chunk 标识符(readable chunk identifiers)，来帮助更好地调试
        splitChunks: {
            chunks: 'all',
            minSize: 0,
            cacheGroups: {
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