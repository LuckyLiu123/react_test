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

    }
}