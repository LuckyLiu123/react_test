import React, { Component } from 'react';
import asyncComponent from '@/asyncComponent';

const MainView = asyncComponent(() => import(/* webpackChunkName: "MainView" */'@/view/main'));
const TestView = asyncComponent(() => import(/* webpackChunkName: "TestView" */'@/view/test'));
const LoginView = asyncComponent(() => import(/* webpackChunkName: "LoginView" */'@/view/login'));

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
    },
    {
        path: '/login',
        component: LoginView,
        name: 'login'
    }
]

export default class extends Component{
    constructor(props){
        super(props);
    }

    render(){
        // const { keyValue } = this.props
        return (
            <Router>
                <Switch>
                    {
                      routes.map((route, index) => {
                        return <Route 
                                key={route.path}
                                path={route.path}
                                render={(props) => {
                                    // console.log('props=>>', props);
                                    if(props.location.pathname != route.path || this._beforeRender(props, route.path)){
                                        return <route.component {...props}  />  //keyValue={keyValue}
                                    }else{
                                        return <Redirect to='/main' />
                                    }
                                }}
                            />
                        })  
                    }
                    <Redirect from='/' to='/main' />
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








