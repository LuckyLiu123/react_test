const path = require('path')
const fs = require('fs')
const baseConfig = require('./webpack.config.base')
const { merge } = require('webpack-merge')
const webpack = require('webpack')
const NODE_ENV = process.env.NODE_ENV
const ctxPath = path.resolve(__dirname, '../')
const distPath = path.join(ctxPath, 'dist')

const devConfig = merge(baseConfig, {
    mode: 'development',
    output: {
        path: distPath,  //将文件打包到此目录下
        // publicPath: 'dist'
    },
    devtool: 'source-map',   //报错的时候在控制台输出哪一行报错
    plugins: [
        //定义全局变量的插件，定义的变量可以在webpack打包范围内任意js范围内访问
        new webpack.DefinePlugin({
            'mode': JSON.stringify('development'),
            'isMock': NODE_ENV === 'mock' ? true : false
        })
    ],
    /**
     * 1. webpack-dev-sever如何定位文件?
     *   - webpack-dev-sever是静态资源服务器，他会通过你的output配置去读取文件，通过’/’分割以文件查找的模式匹配
     *     文件。这样自然就产生问题了，因为你配置的路由并不是实际存在的文件，根据文件查找的方式是找不到的，只会404。
     *   - webpack有一个选项devServer用于协助wepack-dev-server支持h5 history api的路由；
     *   - output.publicPath告诉webpack从该路径下寻找文件，在这里也就是把build当成文件系统入口，根路径；
     *   - devServer.historyApiFallback的意思是当路径匹配的文件不存在时不出现404,而是取配置的选项historyApiFallback.index对应的文件;
     * 
     * historyApiFallback: 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html，默认禁用，传true启用
    */
    devServer: {
        historyApiFallback: true,
        hot: true,
        port: 8100,
        //contentBase: 告诉服务器从哪个目录中提供内容。只有在你想要提供静态文件时才需要;默认情况下，将使用当前工作目录作为提供内容的目录
        contentBase: './src',
    }
})

if(NODE_ENV === 'mock'){
    //before: 在服务内部的所有其他中间件之前， 提供执行自定义中间件的功能。 这可以用来配置自定义处理程序
    devConfig.devServer.before = function(app){
        app.get('/mock/*', mockResult)
        app.post('/mock/*', mockResult)
    }
}

//返回请求的 mock 数据
function mockResult(req, res){
    let mSecond = Math.random() * 1000;
    console.log('req=>>', req);
    let url = req.originalUrl.replace(/\?.*/, '').replace(/\..*$/, '') + '.json';
    let result = JSON.parse(fs.readFileSync(`${ctxPath}${url}`), 'utf-8');
    new Promise(function (resolve){
        setTimeout(function (){
            resolve();
            res.json(result);
        }, mSecond)
    })
}

module.exports = devConfig;