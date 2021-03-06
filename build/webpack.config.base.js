const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ctxPath = path.resolve(__dirname, '../')
const srcPath = path.resolve(__dirname, '../src')

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
            },
            { 
                //.scss 解析
                test: /\.s?css$/,
                use: [
                    // {
                    //     loader: MiniCssExtractPlugin.loader,
                    //     options: {
                    //         publicPath: '../'
                    //     }
                    // },
                    "style-loader",
                    "css-loader",
                    "postcss-loader",
                    "sass-loader",
                    // {
                    //     loader: 'sass-resources-loader',
                    //     options: {
                    //         resources: [`${ctxPath}/src/styles/base.scss`]
                    //     }
                    // }
                ]
            },
            {
                //文件解析
                test: /\.(eot|woff|svg|ttf|woff2|appcache|mp3|mp4|pdf)(\?|$)/,
                loader: "file-loader"
            },
            {
                //图片解析
                test: /\.(png|jpg|jpeg|gif)$/,
                loader: "url-loader?limit=8192&name=image/[name].[hash:4].[ext]"
            }
        ]
    },
    resolve: {
        alias: {
            '@': srcPath
        },
        extensions: ['*', '.js', 'jsx', 'tsx', '.ts', '.json']
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[chunkhash].js',
            ignoreOrder: true
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.join(`${ctxPath}/public`, 'index.html'),  //html模版路径
            inject: true,    //是否将js放在body的末尾
        })
    ]
}