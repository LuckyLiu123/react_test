import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Switch, Route } from 'react-router-dom'
import asyncComponent from '@/asyncComponent';

const Layout = asyncComponent(() => import(/* webpackChunkName: "Layout"*/'@/layout'))

ReactDOM.render(
    <HashRouter>
        <Switch>
            <Route key="/Layout" path="/*" component={Layout} />
        </Switch>
    </HashRouter>,
    document.getElementById('root')
)

//当使用了module.hot.accept后，热更新只会更新对应的模块，并不会刷新整个页面。
if (module.hot) {
    // 实现热更新
    module.hot.accept();
}