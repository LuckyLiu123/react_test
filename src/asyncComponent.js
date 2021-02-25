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
        }
    }
})