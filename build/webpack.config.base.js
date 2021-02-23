const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ctxPath = path.resolve(__dirname, '../')

module.exports = {
    entry: {
        index: [`${ctxPath}/src/index.js`]
    },
    output: {
        filename: '[name].[hash:8].js',
        chunkFilename: 'js/[name].[chunkhash:8].js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: [
                    `${ctxPath}/node_modules/`
                ],
                loader: 'babel-loader'
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', 'jsx', 'tsx', '.ts', '.json']
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(`${ctxPath}/public`, 'index.html'),  //html模版路径
            inject: true,    //是否将js放在body的末尾
        })
    ]
}