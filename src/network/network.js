import reqwest from 'reqwest'
import config from 'config'
import {message} from 'antd'

//异常提示
const ErrorMsg = {
    network: {
        code: '-1',
        msg: '网路连接失败，请稍后再试'
    },
    data: {
        code: '-2',
        msg: '数据处理异常'
    },
    params: {
        code: '-3',
        msg: '参数处理异常'
    },
    result: '数据返回异常'
}

//配置
const configs = {
    timeout: 15000
}

//公共网路请求
export default class{
    constructor(configs){
        this.processResponse = configs.processResponse || function(data){
            return data;
        }
        this.processRequest = configs.processRequest || function(data){
            return data;
        }
    }

    get(options, cfg){
        options.method = 'get';
        return this.ajax(options, cfg);
    }

    post(options, cfg){
        options.method = 'post';
        return this.ajax(options, cfg);
    }

    /**
     * 数据请求
     * @param options
     * {
     *      host: 请求域名
     *      url: 请求路径
     *      method: 请求方法 get|post
     *      data: 请求数据
     *      type: 可以不写，默认为json
     *      timeout: 超时时间，15000
     *      contentType: 可以不写，默认 'application/json;charset=utf-8'
     *      cp: 是否打印请求时传的 data 数据
     * }
    */
    ajax(options, cfg){
        let self = this;
        if(options.cp){
            console.log(options.data);
        }
        if(options == null || !options.url){
            return new Promise((resolve) => {
                resolve(ErrorMsg.network);
            })
        }
        if(isMock){
            return reqwest({
                url: `/mock/${options.url}`
            })
        }
        cfg = Object.assign({
            req: true,
            res: true
        }, cfg);

        options.host = options.options || config.host;
        let url = `${options.host}${options.url}`;
        options.method = options.method || 'post';
        options.data = options.data || {};
        options.timeout = options.timeout || configs.timeout;

        //加签加密
        // try{
        //     options.data = self.processRequest(options.data, cfg);
        // } catch (e){
        //     return new Promise((resolve) => {
        //         resolve(Object.assign(ErrorMsg.params, {
        //             error: e.message
        //         }));
        //     })
        // }

        const optionsUrl = options.url;
        delete options.url;
        delete options.host;
        delete options.encRes;
        delete options.encReq;
        options.crossOrigin = true;
        options.withCredentials = true;
        options.processData = false;
        options.data = JSON.stringify(options.data);
        options.type = 'json';
        options.contentType = 'application/json';

        //网路请求
        return new Promise((resolve) => {
            var ts = +new Date();
            options.error = (err) => {
                let tt = Math.abs(+new Date() - ts);
                if(Math.abs(options.timeout - tt) < 50){
                    resolve(Object.assign(ErrorMsg.network, {
                        error: err
                    }))
                }
            }

            reqwest({url, ...options}).then((result) => {
                try{
                    result.data = result.responseData;
                    result.code = result.responseCode;
                    result.msg = result.responseMessage || ErrorMsg.result;
                    delete result.responseData;
                    delete result.responseCode;
                    delete result.responseMessage;
                    if(result.code === '900092'){
                        message.error('用户未登陆，请登陆');
                        history.push('/login');
                    }else{
                        if(result.code !== '000000'){
                            message.error(result.msg, 3, () => {
                                resolve(result);
                            })
                        }else{
                            resolve(result);
                        }
                    }
                } catch (e){
                    resolve(Object.assign(ErrorMsg.data, {
                        error: e.message
                    }))
                }
            }).fail((e) => {
                resolve(Object.assign(ErrorMsg.network, {
                    error: e
                }))
            })
        })
    }
}