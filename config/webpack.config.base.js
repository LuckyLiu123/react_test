const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const baseUrl = path.resolve(__dirname, '../');
console.log('baseUrl=>>', baseUrl);

module.exports = {
    entry: `${baseUrl}/src/index.js`,
    output: {
        filename: "[name].[hash:8].js",
        path: path.resolve(__dirname, `${baseUrl}/dist`)
    },
    module: {
        rules: [

        ]
    },
    plugins: [
        new HtmlWebpackPlugin()
    ]
}








