import React, { Component } from 'react'
import PropTypes, { func } from 'prop-types'
import { Liftcycle } from 'react-router-dom'

export default (() => {
    var firstFlag = false;  //标识是否是第一个页面加载完成
    const imprtArray = [];
    doImport();

    function doImport(){
        setTimeout(() => {
            if(firstFlag){  //加载完成后才再延迟600ms加载其他页面，否则 getSSTicket得不到值
                setTimeout(() => {
                    while(imprtArray.length){
                        imprtArray.pop()();
                    }
                }, 600)
            }else{
                doImport();
            }
        }, 300)
    }

    return function (importComponent){
        var preComponent = null;
        imprtArray.push(() => {
            importComponent().then(res => {
                preComponent = res;
            })
        })

        class AsyncComponent extends Component{
            constructor(props){
                super(props);
                this.state = {
                    component: null
                }
                this.getChildContext = this.getChildContext.bind(this);
                this.conArray = ['hash', 'pathname', 'search', 'stats']
            }

            //使用 Context 首先需要在父组件定义 static ContextTypes上下文数据类型
            static childContextTypes = {
                router: PropTypes.object.isRequired
            }

            getChildContext(){
                return {router: this.props.history}
            }

            initSearch(){  //将 url 中的参数转化为 location 中的参数
                let paramStr = window.location.href.split('?')[1];
                const param = {};
                if(paramStr){
                    paramStr = decodeURIComponent(paramStr);
                    const paramArr = paramStr.split('&');
                    paramArr.forEach((item) => {
                        const valuesArr = item.split('=');
                        const value1 = valuesArr[1].replace(/%22/g, '"');
                        try{
                            const value = JSON.parse(value1);
                            param[valuesArr[0]] = value;
                        } catch (e){
                            param[valuesArr[0]] = valuesArr[1];
                        }
                    })
                }
                return param;
            }

            async componentDidMount(){
                if(this.hasLoadedComponent()){
                    return;
                }
                const paramStr = this.initParam(this.props.location);
                if(paramStr){
                    window.history.replaceState('', '', `#${this.props.location.pathname}?${encodeURIComponent(paramStr)}`);
                }
                preComponent = preComponent ? preComponent : await importComponent();
                if(!firstFlag){
                    firstFlag = true;
                }
                const {default: component} = preComponent;
                this.setState({
                    component: component
                })
            }

            hasLoadedComponent() {
                return this.state.component !== null;
            }

            componentWillUnmount(){
                this.state = (state, callback) => {
                    return
                }
            }

            isJson(obj){
                var isJson = typeof(obj) === 'object' && Object.prototype.toString.call(obj).toLowerCase() === '[object object]' && !obj.length;
                return isJson;
            }

            initParam(location){  //将location 中的参数转化为 url 参数
                const param = location;
                let paramStr = '';
                Object.keys(param).forEach((key) => {
                    if(this.conArray.includes(key)){
                        return;
                    }
                    if(param[key]){
                        paramStr = paramStr + key + '=' + (this.isJson(param[key]) ? JSON.stringify(param[key]) : param[key]) + '&';
                    }
                })
                return paramStr ? paramStr.substring(0, paramStr.length - 1) : paramStr;
            }

            render(){
                const C = this.state.component;
                const props = {...this.props};
                let location = this.props.location;
                const param = this.initSearch();
                param.query = param.query || {};
                location = {...location, ...param};
                props.location = location;
                return C ? <C {...props} /> : null;
            }
        }
        return AsyncComponent;
    }
})();