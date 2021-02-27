import React, { Component } from 'react';
import asyncComponent from '@/asyncComponent';

const MainView = asyncComponent(() => import(/* webpackChunkName: "MainView" */'@/view/main'));
const TestView = asyncComponent(() => import(/* webpackChunkName: "TestView" */'@/view/test'));

import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { message } from 'antd';
const routes = [
    {
        path: '/main',
        component: MainView,
        name: 'main'
    },
    {
        path: '/test',
        component: TestView,
        name: 'test'
    }
]

export default class extends Component{
    render(){
        const { keyValue } = this.props
        return (
            <Router>
                <Switch>
                    {
                      routes.map((route, index) => {
                        <Route 
                            key={route.path}
                            path={route.path}
                            render={(props) => {
                                if(props.location.pathname != route.path || this._beforeRender(props, route.path)){
                                    return <route.component {...props} keyValue={keyValue} />
                                }else{
                                    return <Redirect to='/main' />
                                }
                            }}
                        />
                      })  
                    }
                    <Redirect from='/' to='/Redirect' />
                </Switch>
            </Router>
        )
    }

    _beforeRender(props, path){
        const userInfo = {roleId: '123'}
        const permissons = ['/test'];
        if(!userInfo.roleId && permissons.includes(path)){
            message.info('请先登陆');
            return false;
        }
        if((userInfo.roleId && (userInfo.roleId === '00')) && path === '/test'){
            message.info('您没有权限进入该页面');
            return false;
        }
        return true;
    }
}








