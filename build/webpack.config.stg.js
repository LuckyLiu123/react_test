const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const ctxPath = path.resolve(__dirname, '../')
const outPath = path.join(ctxPath, 'dist')
const webpack = require('webpack')
const config = require('../config/stg/index')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const fileManagerPlugin = require('filemanager-webpack-plugin')

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
        new fileManagerPlugin({
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
    ]
})